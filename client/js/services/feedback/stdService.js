(function () {
    'use strict';
    COMPONENTS.factory('stdService', ['globalMsgService', function (globalMsgService) {

        /**
         * Shows a warn message on the browser console
         *
         * @param {string} text     Main text of to be displayed
         * @param {string} details  Secondary text to be displayed
         */
        function warn(text, details) {
            console.warn("[WARN] " + text, details);
        }

        /**
         * Shows an error message on the browser console and on the global service mechanism
         *
         * @param {string} text     Main text of to be displayed
         * @param {string} details  Secondary text to be displayed
         */
        function error(text, details) {
            console.error("[ERROR] " + text, details);
            globalMsgService.show(text, details);
        }

        /**
         * Shows a todo message on the browser console
         *
         * @param {string} text Main text of to be displayed
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
