'use strict';

// Task name and description
var taskName        = 'Images: Optimise';
var taskDescription = 'Optimises images.';

// Task dependencies
var imagemin        = require('gulp-imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.source.images + '**/*.+(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|svg|SVG)',
                config.paths.build.sprite + '**/*.png',
                '!' + config.paths.source.sprite + '**'
            ])
            .pipe(imagemin([imagemin.gifsicle(), imageminMozjpeg(), imagemin.optipng(), imagemin.svgo()]))
            .pipe(gulp.dest(config.paths.build.images));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
