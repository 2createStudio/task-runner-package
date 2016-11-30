'use strict';

// Task name and description
var taskName        = 'HTML: Include';
var taskDescription = 'SSI Includes';

// Task dependencies
var gulpSSI         = require('./../plugins/gulp-deep-ssi');
var gulpif          = require('gulp-if');
var htmlmin         = require('gulp-htmlmin');
var inlinesource    = require('gulp-inline-source');
var strip           = require('gulp-strip-comments');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var task = function () {
        var dest = config.paths.dist.html;
        var src = [
            config.paths.source.html + '*.+(html|php)'
        ];

        if (config.building) {
            dest = config.paths.build.html;
        }

        if (config.minifying) {
            dest = config.paths.min.html;
            src = [
                config.paths.build.html + '*.+(html|php)'
            ];
        }

        return gulp.src(src)
            .pipe(gulpSSI({
                baseDir: config.paths.source.html
            }))
            .pipe(gulpif(config.minifying, htmlmin({collapseWhitespace: true})))
            .pipe(gulpif(config.minifying, inlinesource({compress: true})))
            .pipe(gulpif(config.minifying, strip()))
            .pipe(gulp.dest(dest))
            .pipe(browserSync.reload({stream: true}));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
