COMPONENTS.directive('richContent', ['pageService', 'constantsService', 'textSelectionService', 'stringService', 'i18nService',
function (pageService, constantsService, textSelectionService, stringService, i18nService) {
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

            scope.setHeading = function() {
                setHeading(scope.heading);
            };

            scope.setInternalLink = function () {
                setLink(scope.internalLink, '_self');
            };

            scope.setExternalLink = function() {
                setLink(stringService.normalizeExternalUrl(scope.externalLink), '_blank');
            };

            /** Private methods **/
            function getSelectedHeading() {
                var headingId = textSelectionService.getSelectedHeadingId();
                if(headingId) {
                    scope.heading = headingId;
                }
            }
            function getSelectedLink() {
                var linkId = textSelectionService.getSelectedLinkId();
                if(stringService.isExternalUrl(linkId)) {
                    scope.externalLink = linkId;
                    scope.linkType = scope.linkTypes[1].id;
                } else {
                    scope.internalLink = linkId;
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

            function setHeading(heading) {
                textSelectionService.setHeading(heading);
            }

            function setHeadingOptions() {
                scope.headingOptions = [
                    {value: 'normal',   text: 'Normal'},
                    {value: 'heading1', text: 'Heading 1'},
                    {value: 'heading2', text: 'Heading 2'},
                    {value: 'heading3', text: 'Heading 3'}
                ];
            }

            function getPagesList() {
                scope.pagesList = pageService.getPages();
            }

            /** End of private methods **/
            setHeadingOptions();
            getSelectedHeading();
            getSelectedLink();
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