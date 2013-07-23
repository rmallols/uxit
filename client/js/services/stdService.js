(function () {
    'use strict';
    COMPONENTS.factory('stdService', ['globalMsgService', function (globalMsgService) {

        /**
         *
         *
         * @param text
         * @param details
         */
        function warn(text, details) {
            console.warn("[WARN] " + text, details);
        }

        /**
         *
         *
         * @param text
         * @param details
         */
        function error(text, details) {
            console.error("[ERROR] " + text, details);
            globalMsgService.show(text, details);
        }

        /**
         *
         *
         * @param text
         */
        function todo(text) {
            console.log("[TODO] " + text);
        }

        return {
            warn: warn,
            error: error,
            todo: todo
        };
    }]);
})();
