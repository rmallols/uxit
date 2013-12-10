'use strict';
var admZip = require('adm-zip');

module.exports = {

    getZipObj: function (zipPath) {
        return new admZip(zipPath);
    },

    readFile: function (zipObj, filePath) {
        return zipObj.readFile(filePath).toString('utf8');
    },

    readFiles: function (zipObj) {
        return zipObj.getEntries();
    },

    addFile: function (zipObj, name, content) {
        zipObj.addFile(name, content);
    },

    extractAll: function (zipObj, destPath, overwrite) {
        zipObj.extractAllTo(destPath, overwrite);
    },

    getBuffer: function (zipObj) {
        return zipObj.toBuffer();
    }
};