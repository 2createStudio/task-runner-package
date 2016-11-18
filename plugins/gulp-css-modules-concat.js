'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Concat = require('concat-with-sourcemaps');
var groupTypeOrder = ['noGroup', 'generic', 'region', 'module', 'theme'];

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
    if (!file) {
        throw new PluginError('gulp-css-modules-concat', 'Missing file option for gulp-css-modules-concat');
    }
    opt = opt || {};

    // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
    if (typeof opt.newLine !== 'string') {
        opt.newLine = gutil.linefeed;
    }

    var isUsingSourceMaps = false;
    var latestFile;
    var latestMod;
    var fileName;
    var concat;

    var files = [];

    if (typeof file === 'string') {
        fileName = file;
    } else if (typeof file.path === 'string') {
        fileName = path.basename(file.path);
    } else {
        throw new PluginError('gulp-css-modules-concat', 'Missing path in file options for gulp-css-modules-concat');
    }

    function bufferContents(file, enc, cb) {
        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        // we don't do streams (yet)
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-css-modules-concat',  'Streaming not supported'));
            cb();
            return;
        }

        // enable sourcemap support for concat
        // if a sourcemap initialized file comes in
        if (file.sourceMap && isUsingSourceMaps === false) {
            isUsingSourceMaps = true;
        }

        // set latest file if not already set,
        // or if the current file was modified more recently.
        if (!latestMod || file.stat && file.stat.mtime > latestMod) {
            latestFile = file;
            latestMod = file.stat && file.stat.mtime;
        }

        // construct concat instance
        if (!concat) {
            concat = new Concat(isUsingSourceMaps, fileName, opt.newLine);
        }

        if (file.contents.length) {
            // add file to concat instance
            files.push({
                relative: file.relative,
                contents: file.contents,
                sourceMap: file.sourceMap
            });
        }

        cb();
    }

    function endStream(cb) {
        files = sortModules(files);

        for (var i = 0; i < files.length; i++) {
            // add file to concat instance
            concat.add(files[i].relative, files[i].contents, files[i].sourceMap);
        }

        // no files passed in, no file goes out
        if (!latestFile || !concat) {
            cb();
            return;
        }

        var joinedFile;

        // if file opt was a file path
        // clone everything from the latest file
        if (typeof file === 'string') {
            joinedFile = latestFile.clone({contents: false});
            joinedFile.path = path.join(latestFile.base, file);
        } else {
            joinedFile = new File(file);
        }

        joinedFile.contents = concat.content;

        if (concat.sourceMapping) {
            joinedFile.sourceMap = JSON.parse(concat.sourceMap);
        }

        this.push(joinedFile);
        cb();
    }

    function sortModules(files) {
        return files.sort(function(a, b) {
            return groupTypeOrder.indexOf(getModuleType(a.relative)) - groupTypeOrder.indexOf(getModuleType(b.relative));
        });
    }

    function getModuleType(moduleName) {
            var type = moduleName.match(/^_(.+?)\./)[1];

            if (groupTypeOrder.indexOf(type) < 0) {
                type = 'noGroup';
            }

            return type;
    }

    return through.obj(bufferContents, endStream);
};