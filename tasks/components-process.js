'use strict';

// Task name and description
var taskName        = 'Components: Process';
var taskDescription = 'Compiles the components.';

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        var dest = config.paths.dist.components;

        if (config.building) {
            dest = config.paths.build.components;
        }

        if (config.minifying) {
            dest = config.paths.min.components;
        }

        return gulp.src([
                config.paths.source.components + '**/*',
            ])
            .pipe(gulp.dest(dest))
            .pipe(browserSync.reload({stream: true}));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
