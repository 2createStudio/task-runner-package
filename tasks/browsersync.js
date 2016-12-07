'use strict';

// Task name and description
var taskName        = 'BrowserSync';
var taskDescription = 'Livereload, and notifications.';

// Task dependencies
var path            = require('path');
var utils           = require('./../helper/utils');
var connectPixelParallel = require('./../helper/connect-pixelparallel.js');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var task = function (cb) {

        var browserSyncConfig = {
            open: config.browserSync.open,
            host: config.browserSync.hostname,
            online: true,
            notify: {
                styles: [
                    'display: none;',
                    'padding: 7px 15px;',
                    'border-radius: 0 0 3px 3px;',
                    'position: fixed;',
                    'font-family: Arial, sans-serif',
                    'font-size: 14px;',
                    'font-weight: normal;',
                    'z-index: 9999;',
                    'right: 0px;',
                    'top: 0px;',
                    'background-color: rgba(30, 30, 30, .7);',
                    'color: #fff',
                    'pointer-events: none;'
                ]
            },
            ghostMode: {
                clicks: false,
                scroll: true,
                forms: {
                    submit: true,
                    inputs: true,
                    toggles: true
                }
            },
            snippetOptions: {
                // Provide a custom Regex for inserting the snippet.
                rule: {
                    match: /<\/body>/i,
                    fn: function (snippet, match) {
                        if (config.pixelParallel.enable) {
                            return snippet + match
                                + '<script src="' + config.pixelParallel.pouchDbSrc + '"></script>'
                                + '<script src="' + config.pixelParallel.scriptSrc + '"></script>';
                        } else {
                            return snippet + match;
                        }
                    }
                }
            }
        };

        if (config.browserSync.url) {
            console.log(config.browserSync.url + (config.urls.dist.dir ? config.urls.dist.dir : ''));
            browserSyncConfig.proxy = config.browserSync.url + (config.urls.dist.dir ? config.urls.dist.dir : '');
        } else {
            browserSyncConfig.server = {
                baseDir: config.paths.dist.dir,
                directory: true
            };
        }

        browserSync.init(browserSyncConfig, config.pixelParallel.enable ? connectPixelParallel && cb : cb);

    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
