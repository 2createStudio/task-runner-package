'use strict';

// Task name and description
var taskName        = 'JS: Process';
var taskDescription = 'Compiles the JS.';

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        var dest = config.paths.dist.js;

        if (config.building) {
            dest = config.paths.build.js;
        }

        if (config.minifying) {
            dest = config.paths.min.js;
        }

        return gulp.src([
                config.paths.source.js + '**/*',
            ])
            .pipe(gulp.dest(dest))
            .pipe(browserSync.reload({stream: true}));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
