COMPONENTS.directive('contentList', ['constantsService', function (constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/list/contentList.html',
        scope : {
            _id: '=id',
            config: '='
        },
		link: function link(scope) {
            scope.items             = [];
            scope.collection        = constantsService.collections.content;
            scope.searchTargets     = ['title', 'summary', 'content'];
            scope.onSelectPanels    = [{ title: 'Edit content', type: 'editContent'}];
		}
	};
}]);
