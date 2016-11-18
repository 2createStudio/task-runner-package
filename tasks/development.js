'use strict';

// Task name and description
var taskName        = 'Development';
var taskDescription = 'Watches and restarts the gulp process on change.';

// Task dependencies
var spawn           = require('child_process').spawn;

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp) {
    var task = function (cb) {
        var process;
        var args = ['default'];

        function restart(cb) {
            if (process) {
                process.kill();
            }

            process = spawn('gulp', args, { stdio: 'inherit' });

            cb();
        }

        gulp.watch(['gulp/**/*.js', 'gulpfile.js'], restart);
        // restart();

        args.push('--no-open');

        cb();
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
