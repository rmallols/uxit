COMPONENTS.directive('tagList', ['constantsService', function (constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/list/tagList.html',
        scope : {
            config: '=',
            refreshList: '='
        },
		link: function link(scope) {
            scope.items             = [];
            scope.collection        = constantsService.collections.tags;
            scope.searchTargets     = ['text'];
            scope.onSelectPanels    = [{ title: 'Edit tag', type: 'editTag'}];
		}
	};
}]);
