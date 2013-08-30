COMPONENTS.directive('richContent', ['crudService', 'constantsService', 'textSelectionService', 'stringService', 'i18nService',
function (crudService, constantsService, textSelectionService, stringService, i18nService) {
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

            scope.linkTypes = [
                { id: 'internal',  text: i18nService('richContent.link.internal') },
                { id: 'external', text: i18nService('richContent.link.external') }
            ];

            scope.propagateChanges = function () {
                if (scope.onChange) { scope.onChange(); }
            };

            scope.setInternalLink = function () {
                setLink(scope.internalLink, '_self');
            };

            scope.setExternalLink = function() {
                setLink(stringService.normalizeExternalUrl(scope.externalLink), '_blank');
            };

            /** Private methods **/
            function getSelectedLink() {
                var linkObj = textSelectionService.getSelectedLinkDomObj(),
                    linkStr = linkObj.attr('id');
                if(stringService.isExternalUrl(linkStr)) {
                    scope.externalLink = linkStr;
                    scope.linkType = scope.linkTypes[1].id;
                } else {
                    scope.internalLink = linkStr;
                    scope.linkType = scope.linkTypes[0].id;
                }
            }

            function setLink(link, target) {
                if (link) {
                    textSelectionService.setLink({
                        id      : link,
                        href    : link,
                        title   : link,
                        target  : target
                    });
                }
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
            /** End of private methods **/

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