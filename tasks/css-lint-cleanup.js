'use strict';

// Task name and description
var taskName        = 'CSS Lint: Cleanup';
var taskDescription = 'Cleans the CSS lint logfile.';

// Task dependencies
var rimraf          = require('gulp-rimraf');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.qa.logs + config.fileNames.qa.logs.css
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
