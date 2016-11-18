'use strict';

module.exports = main;

function main(gulp, browserSync, baseConfig) {
    var config = require('./helper-args-config')(baseConfig);

    // Collect multi-used tasks
    var cssProcessTask = getTask('css-process');
    var imagesSpriteRetinaResize = getTask('images-sprite-retina-resize');
    var lazyRulesTask = getTask('lazy-sprite-rules');
    var jsProcessTask = getTask('js-process');
    var htmlIncludeTask = getTask('html-include');
    var imagesCopyTask = getTask('images-copy');
    var userIncludesGetTask = getTask('user-includes-get');
    var userIncludesCleanupTask = getTask('user-includes-cleanup');
    var userIncludesCopyTask = getTask('user-includes-copy');
    var fontsCopyTask = getTask('fonts-copy');

    // Create serve tasks collection
    var serveTasks = gulp.series(
        getTask('dist-cleanup'),
        imagesSpriteRetinaResize,
        lazyRulesTask,
        cssProcessTask,
        jsProcessTask,
        htmlIncludeTask,
        imagesCopyTask,
        fontsCopyTask,
        userIncludesGetTask,
        userIncludesCopyTask,
        getTask('browsersync'),
        watchTask
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
        htmlIncludeTask,
        getTask('images-optimise'),
        fontsCopyTask,
        userIncludesGetTask,
        userIncludesCopyTask
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
        gulp.watch([config.paths.source.sprite + '*@2x.png'], imagesSpriteRetinaResize);

        // Lazy rules watch
        gulp.watch([config.paths.source.sprite + '*.png', '!' + config.paths.source.sprite + '*@2x.png'], lazyRulesTask);

        // Images watch
        gulp.watch([config.paths.source.images + '**'], gulp.series(getTask('images-cleanup'), imagesCopyTask));

        // CSS watch
        gulp.watch([config.paths.source.css + '_*.css'], cssProcessTask);

        // JS watch
        gulp.watch([config.paths.source.js + '*.js'], gulp.series(getTask('js-cleanup'), jsProcessTask, browserSync.reload));

        // Fonts watch
        gulp.watch([config.paths.source.fonts + '*/**'], gulp.series(getTask('fonts-cleanup'), fontsCopyTask, browserSync.reload));

        // User Includes watch
        gulp.watch([config.paths.userIncludes.dir + config.fileNames.userIncludes.requires], gulp.series(userIncludesCleanupTask, userIncludesGetTask, userIncludesCopyTask));

        // HTML watch
        gulp.watch([
            config.paths.source.html + '**/*.html',
            config.paths.source.html + '**/*.shtml',
            config.paths.source.html + '**/*.php'
        ]).on('change', gulp.series(getTask('html-cleanup'), htmlIncludeTask, browserSync.reload));


        gulp.watch([config.paths.source.css + '_mixin-requires.css'], gulp.series(getTask('css-snippets-require')));

        cb();
    }
}
