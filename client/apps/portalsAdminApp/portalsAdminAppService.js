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

            scope.onSelectPanels = [{   title: 'Edit database', type: 'editDb',
                                        src:scope.src, view:'editDb', appBridge: true}];
            scope.onCreate = onCreate;
            scope.onEdit    = onEdit;
            scope.onDelete = onDelete;
            scope.transcludedData = {};
            scope.template = getTemplate();
            scope.config.pageActionPos = 0;

            /** Private methods**/
            function updateModel(databases) {
                scope.databases = databases.results;
            }

            function onCreate(user) {
                /*userService.createUser(user, function() {
                    loadUserList();
                });*/
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
		
		function editDb(scope) {
			console.log("hello portals admin editDb");
        }

        return {
            view: view,
            editDb: editDb
        };
    }]);
})();
