(function () {
    'use strict';
    COMPONENTS.factory('metaService', ['$rootScope', 'pageService', 'mediaService', 'i18nDbService', 'timerService',
    function ($rootScope, pageService, mediaService, i18nDbService, timerService) {

        var windowDimensions;

        /**
         * Sets the header information of the portal (page title, favicon...)
         *
         * @param {string} portalTitle  The title of the portal
         * @param {string} faviconId    The identifier of the favicon of the portal
         */
        function setHeader(portalTitle, faviconId) {
            setTitle(portalTitle);
            setFavicon(faviconId);
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
        function trackAnalytics(trackingCode) {
            if (trackingCode) {
                //noinspection JSUnresolvedVariable
                var _gaq = _gaq || [], ga, s;
                _gaq.push(['_setAccount', trackingCode]);
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

        /* PRIVATE METHODS */
        function setTitle(portalTitle) {
            var currentPage = pageService.getCurrentPage();
            document.title = i18nDbService.getI18nProperty(currentPage.text).text + ' | ' + portalTitle;
        }

        function setDefaultFavicon() {
            var faviconUrl = getDefaultFaviconUrl();
            $("#favicon").attr('href', faviconUrl);
        }

        function setCustomFavicon(faviconId) {
            mediaService.getMedia(faviconId, null, function (favicon) {
                var faviconUrl = mediaService.getDownloadUrl(favicon) + '?v=' + timerService.getRandomNumber();
                $("#favicon").attr('href', faviconUrl);
            });
        }

        function setFavicon(faviconId) {
            if (faviconId) {
                setCustomFavicon(faviconId);
            } else {
                setDefaultFavicon();
            }
        }
        /* END OF PRIVATE METHODS */

        return {
            setHeader : setHeader,
            setWindowDimensions: setWindowDimensions,
            getWindowDimensions: getWindowDimensions,
            getDefaultFaviconUrl: getDefaultFaviconUrl,
            trackAnalytics: trackAnalytics
        };
    }]);
})();
