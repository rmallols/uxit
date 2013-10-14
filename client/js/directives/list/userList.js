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
            getUserList();
            scope.collection = constantsService.collections.users;
            scope.onSelectPanels = [{ title: 'Edit users', type: 'editUser'}];
            scope.onCreate = onCreate;
            scope.onDelete = onDelete;
            scope.transcludedData = {};
            scope.transcludedData.getUserAvatarUrl = getUserAvatarUrl;
            scope.template = getTemplate();
            $rootScope.$on(scope.collection + 'Changed', function () { loadUserList(); });

            /** Private methods**/
            function getUserList() {
                scope.userList = userService.getUsers();
            }

            function loadUserList() {
                userService.loadUsers(function(users) {
                    scope.userList = users;
                });
            }

            function onCreate(user) {
                userService.createUser(user, function() {
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
                        '</div>'
            }
            /** End of private methods**/
		}
	};
}]);
