'use strict';

// Task name and description
var taskName        = 'CSS Lint: Log';
var taskDescription = 'Logs the CSS lint in the console.';

// Task dependencies
var stylelint       = require('stylelint');
var postcssReporter = require('postcss-reporter');

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
                postcssReporter({
                    clearMessages: true
                })
            ]));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
};
