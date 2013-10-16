(function () {
    'use strict';
    COMPONENTS.service('portalsAdminAppService', ['dbService', function (dbService) {

        function view(scope) {
            dbService.getDatabases(function (databases) {
                scope.databases = databases;
                console.log("PASAR A ARRAY NORMALIZADO!");
            })


            //getUserList();
            //scope.collection = constantsService.collections.users;
            scope.config = {};
            scope.onSelectPanels = [{ title: 'Edit users', type: 'editUser'}];
            scope.onCreate = onCreate;
            scope.onDelete = onDelete;
            scope.transcludedData = {};
            //scope.transcludedData.getUserAvatarUrl = getUserAvatarUrl;
            scope.template = getTemplate();
            //$rootScope.$on(scope.collection + 'Changed', function () { loadUserList(); });
            scope.config.pageActionPos = 0;
            /** Private methods**/
            /*function getUserList() {
                scope.userList = userService.getUsers();
            }*/

            /*function loadUserList() {
                userService.loadUsers(function(users) {
                    scope.userList = users;
                });
            }*/

            function onCreate(user) {
                /*userService.createUser(user, function() {
                    loadUserList();
                });*/
            }

            function onDelete(userId) {
                //listDbService.deleteItem(scope.collection, userId);
                //loadUserList();
            }

            function getTemplate() {
                return  '<div class="columns large-25">{{item}}' +
                        '</div>'
            }
        }
		
		function edit(scope) {
			console.log("hello portals admin edit");
        }

        return {
            view: view,
			edit: edit
        };
    }]);
})();
