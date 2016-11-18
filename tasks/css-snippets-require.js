'use strict';

// Task name and description
var taskName        = 'CSS: Snippets require';
var taskDescription = 'Gets snippets from the snippets lib repo.';

// Task dependencies
var cssSnippets     = require('./../plugins/gulp-css-snippets');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var task = function () {
        return gulp.src([
                config.paths.snippet.dir + config.fileNames.snippet.requires
            ], {
                allowEmpty : true
            })
            .pipe(cssSnippets({
                fileName: config.fileNames.snippet.components,
                base: config.cssSnippets.requireUrl
            }))
            .pipe(gulp.dest(config.paths.snippet.outputDir));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
