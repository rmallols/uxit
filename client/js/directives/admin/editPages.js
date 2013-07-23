(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('editPages', ['$rootScope', '$routeParams', '$location', 'portalService', 'pageService', 'validationService', '$timeout',
                                       'stringService', 'timerService', 'stdService', 'arrayService', 'constantsService', 'i18nService', 'i18nDbService',
    function ($rootScope, $routeParams, $location, portalService, pageService, validationService, $timeout,
              stringService, timerService, stdService, arrayService, constantsService, i18nService, i18nDbService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: '/client/html/admin/editPages.html',
            scope: {
                onLayerSave : '='
            },
            link: function link(scope) {

                function getCurrentPageIndex() {
                    var i, currentPage = pageService.getCurrentPage();
                    for (i = 0; i < scope.pages.length; i += 1) { if (scope.pages[i]._id === currentPage._id) { break; }}
                    return i;
                }

                function savePages(callback) {
                    var processedPages = 0;

                    //Check if all the pages have been processed, and invokes the callback in that case
                    function registerAndFinish() {
                        processedPages += 1;
                        if (processedPages === scope.pages.length) { callback(); }
                    }

                    function saveCallback(page) {
                        saveItems(page);
                        registerAndFinish();
                    }

                    function createPage(data, page) {
                        delete data.added;
                        pageService.createPage(data, function () { saveCallback(page); });
                    }

                    function deletePage(data, page) {
                        delete data.deleted;
                        pageService.deletePage(page._id, function () { saveCallback(page); });
                    }

                    function updatePage(data, page) {
                        delete data.updated;
                        pageService.updatePage(page._id, data, function () { saveCallback(page); });
                    }

                    function saveItems(parentItem) {
                        var items = (parentItem) ? parentItem.items : scope.items;
                        items.forEach(function (page) {
                            var data = $.extend(true, {}, page);
                            data.parentPageId = (parentItem) ? parentItem._id : null;
                            delete data.areSubItemsHidden; //Delete the areSubPagesHidden flag as it should not persist
                            delete data._id;
                            delete data.items;
                            if (data.added) {
                                createPage(data, page);
                            } else if (data.deleted) {
                                deletePage(data, page);
                            } else if (data.updated) {
                                updatePage(data, page);
                            } else {
                                saveCallback(page);
                            }
                        });
                    }

                    saveItems(null);
                }

                scope.updateSelectedPageUrl = function () {
                    var url;
                    if (scope.selectedPage) {
                        url = stringService.replaceToken(i18nDbService.getI18nProperty(scope.selectedPage.text).text, ' ', '-');
                        scope.selectedPage.url = stringService.toCamelCase(url);
                    }
                    scope.registerSelectedPageChange();
                };

                scope.registerSelectedPageChange = function () {
                    if (scope.selectedPage) { scope.selectedPage.updated = true; }
                };

                scope.onAddPage = function ($page) {
                    $page.type = scope.pageTypes[0].id;
                    //It's necessary to apply a delay as otherwise the selectedPage
                    //will still be pointing to the previously selected item
                    $timeout(function () {
                        scope.updateSelectedPageUrl();
                    }, 0);
                };

                scope.onLayerSave = function (callback) {
                    savePages(function () {
                        var currentPageIndex = getCurrentPageIndex();
                        $location.path($routeParams.portal + '/' + scope.pages[currentPageIndex].url);
                        callback();
                    });
                };

                scope.pageTypes = [
                    { id: constantsService.pageTypes.apps,          text: constantsService.pageTypes.apps },
                    { id: constantsService.pageTypes.externalLink,  text: constantsService.pageTypes.externalLink }
                ];
                scope.targets = [
                    { id: '_blank', text: i18nService('editPages.target.newTab') },
                    { id: '_self', text: i18nService('editPages.target.sameTab') }
                ];
                scope.level2Tabs = [{ title: 'General' }, { title: 'Section 2' }, { title: 'Section 3' }];
            }
        };
    }]);
})(window.COMPONENTS);
