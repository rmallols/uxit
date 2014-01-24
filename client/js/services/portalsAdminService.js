(function () {
    'use strict';
    COMPONENTS.service('portalsAdminService', ['dbService', 'crudService', 'i18nDbService',
    function (dbService, crudService, i18nDbService) {

        var forEach = angular.forEach;

        function view(scope) {

            var newDb = {};

            dbService.loadDatabases(function (databases) {
                updateModel(databases);
            });

            scope.config = {
                multiSelectable : true,
                creatable       : true,
                editable        : true,
                deletable       : true
            };

            scope.onCreatePanels    = getCreatePanels();
            scope.onEditPanels      = getEditPanels();
            scope.onCreate          = function() { onCreateDb(newDb); };
            scope.onEdit            = function() { onEditDb(scope.onEditPanels[0].bindings.model); };
            scope.onDelete          = function(dbId) { onDeleteDb(dbId); };
            scope.template          = getTemplate();
            scope.transcludedData   = {};

            /** Private methods**/
            function getCreatePanels() {
                return [{
                    title: 'Create database', src:'portalsAdmin', appBridge: true,
                    view:'editDb', ctrl: 'createDb',
                    bindings: {
                        model: newDb
                    }
                }];
            }

            function getEditPanels() {
                return [{
                    title: 'Edit database', src:'portalsAdmin', view:'editDb', appBridge: true,
                    bindings : {
                        model: scope.model
                    }
                }];
            }

            function updateModel(databases) {
                scope.databases = databases.results;
            }

            function onCreateDb(database) {
                console.log("CreATING!", database);
                dbService.createDatabase(database, function(databases) {
                    updateModel(databases);
                });
            }

            function onEditDb(database) {
                dbService.updateDatabase(database._id, database);
            }

            function onDeleteDb(databaseId) {
                dbService.deleteDatabase(databaseId, function(databases) {
                    updateModel(databases);
                });
            }

            function getTemplate() {
                return  '<div class="columns large-25">' +
                    '<h5>{{item.name}}</h5>' +
                    'Size on disk; {{item.sizeOnDisk}} - empty: {{item.empty}}' +
                    '</div>';
            }
            /** End of private methods**/
        }

        function createDb(scope) {

            getTemplatesData(function(templatesData)    {
                scope.dataTemplates         = templatesData;
                scope.model.dataTemplateId  = scope.dataTemplates[0].id;
            });
            getTemplatesStyles(function(templatesStyles){
                scope.stylesTemplates           = templatesStyles;
                scope.model.stylesTemplateId    = scope.stylesTemplates[0].id;
            });

            /** Private methods**/
            function getTemplatesData(callback) {
                getTemplates('setup/db/templates/data', callback);
            }

            function getTemplatesStyles(callback) {
                getTemplates('setup/db/templates/styles', callback);
            }

            function getTemplates(endpoint, callback) {
                var templates = [{ id: '', text: '' }];
                crudService.get(endpoint, null, null, function (loadedTemplates) {
                    forEach(loadedTemplates, function(template) {
                        templates.push({
                            id  : template.id,
                            text: i18nDbService.getI18nProperty(template.text).text
                        });
                    });
                    callback(templates);
                });
            }
            /** End of private methods**/
        }
		
		function editDb(scope) {
            if(scope.model) {
                scope.model.typedName = scope.model.name;
            }
        }

        return {
            view: view,
            createDb: createDb,
            editDb: editDb
        };
    }]);
})();
