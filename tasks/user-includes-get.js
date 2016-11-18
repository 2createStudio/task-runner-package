'use strict';

// Task name and description
var taskName        = 'User Includes: Get';
var taskDescription = 'Gets the user include paths.';

// Task dependencies
var fs = require('fs');
var path = require('path')

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var task = function (cb) {
        var currentPath = process.cwd();
        fs.readFile(config.paths.userIncludes.dir + config.fileNames.userIncludes.requires, 'utf8', function(err, data) {
            if (err) throw err;

            var userPaths = data.match(/^(.*)$/gm);
            var result = [];

            for (var i = 0; i < userPaths.length; i++) {
                if (path.resolve(userPaths[i]) !== currentPath && path.resolve(userPaths[i]).indexOf(currentPath) > -1) {

                    if (userPaths[i].slice(-1) === '/') {
                        userPaths[i] += '**/*';
                    }

                    result.push(userPaths[i]);
                }
            }

            config.settings.userIncludes.paths = result;

            cb();
        });
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
