(function() {
    'use strict';
    var fileSystemService = require("./fileSystemService");

    module.exports = {

        _setupPath: __dirname + '/../setup',

        getData: function(collection, callback) {
            fileSystemService.readFile(this._setupPath + '/db/' + collection + '.json', function (err, data) {
                callback(err, data);
            });
        },

        getTemplatesData: function(callback) {
            fileSystemService.readFiles(this._setupPath + '/db/template/data', true, function(err, data) {
                callback(err, data);
            });
        }
    };
})();