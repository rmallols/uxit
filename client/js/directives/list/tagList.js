COMPONENTS.directive('tagList', ['constantsService', function (constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tagList.html',
        scope : {
            config: '='
        },
		link: function link(scope) {
            scope.items         = [];
            scope.collection    = constantsService.collections.tags;
            scope.searchTargets = ['text'];
            scope.onEditPanels  = [{ title: 'Edit tag', src: 'editTag'}];
		}
	};
}]);
