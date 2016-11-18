'use strict';

// Task name and description
var taskName            = 'CSS: Proccess';
var taskDescription     = 'Compiles the CSS.';

// Task dependencies
var utils               = require('./../helper/utils');

var gulpCssModulesConcat = require('./../plugins/gulp-css-modules-concat');
var postcssTOC          = require('./../plugins/postcss-toc');
var postcssDiscardEmptyFiles = require('./../plugins/postcss-discard-empty-files');

var postcssAPI          = require('postcss');
var postcss             = require('gulp-postcss');
var postcssSimpleVars   = require('postcss-simple-vars');
var postcssCalc         = require('postcss-calc');
var postcssColor        = require('postcss-color-function');
var postcssMixins       = require('postcss-mixins');
var postcssExtend       = require('postcss-simple-extend');
var postcssBadSelectors = require('postcss-bad-selectors');
var postcssSprites      = require('postcss-sprites');
var postcssDiscardEmpty = require('postcss-discard-empty');
var postcssNesting      = require('postcss-nesting');
var sourcemaps          = require('gulp-sourcemaps');
var autoprefixer        = require('autoprefixer')
var cssbeautify         = require('gulp-cssbeautify');
var cleanCSS            = require('gulp-clean-css');
var gulpif              = require('gulp-if');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {

    var spriteOpts    = {
        stylesheetPath: config.paths.build.css,
        spritePath    : config.paths.build.sprite,
        retina        : true,
        // basePath     : './../../',
        filterBy      : function(image) {
            if( /sprite\//gi.test(image.url) ) {
                return Promise.resolve();
            }
            return Promise.reject();
        },
        hooks: {
            onUpdateRule: function(rule, token, image) {
                var backgroundSizeX = (image.spriteWidth / image.coords.width) * 100;
                var backgroundSizeY = (image.spriteHeight / image.coords.height) * 100;
                var backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100;
                var backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;

                backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
                backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
                backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
                backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

                var backgroundImage = postcssAPI.decl({
                    prop: 'background-image',
                    value: 'url(' + image.spriteUrl + ')'
                });

                var backgroundSize = postcssAPI.decl({
                    prop: 'background-size',
                    value: backgroundSizeX + '% ' + backgroundSizeY + '%'
                });

                var backgroundPosition = postcssAPI.decl({
                    prop: 'background-position',
                    value: backgroundPositionX + '% ' + backgroundPositionY + '%'
                });

                rule.insertAfter(token, backgroundImage);
                rule.insertAfter(backgroundImage, backgroundPosition);
                rule.insertAfter(backgroundPosition, backgroundSize);
            }
        },

        // Spritesmith options:
        spritesmith: {
            padding: 4
        }
    };

    var nextErrorIsSilent = false;

    function errorHandler(errorObj) {

        if (!nextErrorIsSilent) {
            notify(errorObj);
        }

        nextErrorIsSilent = false;

        this.emit('end');
    }

    function silentErrorHandler(errorObj) {
        nextErrorIsSilent = true;

        notify(errorObj);

        this.emit('end');
    }

    var notify = function(errorObj) {
        // Notify the user
        browserSync.notify('Error: ' + utils.beautifyMessage(errorObj.message));

        // Post the message in the console
        console.log(errorObj.message);
    }

    var task = function () {
        var dest = config.paths.dist.css;
        var destFileName = config.fileNames.dist.css

        if (config.building) {
            dest = config.paths.build.css;
            destFileName = config.fileNames.build.css
        }

        // PostCSS processors
        var postcssProcessors = [];

        // Mixins
        postcssProcessors.push(postcssMixins);

        // Extend
        postcssProcessors.push(postcssExtend);

        // Variables
        postcssProcessors.push(postcssSimpleVars);

        // Reduces calcs, where possible
        postcssProcessors.push(postcssCalc({
            mediaQueries: true
        }));

        // Color functions
        postcssProcessors.push(postcssColor());

        // PostCSS Nesting
        postcssProcessors.push(postcssNesting());

        // Autoprefixer
        postcssProcessors.push(autoprefixer(config.settings.css.autoprefixer));

        if (config.makeSprite) {
            postcssProcessors.push(postcssSprites(spriteOpts));
        }

        // Table of contents
        postcssProcessors.push(postcssTOC);

        return gulp.src([
                config.paths.source.css + '_*.css',
                '!' + config.paths.snippet.dir + config.fileNames.snippet.requires
            ])
            .pipe(postcss( [postcssBadSelectors(utils.getSelectorToken)] ))     // prevents the user from writing selectors in wrong modules
            .on('error', silentErrorHandler)
            .pipe(gulpif(config.settings.css.sourcemap, sourcemaps.init()))     // source map init
            .pipe(postcss([postcssDiscardEmpty, postcssDiscardEmptyFiles]))
            .pipe(gulpCssModulesConcat(destFileName))                           // concat modules in specific order
            .pipe(postcss( postcssProcessors ))                                 // post css
            .on('error', errorHandler)
            .pipe(gulpif(config.settings.css.sourcemap, sourcemaps.write('.'))) // sourcemap write
            .pipe(gulpif(config.settings.css.beautify, cssbeautify()))          // beautify CSS
            .pipe(gulpif(config.settings.css.minify, cleanCSS()))               // minify CSS
            .pipe(gulp.dest( dest ))                                            // save css file
            .pipe(browserSync.reload({stream: true}));                          // inject the changed css
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
