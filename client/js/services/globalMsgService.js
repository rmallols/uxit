(function () {
    'use strict';
    COMPONENTS.factory('globalMsgService', [function () {

        var onShowObservers = [], onHideObservers = [];

        /**
         *
         *
         * @param text
         * @param details
         */
        function show(text, details) {
            onShowObservers.forEach(function (onShowObserver) {
                onShowObserver(text, details);
            });
        }

        /**
         *
         *
         */
        function hide() {
            onHideObservers.forEach(function (onHideObserver) {
                onHideObserver();
            });
        }

        /**
         *
         *
         * @param observer
         */
        function onShow(observer) {
            onShowObservers.push(observer);
        }

        /**
         *
         *
         * @param observer
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
