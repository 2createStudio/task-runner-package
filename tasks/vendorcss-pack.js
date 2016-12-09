'use strict';

// Task name and description
var taskName        = 'VendorCSS: Pack';
var taskDescription = 'Packs vendor CSS.';

// Task dependencies
var concatCSS       = require('gulp-concat-css');
var cleanCSS        = require('gulp-clean-css');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var task = function () {
        var dest = config.paths.dist.vendorCSS;
        var fileName = config.fileNames.dist.vendorCSS;

        if (config.building) {
            dest = config.paths.build.vendorCSS;
            fileName = config.fileNames.build.vendorCSS;
        }

        if (config.minifying) {
            dest = config.paths.min.vendorCSS;
            fileName = config.fileNames.min.vendorCSS;
        }

        var src = [];

        for (var i = 0; i < config.vendorCSS.length; i++) {
            src.push(config.paths.source.vendorCSS + config.vendorCSS[i]);
        }

        return gulp.src(src)
            .pipe(concatCSS(fileName))
            .pipe(cleanCSS())
            .pipe(gulp.dest(dest));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
