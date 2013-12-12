COMPONENTS.directive('contentList', ['constantsService', function (constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'contentList.html',
        scope : {
            _id     : '=id',
            config  : '='
        },
		link: function link(scope) {
            scope.items         = [];
            scope.collection    = constantsService.collections.content;
            scope.searchTargets = ['title', 'summary', 'content'];
            scope.onEditPanels  = [{ title: 'Edit content', src: 'editContent'}];
            scope.template      =   '<h3><a href="#"><label i18n-db="item.title"></label></a></h3>' +
                                    '<div class="summary" i18n-db="item.summary"></div>' +
                                    '<div list-expanded-view>' +
                                        '<div class="content" i18n-db="item.content"></div>' +
                                    '</div>' +
                                    '{{item.update.date}}';
		}
	};
}]);
