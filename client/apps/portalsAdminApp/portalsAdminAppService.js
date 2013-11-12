(function () {
    'use strict';
    COMPONENTS.service('portalsAdminAppService', ['dbService', function (dbService) {

        function view(scope) {

            dbService.getDatabases(function (databases) {
                updateModel(databases);
            });

            scope.config = {
                multiSelectable : true,
                creatable       : true,
                editable        : true,
                deletable       : true
            };

            scope.onEditPanels      = [{ title: 'Edit database', type: 'editDb',
                                         src:scope.src, view:'editDb', appBridge: true}];
            scope.onCreatePanels    = [{ title: 'Edit database', type: 'createDb',
                                         src:scope.src, view:'createDb', appBridge: true}];
            scope.onCreate          = onCreate;
            scope.onEdit            = onEdit;
            scope.onDelete          = onDelete;
            scope.template          = getTemplate();
            scope.transcludedData   = {};

            /** Private methods**/
            function updateModel(databases) {
                scope.databases = databases.results;
            }

            function onCreate(database) {
                dbService.createDatabase(database, function(databases) {
                    updateModel(databases);
                });
            }

            function onEdit(database) {
                dbService.updateDatabase(database._id, database);
            }

            function onDelete(databaseId) {
                dbService.deleteDatabase(databaseId, function(databases) {
                    updateModel(databases);
                });
            }

            function getTemplate() {
                return  '<div class="columns large-25">' +
                            '<h5>{{item.name}}</h5>' +
                            'Size on disk; {{item.sizeOnDisk}} - empty: {{item.empty}}' +
                        '</div>'
            }
        }

        function createDb(scope) {}
		
		function editDb(scope) {
            scope.model.typedName = scope.model.name;
        }

        return {
            view: view,
            createDb: createDb,
            editDb: editDb
        };
    }]);
})();
