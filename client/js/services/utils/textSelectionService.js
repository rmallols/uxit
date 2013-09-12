(function () {
    'use strict';

    COMPONENTS.factory('textSelectionService', [function () {

        //noinspection JSUnresolvedVariable
        var savedSel = false, rangyPlgn = rangy,  keys = { link: 'link', heading: 'heading' };

        /**
         * Saves the current selection
         *
         */
        function saveSelection() {
            savedSel = rangyPlgn.saveSelection();
        }

        /**
         *  Simulates the selection through CSS styles.
         *
         */
        function setFakeSelection() {
            var selectedTextDomObj = getSelectedTextDomObj();
            selectedTextDomObj.attr('fakeSelection', 'true');
        }

        /**
         * Gets a pointer to the DOM object that wraps the current selection
         *
         * @returns {object} The pointer to the DOM object with the selection
         */
        function getSelectedTextDomObj() {
            rangyPlgn.init();
            var randomCssClass = "rangyTemp_" + (+new Date()),
                classApplier = rangyPlgn.createCssClassApplier(randomCssClass, true);
            classApplier.applyToSelection();
            return $("." + randomCssClass).removeClass(randomCssClass);
        }

        /**
         * Determines if there's or not an active selection
         *
         * @returns {boolean} True if there's any active selection in the page. False otherwise
         */
        function isSelection() {
            var sel = rangyPlgn.getSelection();
            //noinspection JSHint
            return sel._ranges.length > 0 && sel._ranges[0].startOffset != sel._ranges[0].endOffset;
        }

        /**
         * Determines if there's or not an active fake selection
         *
         * @returns {boolean} True if there's any active fake selection in the page. False otherwise
         */
        function isFakeSelection() {
            return $('[fakeSelection]').size() > 0;
        }

        /**
         * Adds styles to the current selection
         *
         * @param {object} styles The object that contains the CSS styles that are going to be applied to the selection
         */
        function setStylesToSelection(styles) {
            var selectedTextDomObj = getSelectedTextDomObj();
            selectedTextDomObj.css(styles);
        }

        /**
         * Restores a previously saved selection
         *
         */
        function restoreSelection() {
            if(savedSel) {
                rangyPlgn.restoreSelection(savedSel);
            }
            //Every time the selection is restored, we'll save it again so it will be possible to restore it afterwards
            saveSelection();
        }

        /**
         * Sets link to the current selection (add / update actions)
         *
         * @param {object} linkOptions The object that contains all the link attributes (id, target, url...)
         */
        function setLink(linkOptions) {
            setDomObj('a', keys.link, linkOptions);
        }

        /**
         * Sets heading style to the current selection (add / update actions)
         *
         * @param {string} headingType The string that represents the type (size) of the heading
         */
        function setHeading(headingType) {
            setDomObj('div', keys.heading, { id: headingType });
        }

        /**
         * Gets the reference to the pointer to the DOM object of the closest heading of the current selection
         *
         * @returns {string} The Id of the selected heading
         */
        function getSelectedHeadingId() {
            return getSelectedId(keys.heading);
        }

        /**
         * Gets the pointer to the DOM object of the closest link of the current selection
         *
         * @returns {object} The pointer to the DOM object of the closest link of the current selection
         */
        function getSelectedLink() {
            return getSelectedTextDomObj().closest('.' + keys.link);
        }

        /**
         * Gets the reference to the pointer to the DOM object of the closest link of the current selection
         *
         * @returns {string} The Id of the selected link
         */
        function getSelectedLinkId() {
            return getSelectedId(keys.link);
        }

        /**
         * Removes the current selection from the page (actual + fake)
         *
         */
        function removeSelection() {
            //noinspection JSUnresolvedVariable
            var sel = rangyPlgn.getSelection();
            if(isSelection() || isFakeSelection()) {
                sel.removeAllRanges();
                var fakeSelectionObj = $('[fakeSelection]');
                //Remove the <span> wrapper if no styles are applied
                if(fakeSelectionObj.attr('style') === '') {
                    fakeSelectionObj.replaceWith(fakeSelectionObj.html());
                } else {
                    fakeSelectionObj.removeAttr('fakeSelection'); //Also remove the text selection simulation
                }
            }
        }

        /** Private methods **/
        function getSelectedId(key) {
            return getSelectedTextDomObj().closest('.' + key).attr('id');
        }

        function setDomObj(type, key, options) {
            restoreSelection();
            var existingLinkObj = getSelectedTextDomObj().closest('.' + key);
            var existsLink = existingLinkObj.length > 0;
            if(existsLink) { //If the link was there before, we'll update its attributes
                existingLinkObj.attr(options);
            } else { //The link is going to be created by the first time
                var classApplier = rangyPlgn.createCssClassApplier(key, {
                    elementTagName      : type,
                    elementProperties   : options
                });
                classApplier.applyToSelection();
            }
            restoreSelection();
        }
        /** End of private methods **/

        return {
            saveSelection:saveSelection,
            setFakeSelection:setFakeSelection,
            getSelectedTextDomObj:getSelectedTextDomObj,
            isSelection:isSelection,
            isFakeSelection:isFakeSelection,
            setStylesToSelection:setStylesToSelection,
            restoreSelection:restoreSelection,
            removeSelection:removeSelection,
            setLink: setLink,
            setHeading: setHeading,
            getSelectedLink: getSelectedLink,
            getSelectedHeadingId: getSelectedHeadingId,
            getSelectedLinkId: getSelectedLinkId
        };
    }]);
})();
