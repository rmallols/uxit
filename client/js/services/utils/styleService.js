(function () {
    'use strict';

    COMPONENTS.factory('styleService', ['mediaService', 'stringService',
    function (mediaService, stringService) {

        /**
         * Normalizes the styles properties of a given CSS style model
         *
         * @param   {object} sourceMdl  The model that contains the source styles
         * @param   {object} destMdl    The model where the styles will be copied to
         * @returns {object}            The target styles with the styles copied from source to target
         */
        function getNormalizedStyles(sourceMdl, destMdl) {
            var styleKey;
            if (!destMdl) { destMdl = {}; }
            for (styleKey in sourceMdl) {
                if (sourceMdl.hasOwnProperty(styleKey)) {
                    setNormalizedStyles(sourceMdl, styleKey, destMdl);
                }
            }
            return destMdl;
        }

        /**
         * Gets the CSS actual styles of an object starting from a given ancestor element
         *
         * @param   {object} rootObj    The pointer to the DOM object where the root element is
         *                              (the calculations start from there, without considering it)
         * @param   {object} leafObj    The pointer to the DOM object of which the styles are going to be retrieved
         * @returns {object}            The computed styles of the leaf object calculating taking as reference the root object
         */
        function getComputedStyleInRange(rootObj, leafObj) {
            var stylesArray = [], stylesObj = {}, styleObj, stylePropArray, stylePropIndex, styleKeyValueArray,
                stylesArrayIndex, normalizedKey, normalizedValue;
            while (leafObj[0] !== rootObj[0]) {
                styleObj = {};
                if (leafObj.attr('style') !== undefined) {
                    stylePropArray = leafObj.attr('style').split(';');
                    for (stylePropIndex in stylePropArray) {
                        if (stylePropArray.hasOwnProperty(stylePropIndex)) {
                            styleKeyValueArray = stylePropArray[stylePropIndex].split(':');
                            if (styleKeyValueArray[0] !== '' && styleKeyValueArray[0] !== undefined) {
                                normalizedKey   = stringService.trim(stringService.toCamelCase(styleKeyValueArray[0]));
                                normalizedValue = stringService.trim(styleKeyValueArray[1]);
                                styleObj[normalizedKey] = normalizedValue;
                            }
                        }
                    }
                    stylesArray.unshift(styleObj);
                }
                leafObj = leafObj.parent();
            }
            for (stylesArrayIndex in stylesArray) {
                if (stylesArray.hasOwnProperty(stylesArrayIndex)) {
                    stylesObj = $.extend(true, stylesObj, stylesArray[stylesArrayIndex]);
                }
            }
            return stylesObj;
        }

        /**
         * Converts a rgb string ('rgb(r,g,b)') into a rgb obj ({r:'r',g:'g',b:'b'})
         *
         * @param   {string} rgbStr The source rgb string that is going to be converted into a rgb object
         * @returns {object}        The resulting rgb object
         */
        function rgbStrToRgbObj(rgbStr) {
            var beginIdx    = rgbStr.indexOf('(') + 1,
                endIdx      = rgbStr.indexOf(')') - rgbStr.indexOf('(') - 1,
                rgbArray = rgbStr.substr(beginIdx, endIdx).split(',');
            if (rgbArray.length === 3) {
                return {
                    r : Number(stringService.trim(rgbArray[0])),
                    g : Number(stringService.trim(rgbArray[1])),
                    b : Number(stringService.trim(rgbArray[2]))
                };
            }
            return null;
        }

        /**
         * Converts a rgb object into a hexadecimal string
         *
         * @param   {object} rgbObj The source rgb object
         * @returns {string}        The hexadecimal string
         */
        function rgbObjToHexStr(rgbObj) {

            function componentToHex(c) {
                //noinspection JSCheckFunctionSignatures
                var hex = c.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }

            return ("#" + componentToHex(rgbObj.r) + componentToHex(rgbObj.g) + componentToHex(rgbObj.b)).toUpperCase();
        }

        /** Private methods **/
        function setNormalizedStyles(sourceMdl, styleKey, destMdl) {
            var styleToken = sourceMdl[styleKey];
            if(styleKey === 'background') {
                setNormalizedBackgroundStyles(styleToken, destMdl);
            } else if(styleKey === 'borders') {
                setNormalizedBorderStyles(styleToken, destMdl);
            } else if(styleKey !== 'cssVars') {
                setNormalizedDefaultStyles(styleToken, styleKey, destMdl);
            }
        }

        function setNormalizedDefaultStyles(styleValue, styleKey, destMdl) {
            if (styleValue || isNumber(styleValue)) { //Consider '0' as a valid style
                destMdl[styleKey] = styleValue;
            }
        }

        function setNormalizedBackgroundStyles(background, destMdl) {
            var mediaUrl = mediaService.getDownloadUrl(background.src);
            if(background.color)    { destMdl.backgroundColor = background.color; }
            if(background.src)      {
                destMdl.backgroundImage = 'url("' + mediaUrl + '")';
                //noinspection JSUnresolvedVariable
                if(background.mosaic)   { destMdl.backgroundRepeat = ''; }
                else                    { destMdl.backgroundRepeat = 'no-repeat'; }
                if(background.position) {
                    destMdl.backgroundPosition = background.position.top + ' ' + background.position.left;
                }
            }
        }

        function setNormalizedBorderStyles(borders, destMdl) {
            if(borders.color)           { destMdl.borderColor = borders.color; }
            if(borders.style)           { destMdl.borderStyle = borders.style; }
            if(isNumber(borders.width)) { destMdl.borderWidth = borders.width; }
        }

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        /** End of private methods **/

        return {
            getNormalizedStyles: getNormalizedStyles,
            getComputedStyleInRange: getComputedStyleInRange,
            rgbStrToRgbObj: rgbStrToRgbObj,
            rgbObjToHexStr: rgbObjToHexStr
        };
    }]);
})();
