'use strict';

// Task name and description
var taskName        = 'CSS: Lazy sprite rules';
var taskDescription = 'Generates CSS rules, based on the scanned images directory.';

// Task dependencies
var path            = require('path');

var imageToRule     = require('gulp-image-to-rule');
var changed         = require('gulp-changed');

// Export the task module
module.exports = taskModule;

// Task module
function taskModule (gulp, browserSync, config) {
    var imageToRuleConfig = {
        selectorWithPseudo: '.{base}-{pseudo}, a:{pseudo} .{base}, button:{pseudo} .{base}, a.{pseudo} .{base}, button.{pseudo} .{base}, .{base}.{pseudo}',
        templates: {
            REGULAR: '<% _.forEach(images, function(image) { %><%= image.selector %> { background: url(<%= image.url %>) no-repeat 0 0; background-size: 100% 100%; width: <%= image.dimensions.width %>px; height: <%= image.dimensions.height %>px; display: inline-block; vertical-align: middle; font-size: 0; }<%= \'\\n\' %><% }); %>',
            RETINA: '@media (-webkit-min-device-pixel-ratio: <%= ratio %>), (min-resolution: <%= dpi %>dpi) {<% _.forEach(images, function(image) { %><%= \'\\n\\t\' + image.selector %> { background: url(<%= image.url %>) no-repeat 0 0; width: <%= image.dimensions.width / image.ratio %>px; height: <%= image.dimensions.height / image.ratio %>px; background-size: 100% 100%; display: inline-block; vertical-align: middle; font-size: 0; }<% }); %>}'
        }
    };

    var task = function () {
        return gulp.src([
                config.paths.source.sprite + '/*.png'
            ])
            .pipe(changed(config.paths.source.sprite + '/*.png'))
            .pipe(imageToRule(path.resolve(config.paths.source.css + config.fileNames.source.spriteCSS), imageToRuleConfig))
            .pipe(gulp.dest('.'));
    };

    task.displayName = taskName;
    task.description = taskDescription;

    return task;
}
