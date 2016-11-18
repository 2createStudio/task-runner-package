'use strict';

// Task name and description
var taskName        = 'Images: Copy';
var taskDescription = 'Copy the image assets into the working directory.';

// Task dependencies
var copy            = require('gulp-copy');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.source.images + '**/*.+(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|svg|SVG|ico|ICO)'
            ])
            .pipe(copy(config.paths.dist.images, {
                prefix: 3
            }));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
