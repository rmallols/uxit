(function () {
    'use strict';
    COMPONENTS.factory('portalService', ['$rootScope', '$routeParams', 'pageService', 'crudService',
    'constantsService', 'domService', 'metaService', 'userService', 'roleService', 'tagService',
    'i18nService', 'availableAppsService', 'sessionService', 'stringService', 'timerService',
    function ($rootScope, $routeParams, pageService, crudService, constantsService, domService,
    metaService, userService, roleService, tagService, i18nService, availableAppsService, sessionService,
    stringService, timerService) {

        var portal = {};

        function initializeResources() {
            userService.loadUsers(null);    //Cache users
            pageService.loadPages(null);    //Cache pages
            roleService.loadRoles(function() {
                tagService.loadTags(null);      //Cache tags
                i18nService.loadLanguages(null);//Cache languages
                availableAppsService.loadAvailableApps(null); //Cache available apps
                sessionService.loadUserSession(function (userSession) {
                    if (userSession && userSession.language) {
                        i18nService.changeLanguage(userSession.language);
                    }
                    loadPortal($routeParams.page, function() {
                        setHeader();
                        metaService.setWindowDimensions();
                        trackAnalytics();
                    });
                });
            });
        }

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
         * @param {boolean}     refreshStyles   Determine if the stylesheets have to be reloaded or not
         * @param {function}    callback        The function to execute once the portal has been fully saved
         */
        function updatePortal(refreshStyles, callback) {
            var portalData;
            portalData = angular.copy(portal);
            delete portalData.user;
            updatePageDataFromTemplate(portalData, []);
            crudService.update(constantsService.collections.portal, portalData._id, portalData, function (data) {
                onUpdatedPortal(refreshStyles);
                if (callback) { callback(data); }
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

        /** Private methods */
        function onUpdatedPortal(refreshStyles) {
            $rootScope.$broadcast('onPortalSaved');
            if(refreshStyles) { //Update the portal stylesheets (font color, background...)
                refreshStyleSheets();
            }
            setHeader(); //Reload the headers as they could have changed
        }

        function refreshStyleSheets() {
            var qKey = 'forceRefresh', qVal = timerService.getRandomNumber(), links = $('link');
            links.each(function() {
                var href    = $(this).attr('href'), newElm = $(this).clone(),
                    newHref = stringService.updateQueryStringParameter(href, qKey, qVal);
                newElm.attr('href', newHref);
                $(this).after(newElm); //Clone the previous link to avoid flickering effect
            });
            //After some 'sanity' time, remove the old set of links assuming the new ones are loaded
            setTimeout(function() { links.remove(); }, 3000);
        }
        /** End of private methods */

        return {
            initializeResources: initializeResources,
            loadPortal: loadPortal,
            getPortal: getPortal,
            updatePortal: updatePortal,
            updatePageDataFromTemplate: updatePageDataFromTemplate,
            isRealFullscreen: isRealFullscreen,
            isMaximizedFullscreen: isMaximizedFullscreen,
            isTemplateFullscreen: isTemplateFullscreen,
            setHeader: setHeader,
            trackAnalytics: trackAnalytics
        };
    }]);
})();
