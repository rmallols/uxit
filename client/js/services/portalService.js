(function () {
    'use strict';
    COMPONENTS.factory('portalService', ['$rootScope', 'pageService', 'crudService', 'constantsService', 'domService', 'metaService',
    function ($rootScope, pageService, crudService, constantsService, domService, metaService) {

        var portal = {};

        /**
         * Loads the current portal data in the context of a given page
         *
         * @param {string}      pageId      The identifier of the page which data is going to be retrieved
         * @param {function}    callback    The callback function to be executed once the process finishes
         */
        function loadPortal(pageId, callback) {
            var bodyObj;
            bodyObj = $('body');
            domService.addLoadingFeedback(bodyObj);
            crudService.get(constantsService.collections.portal, null, null, function (loadedPortal) {
                var pageModel = pageService.getPage(pageId);
                domService.removeLoadingFeedback(bodyObj);
                portal = loadedPortal.results[0];
                updatePageDataFromTemplate(portal, pageModel.rows);
                pageService.setCurrentPage(pageModel);
                $rootScope.$broadcast('portalLoaded');
                if (callback) { callback(portal); }
            });
        }

        /**
         * Gets the current portal data
         *
         * @returns {object} The current portal data
         */
        function getPortal() {
            return portal;
        }

        /**
         * Saves the current portal model
         *
         * @param {function} callback The function to execute once the portal has been fully saved
         */
        function updatePortal(callback) {
            //The user handling will have to be refactored at UXIT-273
            var portalData;
            portalData = angular.copy(portal);
            delete portalData.user;
            updatePageDataFromTemplate(portalData, []);
            crudService.update(constantsService.collections.portal, portalData._id, portalData, function (data) {
                $rootScope.$broadcast('onPortalSaved');
                setHeader(); //Reload the headers as they could have changed
                if (callback) {
                    callback(data);
                }
            });
        }

        /**
         * Updates the current pages data defined in the context of the template structure.
         * The goal is to isolate the template structure knowledge from other resources
         *
         * @param {object} portal   The object that contains the portal data
         * @param {object} pageData The new pages data that is considered to be outside of the template structure (that's the page instance data)
         */
        function updatePageDataFromTemplate(portal, pageData) {
            portal.template.rows[1].columns[0].rows = pageData;
        }

        /**
         * Determines if the fullscreen mode is using the HTML5 API or not
         *
         * @returns {boolean} True if the fullscreen mode is real. False otherwise
         */
        function isRealFullscreen() {
            return portal.fullscreenMode === 'real';
        }

        /**
         * Determines if the fullscreen mode is using all the available space in the browser
         *
         * @returns {boolean} True if the fullscreen mode is maximized. False otherwise
         */
        function isMaximizedFullscreen() {
            return portal.fullscreenMode === 'maximized';
        }

        /**
         * Determines if the fullscreen mode is using all the available space in the non-templated area
         *
         * @returns {boolean} True if the fullscreen mode is template. False otherwise
         */
        function isTemplateFullscreen() {
            return portal.fullscreenMode === 'template';
        }

        /**
         * Sets the header information of the portal (page title, favicon...)
         *
         */
        function setHeader() {
            metaService.setHeader(portal.title, portal.faviconId);
        }

        /**
         * Registers portal stats through Google Analytics
         *
         */
        function trackAnalytics() {
            //noinspection JSUnresolvedVariable
            metaService.trackAnalytics(portal.trackingCode);
        }

        return {
            loadPortal: loadPortal,
            getPortal: getPortal,
            updatePortal: updatePortal,
            updatePageDataFromTemplate: updatePageDataFromTemplate,
            isRealFullscreen: isRealFullscreen,
            isMaximizedFullscreen: isMaximizedFullscreen,
            isTemplateFullscreen: isTemplateFullscreen,
            setHeader: setHeader,
            trackAnalytics: trackAnalytics,
        };
    }]);
})();
