(function () {
    'use strict';

    COMPONENTS.factory('contentEditableRichContentService', ['contentEditableService', 'editBoxUtilsService',
    'textSelectionService', 'tooltipService', 'styleService',
    function (contentEditableService, editBoxUtilsService, textSelectionService, tooltipService, styleService) {

        function showEditBox(cEScope, cEDomObj, ngModelCtrl) {
            if (cEScope.isEditable() && textSelectionService.isSelection()) {
                var selectedTextDomObj = textSelectionService.getSelectedTextDomObj(),
                    defaultPanels = [{ title: 'Content', type: 'richContent' }];
                cEScope.model = styleService.getComputedStyleInRange(cEDomObj, selectedTextDomObj);
                forceTextSelection();
                cEScope.panels = (cEScope.customPanels) ? cEScope.customPanels : defaultPanels;
                cEScope.onSave = function() {
                    onSaveEditBox(cEScope, cEDomObj, ngModelCtrl);
                };
                cEScope.onCancel = function() {
                    onCancelEditBox(cEScope);
                };
                cEScope.onChange = function(styles) {
                    onChangeEditBox(cEScope, cEDomObj, ngModelCtrl, styles);
                };
                editBoxUtilsService.showEditBox(cEScope, cEDomObj, selectedTextDomObj);
                cEScope.showActions = true;
            }
        }
        
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

        /** Private methods **/
        function setLinkTitles(cEScope) {
            var selLinkDomObj = textSelectionService.getSelectedLink(),
                newTitle = selLinkDomObj.attr('title');
            if(selLinkDomObj.size()) { //Update titles just if the edited element is as link
                if(tooltipService.exists(selLinkDomObj)) {
                    updateLinkTitle(selLinkDomObj, newTitle); //If the link already existed, update it
                } else {
                    contentEditableService.compileElement(cEScope, selLinkDomObj); //If the link has just been created, compile it
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