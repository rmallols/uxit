'use strict';
var admZip = require('adm-zip');

module.exports = {

    getZipObj: function (zipPath) {
        return new admZip(zipPath);
    },

    readFile: function (zipObj, filePath) {
        return zipObj.readFile(filePath).toString('utf8');
    },

    extractAll: function (zipObj, destPath, overwrite) {
        zipObj.extractAllTo(destPath, overwrite);
    }
};