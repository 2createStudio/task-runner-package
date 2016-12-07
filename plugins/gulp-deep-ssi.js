'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var SSI     = require('node-ssi');

module.exports = function (opts) {
    opts = opts || {};

    var ssiCompiler = new SSI({
        baseDir: opts.baseDir || './',
        encoding: 'utf-8',
        payload: {
            v: 5
        }
    });

    return through.obj(function (file, enc, cb) {
        console.log(file.path);
        var self = this,
            ext = path.extname(file.path).slice(1),
            cfg = {
                root: path.dirname(file.path),
                fileName: path.basename(file.path)
            };


        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-deep-ssi', 'Streams are not supported!'));
            return cb();
        }

        if (file.isNull()) {
            return cb();
        }

        ssiCompiler.compile(file.contents.toString(), function(err, data) {
            if (err) {
                self.emit('error', new gutil.PluginError('gulp-deep-ssi', err, {fileName: file.path}));
                return cb();
            }

            if (data) {
                if (file.isBuffer()) {
                    file.contents = new Buffer(data);
                    if (cfg.ext && ext !== cfg.ext) {
                        file.path = file.path.slice(0, -(ext.length));
                        file.path += cfg.ext;
                    }
                }
                self.push(file);
            }

            cb();

        });
    });
};
