(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('portalService', ['$compile', '$rootScope', 'pageService', 'crudService', 'mediaService',
                                         'i18nDbService', 'constantsService', 'timerService',
    function ($compile, $rootScope, pageService, crudService, mediaService, i18nDbService, constantsService, timerService) {

        var windowDimensions;

        /**
         *
         *
         */
        function setHeader() {
            setTitle();
            setFavicon();
        }

        /**
         *
         *
         */
        function enableAppSortableFeature() {
            console.log("ENABLING SORTABLE STATUS");
        }

        /**
         *
         *
         */
        function disableAppSortableFeature() {
            console.log("DISABLING SORTABLE STATUS");
        }

        /**
         *
         *
         * @param callback
         */
        function savePortal(callback) {
            //The user handling will have to be refactored at UXIT-273
            var user = $.extend(true, {}, $rootScope.portal.user);
            delete $rootScope.portal.user;
            crudService.update(constantsService.collections.portal, $rootScope.portal._id, $rootScope.portal, function (data) {
                setHeader(); //Reload the headers as they could have changed
                $rootScope.portal.user = user;
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
         * @returns {object} The windows width and height
         */
        function getWindowDimensions() {
            return windowDimensions;
        }

        /**
         * Registers portal stats through Google Analytics
          */
        function trackAnalytics() {
            if ($rootScope.portal.trackingCode) {
                var _gaq = _gaq || [], ga, s;
                _gaq.push(['_setAccount', $rootScope.portal.trackingCode]);
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
            return $rootScope.portal.fullscreenMode === 'real';
        }

        /* PRIVATE METHODS */
        function setTitle() {
            var currentPage = pageService.getCurrentPage();
            document.title = i18nDbService.getI18nProperty(currentPage.text).text + ' | ' + $rootScope.portal.title;
        }

        function setDefaultFavicon() {
            var faviconUrl = getDefaultFaviconUrl();
            $("#favicon").attr('href', faviconUrl);
        }

        function setCustomFavicon() {
            mediaService.getMediaFromId($rootScope.portal.faviconId, function (favicon) {
                var faviconUrl = mediaService.getDownloadUrl(favicon) + '?v=' + timerService.getRandomNumber();
                $("#favicon").attr('href', faviconUrl);
            });
        }

        function setFavicon() {
            if ($rootScope.portal.faviconId) {
                setCustomFavicon();
            } else {
                setDefaultFavicon();
            }
        }
        /* END PRIVATE METHODS */

        return {
            setHeader: setHeader,
            enableAppSortableFeature: enableAppSortableFeature,
            disableAppSortableFeature: disableAppSortableFeature,
            savePortal: savePortal,
            setWindowDimensions: setWindowDimensions,
            getWindowDimensions: getWindowDimensions,
            getDefaultFaviconUrl: getDefaultFaviconUrl,
            isRealFullscreen: isRealFullscreen,
            trackAnalytics: trackAnalytics
        };
    }]);
})(window.COMPONENTS);
