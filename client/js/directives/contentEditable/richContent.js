(function() {
    COMPONENTS.directive('richContent', ['pageService', 'constantsService', 'textSelectionService', 'stringService',
                                         'i18nService',
    function (pageService, constantsService, textSelectionService, stringService, i18nService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'richContent.html',
            scope: {
                model       : '=',
                config      : '=',
                onChange    : '&',
                onLayer     : '='
            },
            link: function link(scope) {

                scope.linkTypes = [
                    { id: 'internal',  text: i18nService('richContent.link.internal') },
                    { id: 'external', text: i18nService('richContent.link.external') }
                ];

                scope.propagateChanges = function () {
                    if (scope.onLayer && scope.onLayer.change) { scope.onLayer.change(scope.model); }
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
                            title   : '<a href="' + link + '" target="' + target + '">' + link + '</a>',
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
})();