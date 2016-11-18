'use strict';

// Task name and description
var taskName        = 'CSS Lint: Save';
var taskDescription = 'Saves the CSS lint into logfile.';

// Task dependencies
var postcssSaveLog  = require('./../plugins/postcss-save-log');

var postcss         = require('gulp-postcss');
var stylelint       = require('stylelint');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function () {
        return gulp.src([
                config.paths.source.css + '*.css',
                '!' + config.paths.snippet.dir + config.fileNames.snippet.requires
            ])
            .pipe(postcss([
                stylelint,
                postcssSaveLog({
                    dest: config.paths.qa.logs + config.fileNames.qa.logs.css
                })
            ]));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
