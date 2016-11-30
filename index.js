'use strict';

module.exports = main;

function main(gulp, browserSync, baseConfig) {
    var config = require('./helper/args-config')(baseConfig);

    // Collect multi-used tasks
    var cssProcessTask = getTask('css-process');
    var imagesSpriteRetinaResize = getTask('images-sprite-retina-resize');
    var lazyRulesTask = getTask('lazy-sprite-rules');
    var jsProcessTask = getTask('js-process');
    var htmlProcessTask = getTask('html-process');
    var imagesCopyTask = getTask('images-copy');
    var userIncludesGetTask = getTask('user-includes-get');
    var userIncludesCleanupTask = getTask('user-includes-cleanup');
    var componentsProcessTask = getTask('components-process');
    var userIncludesCopyTask = getTask('user-includes-copy');
    var fontsProcessTask = getTask('fonts-process');
    var imagesOptimise = getTask('images-optimise');

    // Create serve tasks collection
    var serveTasks = gulp.series(
        getTask('dist-cleanup'),
        imagesSpriteRetinaResize,
        lazyRulesTask,
        cssProcessTask,
        jsProcessTask,
        htmlProcessTask,
        imagesCopyTask,
        fontsProcessTask,
        componentsProcessTask,
        userIncludesGetTask,
        userIncludesCopyTask,
        getTask('browsersync'),
        watchTask,
        userIncludesGetTask
    );

    var minTasks = gulp.series(
        function(cb) {
            config.minifying = true;
            config.settings.css.minify = true;

            cb();
        },
        getTask('min-cleanup'),
        cssProcessTask,
        jsProcessTask,
        htmlProcessTask,
        imagesOptimise,
        fontsProcessTask,
        componentsProcessTask,
        userIncludesGetTask,
        userIncludesCopyTask
    );

    // Create build tasks collection
    var buildTasks = gulp.series(
        function(cb) {
            config.building = true;
            config.makeSprite = true;

            cb();
        },
        getTask('build-cleanup'),
        imagesSpriteRetinaResize,
        lazyRulesTask,
        jsProcessTask,
        cssProcessTask,
        getTask('css-lint-cleanup'),
        getTask('css-lint-save'),
        htmlProcessTask,
        imagesOptimise,
        fontsProcessTask,
        componentsProcessTask,
        userIncludesGetTask,
        userIncludesCopyTask,
        minTasks
    );

    var developmentTasks = gulp.parallel(
        serveTasks,
        getTask('development')
    );

    return {
        serveTasks: serveTasks,
        buildTasks: buildTasks,
        developmentTasks: developmentTasks
    }

    function getTask (name, watch) {
        return require('./tasks/' + name)(gulp, browserSync, config);
    }

    function watchTask(cb) {
        // Images sprite resize
        gulp
            .watch([config.paths.source.sprite + '*@2x.png'])
            .on('all', imagesSpriteRetinaResize);

        // Lazy rules watch
        gulp
            .watch([config.paths.source.sprite + '*.png', '!' + config.paths.source.sprite + '*@2x.png'])
            .on('all', lazyRulesTask);

        // Images watch
        gulp
            .watch([config.paths.source.images + '**/*'])
            .on('all', gulp.series(getTask('images-cleanup'), imagesCopyTask));

        // CSS watch
        gulp
            .watch([config.paths.source.css + '_*.css'])
            .on('all', cssProcessTask);

        // JS watch
        gulp
            .watch([config.paths.source.js + '*.js'])
            .on('all', gulp.series(getTask('js-cleanup'), jsProcessTask));

        // Components watch
        gulp
            .watch([config.paths.source.components + '**/*'])
            .on('all', gulp.series(getTask('components-cleanup'), componentsProcessTask));

        // Fonts watch
        gulp
            .watch([config.paths.source.fonts + '**/*'])
            .on('all', gulp.series(getTask('fonts-cleanup'), fontsProcessTask));

        // User Includes watch
        gulp
            .watch([config.paths.userIncludes.dir + config.fileNames.userIncludes.requires])
            .on('change', gulp.series(userIncludesCleanupTask, userIncludesGetTask, userIncludesCopyTask));

        // HTML watch
        gulp
            .watch([
                config.paths.source.html + '**/*.html',
                config.paths.source.html + '**/*.shtml',
                config.paths.source.html + '**/*.php'
            ])
            .on('all', gulp.series(getTask('html-cleanup'), htmlProcessTask));

        // CSS Snippets require watch
        gulp
            .watch([config.paths.snippet.dir + config.fileNames.snippet.requires])
            .on('change', getTask('css-snippets-require'));

        config.settings.userIncludes.watcher = gulp
            .watch()
            .on('all', gulp.series(userIncludesCleanupTask, userIncludesCopyTask));

        cb();
    }
}
