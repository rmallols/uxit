COMPONENTS.directive('userList', ['mediaService', 'constantsService', function (mediaService, constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'userList.html',
        scope : {
            config: '='
        },
		link: function link(scope) {
            scope.items             = [];
            scope.collection        = constantsService.collections.users;
            scope.projection        = { password: 0 }; //Avoid sending the password to the frontend
            scope.searchTargets     = ['fullName', 'email'];
            scope.onSelectPanels    = [{ title: 'Edit users', type: 'editUser'}];
            scope.transcludedData = {};
            scope.transcludedData.getUserAvatarUrl = function(item) {
                return (item.media) ? mediaService.getDownloadUrl(item.media) : mediaService.getDefaultAvatarUrl();
            };
		}
	};
}]);
