(function () {
    'use strict';

    COMPONENTS.factory('loadingService', [function () {

        NProgress.configure({ trickleRate: 0.1, trickleSpeed: 0 });

        function start() {
            NProgress.start();
        }

        function done() {
            NProgress.done();
        }

        return {
            start: start,
            done: done
        };
    }]);
})();
