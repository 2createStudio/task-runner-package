'use strict';

// Task name and description
var taskName        = 'Images: Copy';
var taskDescription = 'Copy the image assets into the working directory.';

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.source.images + '**/*.+(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|svg|SVG|ico|ICO)'
            ])
            .pipe(gulp.dest(config.paths.dist.images));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
