'use strict';

var fs      = require('fs');
var postcss = require('postcss');

module.exports = postcss.plugin('postcss-discard-empty-files', plugin);

function plugin(opts) {
    opts = opts || {};

    return function (css, result) {
        var hasDifferent = false;
        css.walk(function(node) {
            if (node.type !== 'comment') {
                hasDifferent = true;
            }
        });


        if (!hasDifferent) {
            css.removeAll();
            css.raws.after = '';
        }

        return css;
    };
}
