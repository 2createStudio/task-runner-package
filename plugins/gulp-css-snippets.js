'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var request = require('request');
var File = require('vinyl');


module.exports = function (opts) {
    opts = opts || {};

    var originalFile = null;

    var contents = '';

    function getContent(file, enc, cb) {

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-css-snippets', 'Streams are not supported!'));
            return cb();
        }


        if (file.isNull()) {
            return cb();
        }

        var packagesGot = 0;

        var packageNames = (file.contents.toString().match(/^include\('(.*?)'\)?;\s*$/gm) || []).map(function(item) {
            return item.match(/^include\('(.*?)'\)?;\s*$/)[1];
        });
        
        for (var i = 0; i < packageNames.length; i++) {
            getPackage(packageNames[i], function(body) {
                contents += body;

                packagesGot += 1;

                if (packagesGot === packageNames.length) {
                    cb()
                }
            });
        }

        originalFile = file;

        if (!packageNames.length) {
            cb();
        }   
    }

    function getPackage(packageName, cb) {
        request({
            url: opts.base + packageName + '/main.css'
        }, function(error, response, body) {
            if (response.statusCode !== 200) {
                cb('/* Module "' + packageName + '" not found. */\n\n');
            } else {
                if (!error) {
                    cb(body + '\n');
                } else {
                    cb('');
                }
            }
        });
    }

    function endStream(cb) {

        var joinedFile;

        if (originalFile) {

            joinedFile = originalFile.clone({contents: false});
            joinedFile.path = path.join(originalFile.base, opts.fileName);

            joinedFile.contents = new Buffer(contents);

            this.push(joinedFile);
        }

        cb();
    }

    return through.obj(getContent, endStream);
};
