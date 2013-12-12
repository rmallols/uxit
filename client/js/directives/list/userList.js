COMPONENTS.directive('userList', ['$rootScope', 'mediaService', 'userService', 'constantsService', 'listDbService',
function ($rootScope, mediaService, userService, constantsService, listDbService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'userList.html',
        scope : {
            config: '='
        },
		link: function link(scope) {
            var newUserBindings = { user: {} };
            getUserList();
            scope.collection = constantsService.collections.users;
            scope.onCreatePanels = [{ title: 'Create user', src: 'createUser', bindings: newUserBindings}];
            scope.onEditPanels = [{ title: 'Edit users', src: 'editUser'}];
            scope.onCreate = function() { onCreate(newUserBindings); };
            scope.onDelete = onDelete;
            scope.transcludedData = {};
            scope.transcludedData.getUserAvatarUrl = getUserAvatarUrl;
            scope.template = getTemplate();
            $rootScope.$on(scope.collection + 'Changed', function () { loadUserList(); });
            scope.config.pageActionPos = 0;

            /** Private methods**/
            function getUserList() {
                scope.userList = userService.getUsers();
            }

            function loadUserList() {
                userService.loadUsers(function(users) {
                    scope.userList = users;
                });
            }

            function onCreate(bindings) {
                userService.createUser(bindings.user, function() {
                    bindings.user = {};
                    loadUserList();
                });
            }

            function onDelete(userId) {
                listDbService.deleteItem(scope.collection, userId);
                loadUserList();
            }

            function getUserAvatarUrl(item) {
                return (item.media) ? mediaService.getDownloadUrl(item.media)
                                    : mediaService.getDefaultAvatarUrl();
            }

            function getTemplate() {
                return  '<div class="avatar columns large-3">' +
                            '<img ng-src="{{transcludedData.getUserAvatarUrl(item)}}" />' +
                        '</div>' +
                        '<div class="columns large-22">' +
                            '<h3><a href="#">{{item.fullName}}</a></h3>' +
                            '<div list-expanded-view class="email" ng-bind-html-unsafe="item.email"></div>' +
                            '{{item.create.date}}' +
                        '</div>';
            }
            /** End of private methods**/
		}
	};
}]);
