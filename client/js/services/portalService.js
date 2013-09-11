(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('portalService', ['$compile', '$rootScope', 'pageService', 'crudService', 'mediaService',
    'i18nDbService', 'constantsService', 'timerService', 'rowService', 'colService', 'domService', 'arrayService', 'stdService',
    function ($compile, $rootScope, pageService, crudService, mediaService, i18nDbService, constantsService,
              timerService, rowService, colService, domService, arrayService, stdService) {

        var portal, windowDimensions;

        /**
         * Sets the header information of the portal (page title, favicon...)
         *
         */
        function setHeader() {
            setTitle();
            setFavicon();
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
         * Loads the current portal data in the context of a given page
         * 
         * @param {string}      portalId    The identifier of the portal which data is going to be retrieved
         * @param {string}      pageId      The identifier of the page which data is going to be retrieved
         * @param {function}    callback    The callback function to be executed once the process finishes
         */
        function loadPortal(portalId, pageId, callback) {
            var bodyObj;
            if (portalId) {
                bodyObj = $('body');
                domService.addLoadingFeedback(bodyObj);
                crudService.get(constantsService.collections.portal, portalId, null, function (loadedPortal) {
                    var pageModel = pageService.getPage(pageId);
                    domService.removeLoadingFeedback(bodyObj);
                    portal = loadedPortal;
                    updatePageDataFromTemplate(getPortal(), pageModel.rows);
                    pageService.setCurrentPage(pageModel);
                    $rootScope.$broadcast('pageLoaded');
                    if (callback) { callback(getPortal()); }
                });
            }
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
        function savePortal(callback) {
            //The user handling will have to be refactored at UXIT-273
            var portalData;
            portalData = angular.copy(getPortal());
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
         * Caches the window dimensions (width and height)
         */
        function setWindowDimensions() {
            windowDimensions = { width: $(window).width(), height: $(window).height() };
            $(window).resize(function () { //Auto-update the window dimensions object everytime the window is resized
                //The resize event could be triggered multiple times unnecessary, so from a performance perspective,
                //it's necessary to update the dimensions just once each time the window is actually resized
                if ($(this).width() !== windowDimensions.width || $(this).height() !== windowDimensions.height) {
                    windowDimensions = { width: $(this).width(), height: $(this).height() };
                    $rootScope.$broadcast('onWindowResized', windowDimensions);
                }
            });
        }

        /**
         * Retrieves the cached window dimensions (width and height)
         *
         * @returns {object} The windows width and height
         */
        function getWindowDimensions() {
            return windowDimensions;
        }

        /**
         * Registers portal stats through Google Analytics
         */
        function trackAnalytics() {
            if (getPortal().trackingCode) {
                var _gaq = _gaq || [], ga, s;
                _gaq.push(['_setAccount', getPortal().trackingCode]);
                _gaq.push(['_trackPageview']);
                ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            }
        }

        /**
         * Gets the URL of the default favicon image
         *
         */
        function getDefaultFaviconUrl() {
            return '/client/images/favicon.ico';
        }

        /**
         * Determines if the fullscreen mode is using the HTML5 API or not
         *
         * @returns {boolean} True if the fullscreen mode is real. False otherwise
         */
        function isRealFullscreen() {
            return getPortal().fullscreenMode === 'real';
        }

        /**
         * Determines if the fullscreen mode is using all the available space in the browser
         *
         * @returns {boolean} True if the fullscreen mode is maximized. False otherwise
         */
        function isMaximizedFullscreen() {
            return getPortal().fullscreenMode === 'maximized';
        }

        /**
         * Determines if the fullscreen mode is using all the available space in the non-templated area
         *
         * @returns {boolean} True if the fullscreen mode is template. False otherwise
         */
        function isTemplateFullscreen() {
            return getPortal().fullscreenMode === 'template';
        }

        /**
         * Deletes a given app
         *
         * @param {object}  appElm      The pointer to the DOM object where the app that is going to be deleted id
         * @param {string}  appIndex    The index of the app in the context of the column where it is
         */
        function deleteApp(appElm, appIndex) {
            var columnScope = angular.element(appElm.closest('.columns')).scope(),
                apps = columnScope.column.apps,
                rowScope = columnScope.$parent,
                columns = rowScope.row.columns,
                rows = rowService.getWrappingRows(rowScope, getPortal().template.rows);
            arrayService.delete(apps, appIndex);
            if (apps.length === 0) {
                colService.deleteColAndDependencies(columns, columnScope.$index);
                if (columns.length === 1 && !rowService.isTemplateRow(rowScope.row)) {
                    rowService.deleteRowAndDependencies(rows, rowScope.$index);
                }
            }
            pageService.updateCurrentPage(null);
            savePortal(null);
        }

        /* PRIVATE METHODS */
        function setTitle() {
            var currentPage = pageService.getCurrentPage();
            document.title = i18nDbService.getI18nProperty(currentPage.text).text + ' | ' + getPortal().title;
        }

        function setDefaultFavicon() {
            var faviconUrl = getDefaultFaviconUrl();
            $("#favicon").attr('href', faviconUrl);
        }

        function setCustomFavicon() {
            mediaService.getMedia(getPortal().faviconId, null, function (favicon) {
                var faviconUrl = mediaService.getDownloadUrl(favicon) + '?v=' + timerService.getRandomNumber();
                $("#favicon").attr('href', faviconUrl);
            });
        }

        function setFavicon() {
            if (getPortal().faviconId) {
                setCustomFavicon();
            } else {
                setDefaultFavicon();
            }
        }
        /* END PRIVATE METHODS */

        return {
            setHeader: setHeader,
            loadPortal: loadPortal,
            getPortal: getPortal,
            savePortal: savePortal,
            updatePageDataFromTemplate: updatePageDataFromTemplate,
            deleteApp: deleteApp,
            setWindowDimensions: setWindowDimensions,
            getWindowDimensions: getWindowDimensions,
            getDefaultFaviconUrl: getDefaultFaviconUrl,
            isRealFullscreen: isRealFullscreen,
            isMaximizedFullscreen: isMaximizedFullscreen,
            isTemplateFullscreen: isTemplateFullscreen,
            trackAnalytics: trackAnalytics
        };
    }]);
})(window.COMPONENTS);
