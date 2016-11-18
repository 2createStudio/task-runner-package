'use strict';

// Task name and description
var taskName        = 'Images: Sprite resize';
var taskDescription = 'Resizes retina images.';

// Task dependencies
var resizeRetina    = require('../plugins/gulp-resize-retina.js');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.source.sprite + '*@2x.png'
            ])
            .pipe(resizeRetina())
            .pipe(gulp.dest(config.paths.source.sprite))
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
