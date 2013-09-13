(function () {
    'use strict';

    COMPONENTS.factory('contentEditableSelectMediaService', ['contentEditableService', 'editBoxUtilsService',
    function (contentEditableService, editBoxUtilsService) {

        /**
         *
         *
         * @param cEScope
         * @param cEDomObj
         * @param sMDomObj
         * @param ngModelCtrl
         */
        function showEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl) {
            var defaultPanels = [{ title: 'Select media', type: 'selectMedia' }];
            if (cEScope.isEditable()) {
                unselectItem($('img.active', cEDomObj));
                editBoxUtilsService.hideEditBox(null);
                cEScope.internalData = {
                    mediaSize: getMediaSize(sMDomObj)
                };
                selectItem(sMDomObj);
                cEScope.panels = defaultPanels;
                cEScope.onSave = function() {
                    onSaveEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl);
                };
                cEScope.onCancel = function() {
                    onCancelEditBox(sMDomObj);
                };
                cEScope.onChange = function() {
                    onChangeEditBox(cEScope, sMDomObj);
                };
                editBoxUtilsService.showEditBox(cEScope, cEDomObj, sMDomObj);
                cEScope.showActions = true;
            }
        }

        /** Private methods **/
        function onSaveEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl) {
            unselectItem(sMDomObj);
            contentEditableService.updateValue(cEScope, cEDomObj, ngModelCtrl);
            contentEditableService.propagateChanges(cEScope);
        }

        function onCancelEditBox(sMDomObj) {
            unselectItem(sMDomObj);
        }

        function onChangeEditBox(cEScope, sMDomObj) {
            setMediaSize(sMDomObj, cEScope.internalData.mediaSize);
        }

        function selectItem(domObj) {
            domObj.addClass('active');
        }

        function unselectItem(domObj) {
            domObj.removeClass('active');
        }

        function setMediaSize(sMDomObj, mediaSize) {
            sMDomObj.attr('size', mediaSize);
        }

        function getMediaSize(sMDomObj) {
            return sMDomObj.attr('size');
        }
        /** End of private methods **/

        return {
            showEditBox: showEditBox
        };
    }]);
})();