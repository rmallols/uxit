'use strict';
var fs = require("fs");

module.exports = {

    readFile: function (filePath, callback) {
        fs.readFile(filePath, 'utf-8', function (err, data) {
            if (callback) {
                callback(err, data);
            }
        });
    },

    readFiles: function (folderPath, isJsonFormat, callback) {
        var c = 0, self = this, filesArray = [];
        fs.readdir(folderPath, function (err, files) {
            if (err) { throw err; }
            files.forEach(function(fileName){
                c++;
                self.readFile(folderPath + '/' + fileName, function(err, data) {
                    if (err) { throw err; }
                    filesArray[filesArray.length] = (isJsonFormat) ?  JSON.parse(data) : data;
                    if (0===--c) {
                        if (callback) { callback(err, filesArray); }
                    }
                });
            });
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