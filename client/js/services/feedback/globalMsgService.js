(function () {
    'use strict';
    COMPONENTS.factory('globalMsgService', [function () {

        var onShowObservers = [], onHideObservers = [];

        /**
         * Shows the global message
         *
         * @param {string} text     Main text of to be displayed
         * @param {string} details  Secondary text to be displayed,
         *                          that will be shown just whenever the user will click in the 'show details' link
         */
        function show(text, details) {
            onShowObservers.forEach(function (onShowObserver) {
                onShowObserver(text, details);
            });
        }

        /**
         * Hides the global message
         *
         */
        function hide() {
            onHideObservers.forEach(function (onHideObserver) {
                onHideObserver();
            });
        }

        /**
         * Triggers a given observer event whenever the global message is shown
         *
         * @param {function} observer The function to be executed whenever the global message is shown
         */
        function onShow(observer) {
            onShowObservers.push(observer);
        }

        /**
         * Triggers a given observer event whenever the global message is hidden
         *
         * @param {function} observer The function to be executed whenever the global message is hidden
         */
        function onHide(observer) {
            onHideObservers.push(observer);
        }

        return {
            show: show,
            hide: hide,
            onShow: onShow,
            onHide: onHide
        };
    }]);
})();
