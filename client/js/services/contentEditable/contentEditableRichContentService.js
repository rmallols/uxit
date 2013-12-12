(function () {
    'use strict';

    COMPONENTS.factory('contentEditableRichContentService', ['contentEditableService', 'editBoxUtilsService',
    'textSelectionService', 'tooltipService', 'styleService',
    function (contentEditableService, editBoxUtilsService, textSelectionService, tooltipService, styleService) {

        /**
         * Shows the edit box in order to modify the styles of the currently selected text
         *
         * @param {object} cEScope      The scope of the content editable component
         * @param {object} cEDomObj     The pointer to the DOM object where the content editable is
         * @param {object} ngModelCtrl  The controller of the ng-model directive attached to the content editable component
         */
        function showEditBox(cEScope, cEDomObj, ngModelCtrl) {
            if (cEScope.isEditable() && textSelectionService.isSelection()) {
                var selectedTextDomObj = textSelectionService.getSelectedTextDomObj(), defaultPanels;
                cEScope.style = styleService.getComputedStyleInRange(cEDomObj, selectedTextDomObj);
                defaultPanels = [{ title: 'Content', src: 'richContent', bindings: { style: cEScope.style} }];
                forceTextSelection();
                cEScope.panels = (cEScope.customPanels) ? cEScope.customPanels : defaultPanels;
                cEScope.onSave = function() {
                    onSaveEditBox(cEScope, cEDomObj, ngModelCtrl);
                };
                cEScope.onCancel = function() {
                    onCancelEditBox(cEScope);
                };
                cEScope.onChange = function() {
                    onChangeEditBox(cEScope, cEDomObj, ngModelCtrl, cEScope.style);
                };
                editBoxUtilsService.showEditBox(cEScope, cEDomObj, selectedTextDomObj);
                cEScope.showActions = true;
            }
        }

        /** Private methods **/
        function onSaveEditBox(cEScope, cEDomObj, ngModelCtrl) {
            setLinkTitles(cEScope); //Set the titles of the links with the tooltip directive
            textSelectionService.removeSelection(); //Remove text selection, if case
            contentEditableService.updateValue(cEScope, cEDomObj, ngModelCtrl);
            contentEditableService.propagateChanges(cEScope);
        }

        function onCancelEditBox(cEScope) {
            textSelectionService.removeSelection(); //Remove text selection, if case
            contentEditableService.propagateChanges(cEScope);
        }

        function onChangeEditBox(cEScope, cEDomObj, ngModelCtrl, styles) {
            textSelectionService.restoreSelection(); //Restore saved selection
            textSelectionService.setStylesToSelection(styles); //Apply styles physically
            contentEditableService.updateValue(cEScope, cEDomObj, ngModelCtrl);
        }

        function forceTextSelection() {
            textSelectionService.setFakeSelection();
            textSelectionService.saveSelection(); //Save the current text selection to be able to restore if afterwards
        }

        function setLinkTitles(cEScope) {
            var selLinkDomObj = textSelectionService.getSelectedLink(),
                newTitle = selLinkDomObj.attr('title');
            if(selLinkDomObj.size()) { //Update titles just if the edited element is as link
                if(tooltipService.exists(selLinkDomObj)) {
                    updateLinkTitle(selLinkDomObj, newTitle); //If the link already existed, update it
                } else { //If the link has just been created, compile it
                    contentEditableService.compileElement(cEScope, selLinkDomObj);
                }
                //Save a backup of the title so it would be regenerated afterwards if necessary
                tooltipService.backupTitle(selLinkDomObj, newTitle);
            }
        }

        function updateLinkTitle(linkObj, newTitle) {
            tooltipService.setTitle(newTitle, linkObj, true);
            linkObj.removeAttr('title');
        }
        /** End of private methods **/

        return {
            showEditBox: showEditBox
        };
    }]);
})();