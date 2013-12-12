(function () {
    'use strict';

    COMPONENTS.factory('contentEditableSelectMediaService', ['contentEditableService', 'editBoxUtilsService', 'mediaService',
    function (contentEditableService, editBoxUtilsService, mediaService) {
        
        /**
         * Shows the edit box in order to modify the properties of the currently selected media (source, size...)
         *
         * @param {object} cEScope      The scope of the content editable component
         * @param {object} cEDomObj     The pointer to the DOM object where the content editable is
         * @param {object} sMDomObj     The pointer to the DOM object where the selected text is
         * @param {object} ngModelCtrl  The controller of the ng-model directive attached to the content editable component
         */
        function showEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl) {
            var defaultPanels = [{
                title: 'Select media',
                src: 'selectMedia',
                bindings: {
                    mediaSize: getMediaSize(sMDomObj)
                },
                onLayer: {
                    change: function(newMedia, mediaSize) {
                        setMediaSrc(sMDomObj, newMedia);
                        setMediaSize(sMDomObj, mediaSize);
                    }
                }}];
            if (cEScope.isEditable()) {
                unselectItem($('img.active', cEDomObj));
                editBoxUtilsService.hideEditBox(cEScope.$id);
                selectItem(sMDomObj);
                cEScope.panels = defaultPanels;
                cEScope.onSave = function() {
                    onSaveEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl);
                };
                cEScope.onCancel = function() {
                    onCancelEditBox(sMDomObj);
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

        function selectItem(domObj) {
            domObj.addClass('active');
        }

        function unselectItem(domObj) {
            domObj.removeClass('active');
        }

        function setMediaSrc(sMDomObj, sMData) {
            if(sMData) {
                sMDomObj.attr('src', mediaService.getDownloadUrl(sMData));
            }
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