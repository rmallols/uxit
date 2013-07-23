(function () {
    'use strict';

    COMPONENTS.factory('stringService', [function () {

        /**
         * Replaces a source token with a new one of a given string
         *
         * @param   {string}    string      The string that is going to be modified
         * @param   {string}    sourceToken The original token that is going to be replaced
         * @param   {string}    targetToken The new token that is going to replace the original one
         * @returns {string}                The string with the switched tokens
         */
        function replaceToken(string, sourceToken, targetToken) {
            var re = new RegExp(sourceToken, "g");
            return (string) ? string.replace(re, targetToken) : '';
        }

        /**
         * Capitalizes the given string
         *
         * @param   {string} string The string that is going to be capitalized
         * @returns {string}        The capitalized string
         */
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        /**
         * Decapitalizes the given string
         *
         * @param   {string} string The string that is going to be decapitalized
         * @returns {string}        The decapitalized string
         */
        function decapitalize(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        }

        /**
         * Converts a given string to snake case notation
         *
         * @param   {string} string The string that is going to be converted to snake case notation
         * @returns {string}        The snaked case string
         */
        function toSnakeCase(string) {
            return string.replace(/[A-Z]/g, function (letter, pos) {
                return (pos ? '-' : '') + letter.toLowerCase();
            });
        }

        /**
         * Converts a given string to camel case notation
         *
         * @param   {string} string The string that is going to be converted to camel case notation
         * @returns {string}        The cameled case string
         */
        function toCamelCase(string) {
            return string.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            }).replace(/^moz([A-Z])/, 'Moz$1'); //Mozilla hack
        }

        /**
         * Trims a given string
         * @param   {string} string The string that is going to be trimmed
         * @returns {string}        The trimmed string
         */
        function trim(string) {
            return $.trim(string);
        }

        /**
         * Determines if the given string is empty or not
         *
         * @param   {string}    string  The string that is going to determine if it's empty or not
         * @returns {boolean}           True if the string is empty. False otherwise
         */
        function isEmpty(string) {
            return string === '' || string === null || string === undefined;
        }

        return {
            replaceToken: replaceToken,
            capitalize: capitalize,
            decapitalize: decapitalize,
            toSnakeCase: toSnakeCase,
            toCamelCase: toCamelCase,
            trim: trim,
            isEmpty: isEmpty
        };
    }]);
})();
