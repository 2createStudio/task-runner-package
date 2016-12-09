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
    var watchers = [];

    var task = function (cb) {
        var currentPath = process.cwd();
        var result = [];

        for (var i = 0; i < config.userIncludes.length; i++) {
            if (path.resolve(config.userIncludes[i]) !== currentPath && path.resolve(config.userIncludes[i]).indexOf(currentPath) > -1) {

                if (config.userIncludes[i].slice(-1) === '/') {
                    config.userIncludes[i] += '**/*';
                }

                result.push(config.userIncludes[i]);
            }
        }

        if (config.userIncludesWatcherPaths) {
            if (!('userIncludesWatcherPaths' in config)) {
                config.userIncludesWatcherPaths = [];
            }

            // Configure watch
            for (var i = 0; i < result.length; i++) {
                if (config.userIncludesWatcherPaths.indexOf(result[i]) > -1) {
                    continue;
                }

                config.userIncludesWatcherPaths.push(result[i]);
                config.userIncludesWatcher.add(config.paths.source.dir + result[i]);

            }
        }

        config.userIncludesPaths = result;

        cb();
    };

    function getPaths() {
        
    }

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
