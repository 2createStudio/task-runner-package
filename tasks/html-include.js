'use strict';

// Task name and description
var taskName        = 'HTML: Include';
var taskDescription = 'SSI Includes';

// Task dependencies
var gulpSSI         = require('./../plugins/gulp-deep-ssi');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var task = function () {
        var dest = config.paths.dist.html;


        if (config.building) {
            dest = config.paths.build.html;
        }

        return gulp.src([
                config.paths.source.html + '**/*.+(html|php)'
            ])
            .pipe(gulpSSI({
                baseDir: config.paths.source.html
            }))
            .pipe(gulp.dest(dest));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
