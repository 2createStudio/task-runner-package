'use strict';

var path    = require('path');
var yargs   = require('yargs');
var envVars = yargs.argv;


module.exports = {
    getEnvVar           : getEnvVar,
    beautifyMessage     : beautifyMessage,
    getSelectorToken    : getSelectorToken,
    getRelativePath     : getRelativePath,
    getPathToFolder     : getPathToFolder,
    escapeRegExp        : escapeRegExp
};


/**
 * Gets env variable or returns false if there is no varible
 * @param  {string} variable Variable name
 * @return {string}          Variable value
 */
function getEnvVar(variable) {
    if (variable in envVars) {
        return envVars[variable];
    }

    return false;
}

/**
 * Prepare message for browser notify.
 * @param  {string} message raw message
 * @return {string}         parsed message - new lines replaced by html elements.
 */
function beautifyMessage(message) {
    return '<p style="text-align: left">' + message.replace(/\n/g, '<br>') + '</p>';
}

/**
 * Get selector token from filename
 * @param  {File} file
 * @return {RegExp}      Tolen RegExp
 */
function getSelectorToken(file) {
    var prefixRegex = /^_module(?!(\.form-elements)|(\.sprite))|^_region/gi;
    var token       = null;

    file = path.basename(file);

    if (prefixRegex.test(file)) {
        token = file.replace(prefixRegex, '');
        token = path.basename(token, '.css');
    }

    if (token) {
        return new RegExp('^(\\[class\\^?\\*?=\\"|\\\')?\\.?' + escapeRegExp(token.replace(/^./, '')) + '|\\$');
    }

    return token;
}

/**
 * Gets relative path to folder
 * @param  {string} path       Full path
 * @param  {string} relativeTo Folder name
 * @return {string}            Path relative to the folder
 */
function getRelativePath(path, relativeTo) {
    if (path.match(new RegExp(relativeTo, 'i'))) {
        return path.split(new RegExp(relativeTo, 'i')).pop().replace(/\//g, '\\');
    } else {
        return '';
    }
}

/**
 * Gets path before folder
 * @param  {string} path       Full path
 * @param  {string} folderName Folder name
 * @return {string}            Path before the folder + folder name
 */
function getPathToFolder(path, folderName) {
    var match = path.match(new RegExp(folderName, 'i'));
    if (match) {
        return path.split(new RegExp(folderName, 'i')).shift() + match[0];
    } else {
        return '';
    }
}

/**
 * Escape RegExp helper
 * @param  {String} str Source string
 * @return {String}     Escaped string
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
