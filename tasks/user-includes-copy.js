'use strict';

// Task name and description
var taskName        = 'User Includes: Copy';
var taskDescription = 'Copies the user include files and directories into the working directory.';

// Task dependencies
var copy            = require('gulp-copy');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        var dest = config.paths.dist.dir;

        if (config.building) {
            dest = config.paths.build.dir;
        }

        if (config.minifying) {
            dest = config.paths.min.dir;
        }

        var src = [];

        for (var i = 0; i < config.settings.userIncludes.paths.length; i++) {
            src.push(config.paths.source.dir + config.settings.userIncludes.paths[i]);
        }

        return gulp.src(src, {
                allowEmpty : true
            })
            .pipe(copy(dest, {
                prefix: 1
            }));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
