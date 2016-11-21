'use strict';

// Task name and description
var taskName        = 'Fonts: Process';
var taskDescription = 'Process the fonts into the working directory.';

// Task dependencies
var copy            = require('gulp-copy');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var task = function () {
        var dest = config.paths.dist.fonts;

        if (config.building) {
            dest = config.paths.build.fonts;
        }

        if (config.minifying) {
            dest = config.paths.min.fonts;
        }

        return gulp.src([
                config.paths.source.fonts + '**/*'
            ])
            .pipe(copy(dest, {
                prefix: 3
            }));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
