(function () {
    'use strict';

    COMPONENTS.factory('loadingService', [function () {

        NProgress.configure({ trickleRate: 0.1, trickleSpeed: 0 });

        /**
         * Starts the loading visual reference
         *
         */
        function start() {
            NProgress.start();
        }

        /**
         * Ends the loading visual reference
         *
         */
        function done() {
            NProgress.done();
        }

        return {
            start: start,
            done: done
        };
    }]);
})();
