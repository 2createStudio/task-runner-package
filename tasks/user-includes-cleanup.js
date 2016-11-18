'use strict';

// Task name and description
var taskName        = 'User Includes: Cleanup';
var taskDescription = 'Cleans the user includes from the working directory.';

// Task dependencies
var rimraf          = require('gulp-rimraf');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        var src = [];

        for (var i = 0; i < config.settings.userIncludes.paths.length; i++) {
            src.push(config.paths.dist.dir + config.settings.userIncludes.paths[i].replace(/\*\*\/\*$/, ''));
        }

        return gulp.src(src, { 
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
