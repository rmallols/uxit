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

        /**
         * Determines if the given string is an external url or not
         *
         * @param   {string} url    The string that is going to determine if it's an external url or not
         * @returns {*}             True if the string is an external url. False otherwise
         */
        function isExternalUrl(url) {
            //noinspection JSValidateTypes
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
                regex = new RegExp(expression);
            if(!url) {
                return false;
            }
            return url.match(regex) !== null;
        }

        /**
         * Normalizes the format of a given external url, adding the http:// preffix, if necessary
         *
         * @param   {string} url    The url that is going to be normalized
         * @returns {string}        The normalized url
         */
        function normalizeExternalUrl(url) {
            return (url.indexOf('http://') < 0) ? 'http://' + url : url;
        }

        return {
            replaceToken: replaceToken,
            capitalize: capitalize,
            decapitalize: decapitalize,
            toSnakeCase: toSnakeCase,
            toCamelCase: toCamelCase,
            trim: trim,
            isEmpty: isEmpty,
            isExternalUrl: isExternalUrl,
            normalizeExternalUrl: normalizeExternalUrl
        };
    }]);
})();
