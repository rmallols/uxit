COMPONENTS.directive('userList', ['mediaService', 'userService', function (mediaService, userService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'userList.html',
        scope : {
            config: '='
        },
		link: function link(scope) {
            scope.items = userService.getUsers();
            scope.onSelectPanels    = [{ title: 'Edit users', type: 'editUser'}];
            scope.transcludedData = {};
            scope.transcludedData.getUserAvatarUrl = function(item) {
                return (item.media) ? mediaService.getDownloadUrl(item.media) : mediaService.getDefaultAvatarUrl();
            };
            scope.template =    '<div class="avatar columns large-3">' +
                                    '<img ng-src="{{transcludedData.getUserAvatarUrl(item)}}" />' +
                                '</div>' +
                                '<div class="columns large-22">' +
                                    '<h3><a href="#">{{item.fullName}}</a></h3>' +
                                    '<div list-expanded-view class="email" ng-bind-html-unsafe="item.email"></div>' +
                                    '{{item.create.date}}' +
                                '</div>';
		}
	};
}]);
