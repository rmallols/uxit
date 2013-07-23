(function () {
    'use strict';

    COMPONENTS.factory('textSelectionService', [function () {

        //noinspection JSUnresolvedVariable
        var savedSel = false, rangyPlgn = rangy, linkKey = 'link';

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
         * Set link to the current selection (add / update actions)
         *
         * @param {object} linkOptions The object that contains all the link attributes (id, target, url...)
         */
        function setLink(linkOptions) {
            restoreSelection();
            var existingLinkObj = getSelectedTextDomObj().closest('.' + linkKey);
            var existsLink = existingLinkObj.length > 0;
            if(existsLink) { //If the link was there before, we'll update its attributes
                existingLinkObj.attr(linkOptions);
            } else { //The link is going to be created by the first time
                var classApplier = rangyPlgn.createCssClassApplier(linkKey, {
                    elementTagName      : "a",
                    elementProperties   : linkOptions
                });
                classApplier.applyToSelection();
            }
            restoreSelection();
        }

        /**
         * Gets the reference to the pointer to the DOM object of the closest link of the current selection
         *
         * @returns {object} The pointer to the DOM with the link
         */
        function getSelectedLinkDomObj() {
            return getSelectedTextDomObj().closest('.' + linkKey);
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
            getSelectedLinkDomObj: getSelectedLinkDomObj
        };
    }]);
})();
