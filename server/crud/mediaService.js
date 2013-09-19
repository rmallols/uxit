'use strict';
var cacheService        = require("../cacheService"),
    utilsService        = require("../utilsService"),
    fileSystemService   = require("../fileSystemService"),
    consoleService      = require('../consoleService'),
    gm                  = require('gm'),
    dbService           = require("../dbService");

module.exports = {

    upload : function (id, files, session, callback) {

        function uploadFile(file, callback) {

            function createNewFile(saveObj, callback) {
                utilsService.addCreateSignature(saveObj, session);
                dbService.getDbConnection().media.save(saveObj, function (err, newContent) {
                    saveObj._id = newContent._id;
                    delete saveObj.data;
                    cacheService.updateCachedMedia(saveObj);
                    callback(saveObj);
                });
            }

            function updateExistingFile(saveObj, callback) {
                utilsService.addUpdateSignature(saveObj, session);
                dbService.getDbConnection().media.update({_id: utilsService.getFormattedId(id)}, {$set: saveObj}, function () {
                    cacheService.updateCachedMedia(saveObj);
                    callback(saveObj);
                });
            }

            fileSystemService.readFile(file.path, function (err, data) {
                gm(data).size(function (err, size) {
                    if (!err) {
                        var saveObj = {
                            data    : data,
                            name   : file.name,
                            size   : file.size,
                            mime   : file.mime,
                            width  : size.width,
                            height : size.height
                        };
                        if (id) { //Overwrite existing media
                            updateExistingFile(saveObj, callback);
                        } else { //Create new media
                            createNewFile(saveObj, callback);
                        }
                    } else {
                        consoleService.error("ERROR, GRAPHICS MAGICK COULD NOT BE ABLE TO GET MEDIA SIZE");
                    }
                });
            });
        }

        if (typeof files.upload[0] === "object") { //Multiple file
            var uploadedFiles = [], i;
            for (i = 0; i < files.upload.length; i += 1) {
                uploadFile(files.upload[i], function (uploadedFile) {
                    uploadedFiles.push(uploadedFile);
                    if (uploadedFiles.length === files.upload.length) {
                        callback(uploadedFiles);
                    }
                });
            }
        } else { //Single file
            uploadFile(files.upload, function (uploadedFile) {
                callback([uploadedFile]);
            });
        }
    }
};