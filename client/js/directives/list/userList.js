COMPONENTS.directive('userList', ['constantsService', function (constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/list/userList.html',
        scope : {
            config: '=',
            refreshList: '='
        },
		link: function link(scope) {
            scope.items             = [];
            scope.collection        = constantsService.collections.users;
            scope.projection        = { password: 0 }; //Avoid sending the password to the frontend
            scope.searchTargets     = ['fullName', 'email'];
            scope.onSelectPanels    = [{ title: 'Edit users', type: 'editUser'}];
		}
	};
}]);
