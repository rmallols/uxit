'use strict';
var utilsService        = require("../utilsService"),
    fileSystemService   = require("../fileSystemService"),
    consoleService      = require('../consoleService'),
    constantsService    = require('../constantsService'),
    gm                  = require('gm'),
    dbService           = require("../dbService"),
    collectionService   = require("../collectionService");

module.exports = {

    upload : function (dbCon, id, files, session, callback) {

        function uploadFile(file, callback) {

            function createNewFile(saveObj, callback) {
                var collection = constantsService.collections.media;
                collectionService.create(dbCon, collection, saveObj, session, function (err, newContent) {
                    saveObj._id = newContent._id;
                    delete saveObj.data;
                    callback(saveObj);
                });
            }

            function updateExistingFile(saveObj, callback) {
                var collection = constantsService.collections.media,
                    id = {_id: collectionService.getFormattedId(dbCon, id)},
                    params = {$set: saveObj};
                collectionService.update(dbCon, collection, id, params, session, function() {
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