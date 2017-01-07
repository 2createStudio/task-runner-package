'use strict';

module.exports  = main;

var mergeDeep   = require('./helper/merge-deep');
var yargs       = require('yargs');
var fs          = require('fs');
var JSON5       = require('JSON5');

function main(gulp, browserSync, presetKey) {
    var availableBaseConfigPresets = {
        'wp-preset': './presets/wp.json',
        'html-preset': './presets/html.json'
    };

    var presetConfig = {};

    if (presetKey && presetKey in availableBaseConfigPresets) {
        presetConfig = require(availableBaseConfigPresets[presetKey]);
    }

    var config = {};

    updateConfig();

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
    var vendorCSSPackTask = getTask('vendorcss-pack');

    // Create serve tasks collection
    var serveTasksArray = [];
    var serveTasks = null;

    if (config.paths.dist.dir) serveTasksArray.push(getTask('dist-cleanup'));
    if (config.paths.dist.sprite) serveTasksArray.push(imagesSpriteRetinaResize);
    if (config.paths.dist.sprite) serveTasksArray.push(lazyRulesTask);
    if (config.paths.dist.css) serveTasksArray.push(cssProcessTask);
    if (config.paths.dist.js) serveTasksArray.push(jsProcessTask);
    if (config.paths.dist.html) serveTasksArray.push(htmlProcessTask);
    if (config.paths.dist.images) serveTasksArray.push(imagesCopyTask);
    if (config.paths.dist.fonts) serveTasksArray.push(fontsProcessTask);
    if (config.paths.dist.components) serveTasksArray.push(componentsProcessTask);
    if (config.paths.userIncludes.dir) serveTasksArray.push(userIncludesGetTask);
    if (config.paths.userIncludes.dir) serveTasksArray.push(userIncludesCopyTask);
    if (config.paths.dist.vendorCSS) serveTasksArray.push(vendorCSSPackTask);

    serveTasksArray.push(getTask('browsersync'));
    serveTasksArray.push(watchTask);

    if (config.paths.userIncludes.dir) serveTasksArray.push(userIncludesGetTask);

    serveTasks = gulp.series.apply( this, serveTasksArray );

    // Create min tasks collection
    var minTasksArray = [
        function(cb) {
            config.minifying = true;
            config.settings.css.minify = true;

            cb();
        }
    ];
    var minTasks = null;

    if (config.paths.min.dir) minTasksArray.push(getTask('min-cleanup'));
    if (config.paths.min.css) minTasksArray.push(cssProcessTask);
    if (config.paths.min.js) minTasksArray.push(jsProcessTask);
    if (config.paths.min.html) minTasksArray.push(htmlProcessTask);
    if (config.paths.min.images) minTasksArray.push(imagesOptimise);
    if (config.paths.min.fonts) minTasksArray.push(fontsProcessTask);
    if (config.paths.min.components) minTasksArray.push(componentsProcessTask);
    if (config.paths.userIncludes.dir) minTasksArray.push(userIncludesGetTask);
    if (config.paths.userIncludes.dir) minTasksArray.push(userIncludesCopyTask);
    if (config.paths.min.vendorCSS) minTasksArray.push(vendorCSSPackTask);

    minTasks = gulp.series.apply( this, minTasksArray );

    // Create build tasks collection
    var buildTasksArray = [
        function(cb) {
            config.building = true;
            config.makeSprite = true;

            cb();
        }
    ];

    var buildTasks = null;

    if (config.paths.build.dir) buildTasksArray.push(getTask('build-cleanup'));
    if (config.paths.build.sprite) buildTasksArray.push(imagesSpriteRetinaResize);
    if (config.paths.build.sprite) buildTasksArray.push(lazyRulesTask);
    if (config.paths.build.css) buildTasksArray.push(cssProcessTask);
    if (config.paths.build.js) buildTasksArray.push(jsProcessTask);
    if (config.paths.qa.dir) buildTasksArray.push(getTask('css-lint-cleanup'));
    if (config.paths.qa.dir) buildTasksArray.push(getTask('css-lint-save'));
    if (config.paths.build.html) buildTasksArray.push(htmlProcessTask);
    if (config.paths.build.images) buildTasksArray.push(imagesOptimise);
    if (config.paths.build.fonts) buildTasksArray.push(fontsProcessTask);
    if (config.paths.build.components) buildTasksArray.push(componentsProcessTask);
    if (config.paths.userIncludes.dir) buildTasksArray.push(userIncludesGetTask);
    if (config.paths.userIncludes.dir) buildTasksArray.push(userIncludesCopyTask);
    if (config.paths.build.vendorCSS) buildTasksArray.push(vendorCSSPackTask);

    buildTasksArray.push(minTasks);

    buildTasks = gulp.series.apply( this, buildTasksArray );

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
        if (config.paths.source.sprite) {
            gulp
                .watch([config.paths.source.sprite + '*@2x.png'])
                .on('all', imagesSpriteRetinaResize);
        }

        // Lazy rules watch
        if (config.paths.source.sprite) {
            gulp
                .watch([config.paths.source.sprite + '*.png', '!' + config.paths.source.sprite + '*@2x.png'])
                .on('all', lazyRulesTask);
        }

        // Images watch
        if (config.paths.source.images) {
            gulp
                .watch([config.paths.source.images + '**/*'])
                .on('all', gulp.series(getTask('images-cleanup'), imagesCopyTask));
        }

        // CSS watch
        if (config.paths.source.css) {
            gulp
                .watch([config.paths.source.css + '_*.css'])
                .on('all', cssProcessTask);
        }

        // JS watch
        if (config.paths.source.js) {
            gulp
                .watch([config.paths.source.js + '**/*.js'])
                .on('all', gulp.series(jsProcessTask));
        }

        // Components watch
        if (config.paths.source.components) {
            gulp
                .watch([config.paths.source.components + '**/*'])
                .on('all', gulp.series(getTask('components-cleanup'), componentsProcessTask));
        }

        // Fonts watch
        if (config.paths.source.fonts) {
            gulp
                .watch([config.paths.source.fonts + '**/*'])
                .on('all', gulp.series(getTask('fonts-cleanup'), fontsProcessTask));
        }

        // User Includes watch
        var configWatcher = gulp
            .watch([config.paths.config.dir + config.fileNames.config]);

        // Create config watch tasks collection
        var configWatchTasksArray = [updateConfig];
        var configWatchTasks = null;

        if (config.paths.userIncludes.dir) configWatchTasksArray.push(userIncludesCleanupTask);
        if (config.paths.userIncludes.dir) configWatchTasksArray.push(userIncludesGetTask);
        if (config.paths.userIncludes.dir) configWatchTasksArray.push(userIncludesCopyTask);

        if (config.paths.source.vendorCSS) configWatchTasksArray.push(vendorCSSPackTask);

        configWatchTasks = gulp.series.apply( this, configWatchTasksArray );

        configWatcher
            .on('change', configWatchTasks);

        // HTML watch
        if (config.paths.source.html) {
            gulp
                .watch([
                    config.paths.source.html + '**/*.html',
                    config.paths.source.html + '**/*.shtml',
                    config.paths.source.html + '**/*.php'
                ])
                .on('all', gulp.series(getTask('html-cleanup'), htmlProcessTask));
        }

        // CSS Snippets require watch
        if (config.paths.snippet.dir) {
            gulp
                .watch([config.paths.snippet.dir + config.fileNames.snippet.requires])
                .on('change', getTask('css-snippets-require'));
        }

        if (config.paths.userIncludes.dir) {
            config.userIncludesWatcher = gulp
                .watch()
                .on('all', gulp.series(userIncludesCleanupTask, userIncludesCopyTask));
        }

        cb && cb();
    }

    function getBaseConfig() {
        return JSON5.parse(fs.readFileSync((yargs.argv.devDir || '.') + '/.2c-gulp-rc'));
    }

    function updateConfig(cb) {
        mergeDeep(config, require('./helper/args-config')(mergeDeep(presetConfig, getBaseConfig())));

        cb && cb();
    }
}
