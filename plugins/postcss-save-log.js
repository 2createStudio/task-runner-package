'use strict';

var fs      = require('fs');
var path    = require('path');

var _       = require('lodash');

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-save-log', plugin);

function plugin(opts) {
    opts = opts || {};

    return function (css, result) {

        var formatter = function(input) {
            var messages = input.messages;
            var source = input.source;

            if (!messages.length) return '';

            var orderedMessages = _.sortBy(
                messages,
                function(m) {
                    if (!m.line) return 1;
                    return 2;
                },
                function(m) {
                    return m.line;
                },
                function(m) {
                    return m.column;
                }
            );

            var output = '\n';

            if (source) {
                output += logFrom(source) + '\n';
            }

            orderedMessages.forEach(function(w) {
                output += messageToString(w) + '\n';
            });

            return output;

            function messageToString(message) {
                var str = '';

                if (message.line) {
                    str += message.line;
                }

                if (message.column) {
                    str += ':' + message.column;
                }

                if (message.line || message.column) {
                    str += '\t';
                }

                str += message.text;

                return str;
            }

            function logFrom(fromValue) {
                if (fromValue.charAt(0) === '<') return fromValue;
                return path.relative(process.cwd(), fromValue);
            }
        };

        var messagesToLog = result.messages;

        var resultSource = (!result.root.source) ? ''
          : result.root.source.input.file || result.root.source.input.id

        var sourceGroupedMessages = _.groupBy(messagesToLog, function(message) {
          if (!message.node || !message.node.source) return resultSource;
          return message.node.source.input.file || message.node.source.input.id;
        });

        var report = '';
        _.forOwn(sourceGroupedMessages, function(messages, source) {
          report += formatter({
            messages: messages,
            source: source,
          });
        });

        result.messages = _.difference(result.messages, messagesToLog);

        if (!report) return;

        fs.appendFile(opts.dest, report);
    };
}
