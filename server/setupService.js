(function() {
    'use strict';
    var fileSystemService       = require("./fileSystemService"),
        dbPath                  = __dirname + '/../setup/db/',
        templateDataDbPath      = dbPath + '/template/data/',
        templateStylesDbPath    = dbPath + '/template/styles/';

    module.exports = {

        getCollectionData: function(collection, callback) {
            this._getData(dbPath + collection + '.json', callback);
        },

        getTemplatesDataSummary: function(callback) {
            this._getTemplatesSummary(templateDataDbPath, callback);
        },

        getTemplatesStylesSummary: function(callback) {
            this._getTemplatesSummary(templateStylesDbPath, callback);
        },

        getTemplateData: function(templateId, callback) {
            this._getData(templateDataDbPath + templateId + '.json', callback);
        },

        getTemplateStyles: function(templateId, callback) {
            this._getData(templateStylesDbPath + templateId + '.json', callback);
        },

        _getData: function(filePath, callback) {
            fileSystemService.readFile(filePath, function (err, data) {
                callback(err, JSON.parse(data));
            });
        },

        _getTemplatesSummary: function(dbPath, callback) {
            var result = [], self = this;
            fileSystemService.readFiles(dbPath, function(err, files) {
                //Send just s subset of all the available content
                result = self._summarizeTemplates(files);
                callback(err, result);
            });
        },

        _summarizeTemplates: function(templates) {
            var result = [];
            templates.forEach(function(file) {
                var jsonFile = JSON.parse(file);
                result.push({
                    id  : jsonFile.id,
                    text: jsonFile.text
                });
            });
            return result;
        }
    };
})();