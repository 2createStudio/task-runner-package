'use strict';

// Task name and description
var taskName        = 'Dist: Cleanup';
var taskDescription = 'Cleans the dist directory.';

// Task dependencies
var rimraf          = require('gulp-rimraf');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.dist.dir
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
