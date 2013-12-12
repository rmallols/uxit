(function () {
    'use strict';
    COMPONENTS.service('portalsAdminService', ['dbService', function (dbService) {

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
                    title: 'Create database', src:'portalsAdmin', view:'editDb', appBridge: true,
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
            /** Private methods**/
        }

        function createDb(scope) {}
		
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
