'use strict';
var fs = require("fs");

module.exports = {

    readFile: function (filePath, callback) {
        fs.readFile(filePath, function (err, data) {
            if (callback) {
                callback(err, data);
            }
        });
    },

    deleteFile: function (filePath) {
        fs.unlink(filePath);
    },

    deleteFolderRecursive: function (folderPath) {
        var files = [];
        if (fs.existsSync(folderPath)) {
            files = fs.readdirSync(folderPath);
            files.forEach(function (file) {
                var curPath = folderPath + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(folderPath);
        }
    }
};