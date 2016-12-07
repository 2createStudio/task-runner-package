'use strict';

// Task name and description
var taskName        = 'HTML: Include';
var taskDescription = 'SSI Includes';

// Task dependencies
var path            = require('path');
var gulpSSI         = require('./../plugins/gulp-deep-ssi');
var gulpif          = require('gulp-if');
var htmlmin         = require('gulp-htmlmin');
var inlinesource    = require('gulp-inline-source');
var strip           = require('gulp-strip-comments');
var postcssAPI      = require('postcss');
var filter          = require('gulp-filter');


// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var minifyHandlers = [function(source, context, next) {
        var rel = path.relative(source.parentContext.rootpath, path.dirname(source.filepath));
        var parsed = null;

        if (source.type === 'css') {
            parsed = postcssAPI.parse(source.fileContent);

            parsed.walkDecls(/^background/, function(decl) {
                decl.value = decl.value.replace(/^url\(/, 'url(' + rel + '/');
            });
            source.fileContent = parsed.toString();
        }

        next();
    }];

    var task = function () {
        var htmlFilter = filter(['**/*.html'], {restore: true});

        var dest = config.paths.dist.html;
        var src = [
            config.paths.source.html + '**/*.+(html|php)'
        ];

        if (config.building) {
            dest = config.paths.build.html;
        }

        if (config.minifying) {
            dest = config.paths.min.html;
            src = [
                config.paths.build.html + '**/*.+(html|php)'
            ];
        }

        return gulp.src(src)
            .pipe(htmlFilter)
            .pipe(gulpSSI({
                baseDir: config.paths.source.html
            }))
            .pipe(htmlFilter.restore)
            .pipe(gulpif(config.minifying, htmlmin({collapseWhitespace: true})))
            .pipe(gulpif(config.minifying, inlinesource({handlers: minifyHandlers})))
            .pipe(gulpif(config.minifying, strip()))
            .pipe(gulp.dest(dest))
            .pipe(browserSync.reload({stream: true}));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
