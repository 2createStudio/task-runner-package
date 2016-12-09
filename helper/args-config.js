'use strict';

var utils = require('./utils');

module.exports = helper;


function helper(config) {

    var newConfig = JSON.parse(JSON.stringify(config));

    if (utils.getEnvVar('dev-url') !== null) {
        newConfig.browserSync.url = utils.getEnvVar('dev-url');
    }

    if (utils.getEnvVar('dev-open') !== null) {
        newConfig.browserSync.open = utils.getEnvVar('dev-open');
    }

    if (utils.getEnvVar('gulpfile') !== null) {
        newConfig.settings.gulpfile = utils.getEnvVar('gulpfile');
    }

    if (utils.getEnvVar('css-sourcemap')) {
        newConfig.settings.css.sourcemap = true;
    }

    if (utils.getEnvVar('css-beautify')) {
        newConfig.settings.css.beautify = true;
    }

    if (utils.getEnvVar('css-minify')) {
        newConfig.settings.css.minify = true;
    }

    return newConfig;
}
