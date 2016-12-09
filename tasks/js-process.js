'use strict';

// Task name and description
var taskName        = 'JS: Process';
var taskDescription = 'Compiles the JS.';

// Task dependencies
var path            = require('path');
var webpack         = require('webpack');
var webpackStream   = require('webpack-stream');
var rename          = require("gulp-rename");

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        var dest = config.paths.dist.js;
        var filename = config.fileNames.dist.js;

        config.settings.webpack.plugins = [];
        config.settings.webpack.plugins.push(new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }));

        config.settings.webpack.resolveLoader = {
            modulesDirectories: [
                path.dirname(config.settings.gulpfile || './') + '/node_modules',
                'node_modules',
                __dirname + '/../node_modules'
            ]
        };

        if (config.building) {
            dest = config.paths.build.js;
            filename = config.fileNames.build.js;
        }

        if (config.minifying) {
            dest = config.paths.min.js;
            filename = config.fileNames.min.js;
        }

        config.settings.webpack.module.loaders.forEach(function(item) {
            if (item.test) {
                item.test = new RegExp(item.test);
            }

            if (item.exclude) {
                item.exclude = new RegExp(item.exclude);
            }

            item.query.presets = item.query.presets.map(function(item) {
                return require.resolve('babel-preset-es2015');
            });

        });

        return gulp.src([
                config.paths.source.js + 'app.js'
            ])
            .pipe(webpackStream(config.settings.webpack))
            .pipe(rename(filename))
            .pipe(gulp.dest(dest))
            .pipe(browserSync.reload({stream: true}));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
