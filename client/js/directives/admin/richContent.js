COMPONENTS.directive('richContent', ['crudService', 'constantsService', 'textSelectionService', 'domService',
function (crudService, constantsService, textSelectionService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/html/admin/richContent.html',
        scope: {
            model       : '=',
            onChange    : '='
        },
		link: function link(scope) {

            scope.propagateChanges = function () {
                if (scope.onChange) { scope.onChange(); }
            };

            scope.changeLink = function () {
                if (scope.selectedPageId) {
                    textSelectionService.setLink({
                        id      : scope.selectedPageId,
                        href    : scope.selectedPageId,
                        title   : '/' + scope.selectedPageId,
                        target  : '_self'
                    });
                }
            };

            function getSelectedLink() {
                var linkObj = textSelectionService.getSelectedLinkDomObj();
                scope.selectedPageId = linkObj.attr('id');
            }

            function setHeadingOptions() {
                scope.headingOptions = [
                    {value: '16px',   text: 'Normal'},
                    {value: '55px',     text: 'Title 1'},
                    {value: '40px',     text: 'Title 2'},
                    {value: '25px',     text: 'Title 3'}
                ];
            }

            function getPagesList() {
                scope.pagesList = [];
                var params = { projection: {text: 1, url: 1}};
                crudService.get(constantsService.collections.pages, null, params, function (pagesList) {
                    //IMPORTANT!!! Avoid the temptation of doing scope.pagesList = pagesList.results
                    //As the pointer to the options would be broken
                    $.each(pagesList.results, function (index, page) {
                        scope.pagesList.push(page);
                    });
                });
            }

            getSelectedLink();
            setHeadingOptions();
            getPagesList();
        }
	};
}]);

COMPONENTS.directive('toggleStyle', ['$timeout', function ($timeout) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        template: '<button ng-click="toggleState()" ng-class="{active:isActive()}" on-change="onChange"></button>',
        scope: {
            model       : '=ngModel',
            onChange    : '='
        },
        link: function link(scope, element, attrs) {

            scope.toggleState = function () {
                /** @namespace attrs.inactiveWhen */
                /** @namespace attrs.activeWhen */
                scope.model = (!scope.isActive()) ? attrs.activeWhen : attrs.inactiveWhen || '';
                //Due to some strange reason, it's possible that at this moment the model has not been update yet,
                //so the onChange method propagates the old one. We execute the callback in a new thread to avoid this
                $timeout(function () { if (scope.onChange) { scope.onChange(); }}, 0);
            };

            scope.isActive = function () {
                return scope.model === attrs.activeWhen;
            };
        }
    };
}]);