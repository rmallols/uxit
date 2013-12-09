'use strict';
var deleteService       = require('./crud/deleteService'),
    createService       = require('./crud/createService'),
    updateService       = require('./crud/updateService'),
    getService          = require('./crud/getService'),
    zipService          = require('./zipService'),
    constantsService    = require('./constantsService'),
    fileSystemService   = require('./fileSystemService');

module.exports = {

    deploy: function (dbCon, files, session, callback) {

        function getSetupObj(setupStr) {
            var setupObj;
            setupStr = setupStr.replace(/(\r\n|\n|\r)/gm, "");
            setupStr = setupStr.replace(/'/gm, "\"");
            //noinspection JSUnresolvedVariable
            setupObj = JSON.parse(setupStr);
            return setupObj;
        }

        function setDbData(setupObj) {
            return {
                id                  : setupObj.id,
                title               : setupObj.title,
                desc                : setupObj.desc,
                disabled            : setupObj.disabled,
                provider            : setupObj.provider,
                category            : setupObj.category,
                version             : setupObj.version,
                editPanels          : setupObj.editPanels,
                noCustomEditPanel   : setupObj.noCustomEditPanel,
                defaultModel        : setupObj.defaultModel
            };
        }

        function extractPackage(zipObj, setupObj) {
            zipService.extractAll(zipObj, '../client/apps/' + setupObj.id, true);
        }

        function removeSetupFile(appId, setupFile) {
            //We want to remove the setup.json script from the ZIP file
            //For some unknown reason, the zip.deleteFile() doesn't work, passing the string neither the object entry
            //So, we're extracting the whole ZIP file and afterwards the setup.json script is removed
            fileSystemService.deleteFile('../client/apps/' + appId + '/' + setupFile);
        }

        function createDocument(setupObj, callback) {
            var data, query;
            data = setDbData(setupObj);
            query = { q: [{ text: setupObj.id, targets: ['id'] }] };
            getService.exists(dbCon, constantsService.collections.availableApps, query, function (id) {
                if (id) {
                    updateService.update(dbCon, constantsService.collections.availableApps, id, data, session, callback);
                } else {
                    data.avgRating = '';
                    createService.create(dbCon, constantsService.collections.availableApps, data, session, callback);
                }
            });
        }

        function createCollections(collections) {
            collections.forEach(function (collection) {
                // Create a capped collection with a maximum of 1000 documents
                //noinspection JSUnresolvedFunction
                dbCon.createCollection(collection, {capped: true, size: 10000, max: 1000, w: 1}, function (/*err, collection*/) {
                    createService.create(dbCon, collection, { hello: 'world' + Math.floor(Math.random()*11)}, session, callback);
                });
            });
        }

        function deployApp(file, callback) {
            var zipObj      = zipService.getZipObj(file.path), setupFile = 'setup.json',
                setupStr    = zipService.readFile(zipObj, setupFile),
                setupObj    = getSetupObj(setupStr), appId = setupObj.id;
            extractPackage(zipObj, setupObj);
            removeSetupFile(appId, setupFile);
            createDocument(setupObj, function () {
                if (setupObj.collections) {
                    createCollections(setupObj.collections);
                }
                callback();
            });

        }

        if (typeof files.upload[0] === "object") { //Multiple file
            var uploadedFiles = [], i;
            for (i = 0; i < files.upload.length; i += 1) {
                deployApp(files.upload[i], function (uploadedFile) {
                    uploadedFiles.push(uploadedFile);
                    if (uploadedFiles.length === files.upload.length) {
                        callback(uploadedFiles);
                    }
                });
            }
        } else { //Single file
            deployApp(files.upload, function (uploadedFile) {
                callback([uploadedFile]);
            });
        }
    },

    undeploy: function (dbCon, id, data, session, callback) {
        deleteService.delete(dbCon, constantsService.collections.availableApps, id, function () {
            fileSystemService.deleteFolderRecursive('../client/apps/' + data.id + '/');
            callback();
        });
    }
};