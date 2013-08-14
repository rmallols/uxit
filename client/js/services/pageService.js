(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('pageService', ['$rootScope', 'crudService', 'rowService', 'constantsService',
    function ($rootScope, crudService, rowService, constantsService) {

        var pages, currentPage;

        /**
         *
         *
         * @param callback
         */
        function loadPages(callback) {
            var params = {
                sort        : { field: 'position', order : '1' }
            };
            crudService.get(constantsService.collections.pages, null, params, function (returnedPages) {
                pages = returnedPages.results;
                if (callback) { callback(getPages()); }
            });
        }

        /**
         *
         *
         */
        function getPages() {
            return pages;
        }

        /**
         *
         *
         */
        function getPage(url) {
            var matchedPage = null;
            pages.forEach(function (page) {
                if ((page.url.toLowerCase() === url.toLowerCase()) && !matchedPage) {
                    matchedPage = page;
                }
            });
            return matchedPage;
        }

        /**
         *
         *
         */
        function createPage(data, callback) {
            crudService.create(constantsService.collections.pages, data, function () {
                loadPages(function () {
                    $rootScope.$broadcast(constantsService.collections.pages + 'Changed', 'create');
                    if (callback) { callback(); }
                });
            }, true); //Stop propagating the page change event as it's necessary to manually trigger it afterwards
        }

        /**
         *
         *
         */
        function updatePage(pageId, data, callback) {
            crudService.update(constantsService.collections.pages, pageId, data, function (data) {
                loadPages(function () {
                    $rootScope.$broadcast(constantsService.collections.pages + 'Changed', pageId);
                    if (callback) { callback(data); }
                });
            }, true); //Stop propagating the page change event as it's necessary to manually trigger it afterwards
        }

        /**
         *
         *
         */
        function updateCurrentPage(callback) {
            var currentPage = getCurrentPage();
            updatePage(currentPage._id, currentPage, function (data) {
                if (callback) { callback(data); }
            });
        }

        /**
         *
         *
         */
        function deletePage(pageId, callback) {
            crudService.delete(constantsService.collections.pages, pageId, function () {
                loadPages(function () {
                    $rootScope.$broadcast(constantsService.collections.pages + 'Changed', pageId);
                    if (callback) { callback(); }
                });
            }, true); //Stop propagating the page change event as it's necessary to manually trigger it afterwards
        }

        /**
         *
         *
         * @returns {*}
         */
        function getCurrentPage() {
            return currentPage;
        }

        /**
         *
         *
         * @param newCurrentPage
         */
        function setCurrentPage(newCurrentPage) {
            currentPage = newCurrentPage;
        }

        /**
         * Determines if a page is the child of other one
         * @param  {object}     subPage The page that is going to be analyzed if it belongs to a parent page or not
         * @param   {object}    page    The page that is going to be analyzed if it's the parent one or not
         * @returns {boolean}           The result of the analysis: true if both pages are related. False otherwise
         */
        function isSubPageOf(subPage, page) { return subPage.parentPageId === page._id; }

        /**
         *
         *
         */
        function addApp() {
            var newRowPos = 1, rows = getCurrentPage().rows;
            rowService.addRowAndDependencies(rows, newRowPos);
            updateCurrentPage(null);
        }

        return {
            loadPages: loadPages,
            getPages: getPages,
            getPage: getPage,
            createPage: createPage,
            updatePage: updatePage,
            updateCurrentPage: updateCurrentPage,
            deletePage: deletePage,
            getCurrentPage: getCurrentPage,
            setCurrentPage: setCurrentPage,
            isSubPageOf: isSubPageOf,
            addApp: addApp
        };
    }]);
})(window.COMPONENTS);
