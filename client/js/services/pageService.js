(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('pageService', ['$rootScope', 'crudService', 'rowService', 'constantsService',
    function ($rootScope, crudService, rowService, constantsService) {

        var pages, currentPage;

        /**
         * Loads the available pages in the system
         *
         * @param {function} callback The function to execute once the pages have been fully loaded
         */
        function loadPages(callback) {
            var params = {
                sort    : { field: 'position', order : '1' }
            };
            crudService.get(constantsService.collections.pages, null, params, function (returnedPages) {
                pages = returnedPages.results;
                if (callback) { callback(getPages()); }
            });
        }

        /**
         * Gets the previously loaded pages
         *
         * @returns {array} The array of previously loaded pages
         */
        function getPages() {
            return pages;
        }

        /**
         * Gets a page based on its unique Url
         *
         * @param   {string} url    The Url that identifies the page that is going to be retrieved
         * @returns {object}        The page identified by the given Url
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
         * Creates a new page
         *
         * @param {object}      data        The info of the new page
         * @param {function}    callback    The function to execute once the page has been fully created
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
         * Updates an existing page
         *
         * @param {string}      pageId      The Id of the page that is going to be updated
         * @param {object}      data        The new information of the page
         * @param {function}    callback    The function to execute once the page has been fully updated
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
         * Updates the current page
         *
         * @param {function}    callback    The function to execute once the current page has been fully updated
         */
        function updateCurrentPage(callback) {
            var currentPage = getCurrentPage();
            updatePage(currentPage._id, currentPage, function (data) {
                if (callback) { callback(data); }
            });
        }

        /**
         * Deletes a given page
         *
         * @param {string}      pageId      The Id of the page that is going to be deleted
         * @param {function}    callback    The function to execute once the page has been fully deleted
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
         * Gets the current page
         *
         * @returns {object} The information of the current page
         */
        function getCurrentPage() {
            return currentPage;
        }

        /**
         * Updates the current page
         *
         * @param {object} newCurrentPage The page that is going to be set as the new current one
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
         * Determines the main scrolling element of the page
         *
         * @returns {jQuery} The pointer to the DOM object where the scrolling area is
         */
        function getMainScrollingElm() {
            return $('ul.pages');
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
            getMainScrollingElm: getMainScrollingElm
        };
    }]);
})(window.COMPONENTS);
