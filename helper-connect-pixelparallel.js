'use strict';

var fs = require('fs');

module.exports = connect;

function getFromCollectionById(collection, id) {
    for (var i = 0; i < collection.length; i++) {
        if(collection[i].id === id) {
            return collection[i];
        };
    };

    return null;
}

function saveJSONToFile(filename, object) {
    fs.writeFile(filename, JSON.stringify(object, null, 4), function(err) {
        if(err) {
            console.log(err);
        };
    });
}

function connect(err, bs) {
    bs.io.sockets.on('connection', function(socket) {

        var settings = null;

        socket
            .on('pixelParallel:save', function(data) {

                fs.readFile(config.paths.qa.hvd + config.paths.qa.hvd.settings, 'utf8', function (err, response) {
                    if (err) {
                        console.log(err);
                    };

                    settings = JSON.parse(response);

                    var base64string = data.base64string.split(',').pop();

                    var imageObject = {
                        id: data.id,
                        location: data.location,
                        windowSize: data.windowSize
                    };

                    if(getFromCollectionById(settings.savedImages, imageObject.id)) {
                        imageObject = getFromCollectionById(settings.savedImages, imageObject.id);
                    } else {
                        settings.savedImages.push(imageObject);
                    };

                    imageObject.path = data.path;
                    imageObject.properties = data.properties;
                    imageObject.lastChange = data.timestamp;

                    fs.writeFile(imageObject.path + imageObject.id, base64string, 'base64', function(err) {
                        if(err) {
                            console.log(err);
                        };
                    });

                    saveJSONToFile(config.paths.qa.hvd + config.paths.qa.hvd.settings, settings);
                });
            })
            .on('pixelParallel:remove', function(data) {

                fs.readFile(config.paths.qa.hvd + config.paths.qa.hvd.settings, 'utf8', function (err, response) {
                    if (err) {
                        console.log(err);
                    };

                    settings = JSON.parse(response);

                    var imageObject = getFromCollectionById(settings.savedImages, data.id);

                    if(imageObject) {
                        settings.savedImages.splice(settings.savedImages.indexOf(imageObject), 1);

                        fs.unlink(imageObject.path + imageObject.id, function(err) {
                            if(err) {
                                console.log(err);
                            };
                        });

                        saveJSONToFile(config.paths.qa.hvd + config.paths.qa.hvd.settings, settings);
                    };
                });
            });
    });
}
