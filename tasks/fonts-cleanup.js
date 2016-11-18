'use strict';

// Task name and description
var taskName        = 'Fonts: Cleanup';
var taskDescription = 'Cleans the fonts from the working directory.';

// Task dependencies
var rimraf          = require('gulp-rimraf');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.dist.fonts + '**/*'
            ], { 
                allowEmpty : true,
                read       : false
            })
            .pipe(rimraf({
                force: true
            }));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
