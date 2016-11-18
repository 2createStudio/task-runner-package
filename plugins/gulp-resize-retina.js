'use strict';

var through = require('through2');
var path    = require('path');
var gutil   = require('gulp-util');
var Jimp    = require('jimp');

module.exports = function (opts) {
    opts = opts || {};

    return through.obj(function (file, enc, cb) {
        var self = this,
            ext = path.extname(file.path).slice(1),
            cfg = {
                root: path.dirname(file.path),
                fileName: path.basename(file.path)
            };


        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-resize-retina', 'Streams are not supported!'));
            return cb();
        }

        if (file.isNull()) {
            return cb();
        }

        Jimp.read(file.contents, function(err, image) {
            if (err) {
                self.emit('error', new gutil.PluginError('gulp-resize-retina', err, {fileName: file.path}));
                return cb();
            }

            image.scale(.5, function(err, image) {
                if (err) {
                    self.emit('error', new gutil.PluginError('gulp-resize-retina', err, {fileName: file.path}));
                    return cb();
                }

                image.getBuffer( Jimp.MIME_PNG, function(err, data) {
                    if (file.isBuffer()) {
                        file.contents = new Buffer(data);
                        if (cfg.ext && ext !== cfg.ext) {
                            file.path = file.path.slice(0, -(ext.length));
                            file.path += cfg.ext;

                        }
                    }
                    file.path = file.path.replace('@2x.png', '.png');

                    self.push(file);

                    cb();
                })
            });
        });
    });
};
