'use strict';

var fs = require('fs');

module.exports = module;

var PPImage = (function() {

    function PPImage(data) {
        this.id = data.id;

        this.data = data;
    }

    PPImage.prototype.update = function(data) {
        this.data = data;

        this.save();
    };

    PPImage.prototype.extract = function() {
        return this.data;
    };

    PPImage.prototype.save = function(cb) {
        fs.writeFile(config.paths.qa.hvdImages + this.id, base64string, 'base64', function(err) {
            if (err) {
                console.log(err);
            }

            cb && cb();
        });
    };

    PPImage.prototype.remove = function(cb) {
        fs.unlink(config.paths.qa.hvdImages + this.id, function(err) {
            if (err) {
                console.log(err);
            }
        });

        cb && cb();
    };

    return PPImage;

})();

var ImagesCollection = (function() {

    function ImagesCollection(images, config) {
        this.images = images;

        this.settings = config || {};
    }

    ImagesCollection.prototype.get = function(id) {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i].id === id) {
                return this.images[i];
            }
        }

        return null;
    };

    ImagesCollection.prototype.add = function(image) {
        var ppImage = this.get(image.id);

        if (ppImage) {
            ppImage.update(data);
        } else {
            ppImage = new PPImage(image);

            ppImage.save();

            this.images.push(ppImage);
        }

        this.settings.onChange && this.settings.onChange();
    };

    ImagesCollection.prototype.remove = function(id) {
        var image = this.get(id);

        if (!image) {
            return;
        }

        image.remove();

        this.splice(this.images.indexOf(image), 1);

        this.settings.onChange && this.settings.onChange();
    };

    ImagesCollection.prototype.extract = function() {
        var result = [];

        for (var i = 0; i < this.images.length; i++) {
            result.push(this.images[i].extract);
        }

        return result;
    };

    return ImagesCollection;

})();


function saveSettings(cb) {
    fs.writeFile(config.paths.qa.hvd + config.fileNames.qa.hvd.settings, JSON.stringify(settings, null, 4), function(err) {
        if (err) {
            console.log(err);
        }

        cb && cb();
    });
}


function connect(err, bs) {
    var settings = null;

    var imagesCollection = null;

    fs.readFile(config.paths.qa.hvd + config.fileNames.qa.hvd.settings, 'utf8', function (err, response) {
        if (err) {
            console.log(err);

            return;
        }

        settings = JSON.parse(response);

        var images = [];

        for (var i = 0; i < settings.savedImages.length; i++) {
            images = new PPImage(settings.savedImages[i]);
        }

        imagesCollection = new ImagesCollection(images, {
            onChange: function() {
                settings.savedImages = imagesCollection.extract();

                saveSettings();
            }
        });
    });

    bs.io.sockets.on('connection', function(socket) {

        socket
            .on('pixelParallel:save', function(data) {

                // var base64string = data.base64string.split(',').pop();

                imagesCollection.add(data);
            })
            .on('pixelParallel:remove', function(data) {

                imagesCollection.remove(data);
            });
    });
}
