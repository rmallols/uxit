(function () {
    'use strict';

    COMPONENTS.factory('editBoxUtilsService', ['$compile', 'domService', 'keyboardService',
    function ($compile, domService, keyboardService) {

        var isHideActionBlocked = false, isMoving = false, serviceId = 'editBoxUtilsService';

        /**
         * Shows the edit box
         *
         * @param {object} scope            The model of the DOM object where the edit bot will be attached to
         * @param {object} element          The pointer to the DOM object where the edit bot will be attached to
         * @param {object} selectedDomObj   The pointer to the DOM object of the selected text, if case
         */
        function showEditBox(scope, element, selectedDomObj) {
            function setTargetSettings() {
                //Add relative position to the parent element of the edit box
                //To force the [0,0] axis at its beginning and make the position placement easier afterwards
                element.parent().css('position', 'relative');
                //Save the ID of the invoking element to allow fine grain control from it afterwards
                scope.target = {
                    id          : scope.$id,
                    element     : element,
                    coordinates : (selectedDomObj)
                                    ? domService.getCoordinates(selectedDomObj)
                                    : domService.getCoordinates(element)
                };
            }

            function setArrowPos() {

                function isTargetObjLeftPlaced() {
                    return selectedDomObj.offset().left + (scope.target.coordinates.width / 2) < $(window).width() / 2;
                }

                scope.arrowPos = isTargetObjLeftPlaced() ? 'left' : 'right';
            }

            function addEditBoxToDom() {
                if (!scope.model) { scope.model = {}; }
                var editBoxObj, parentEditBoxObj;
                editBoxObj = $('<edit-box model="model" panels="panels" arrow-pos="arrowPos" ' +
                    'internal-data="internalData" on-save="onSave()" on-change="onChange()" on-cancel="onCancel()" ' +
                    'on-close="onClose()" target="target"></edit-box>');
                parentEditBoxObj = element.closest('.editBox');
                if (parentEditBoxObj.size()) {
                    editBoxObj.addClass('child');
                }
                element.after(editBoxObj);
                $compile(editBoxObj)(scope);
            }

            function safeUnblockEditBox() {
                setTimeout(function () {
                    if (!isMoving) {
                        unblockHideEditBox(); //Enable the hide action again after some small piece of time
                    }
                }, 100);
            }

            if(!isEditBoxVisible(element)) {
                setTargetSettings();
                setArrowPos();
                blockHideEditBox();     //Block the hide action to avoid flickering efect from portal directive
                addEditBoxToDom();
                safeUnblockEditBox();   //Unblock the hidding action
            }
        }

        /**
         * Hides the edit box
         *
         * @param {string} textBoxId Id of the edit box that is going to be closed.If not given, all edit boxes are closed
         */
        function hideEditBox(textBoxId) {
            if (!isHideActionBlocked) { //Hide the edit box if the mutex is not enabled
                if (textBoxId) {
                    $('#editBox' + textBoxId).remove();
                } else {
                    $('.editBox').remove();
                }
            }
            function unregisterKeyboardEvents() {
                keyboardService.unregister('esc', serviceId);
                //Unregister the edit events as well
                keyboardService.unregister('left', 'edit');
                keyboardService.unregister('right', 'edit');
            }
            unregisterKeyboardEvents();
        }

        /**
         * Gets the edit box visibility status, considering all the instances
         *
         * @returns {boolean} True if there is at least one edit box visible. False otherwise
         */
        function isAnyEditBoxVisible() {
            return $('.editBox').size() > 0;
        }

        /**
         *
         *
         * @param   {object}    event   The event that owns the click action
         * @returns {boolean}           True if the click was done inside of an edit box. False otherwise
         */
        function isEditBoxClicked(event) {
            return $(event.target).closest('.editBox').size() > 0;
        }

        /**
         * Disables the possibility to hide the edit box
         *
         */
        function blockHideEditBox() {
            isHideActionBlocked = true;
        }

        /**
         * Enables the possibility to hide the edit box
         *
         */
        function unblockHideEditBox() {
            isHideActionBlocked = false;
        }

        /** Private methods **/
        function isEditBoxVisible(element) {
            return element.next('.editBox').size() > 0;
        }
        /** End of private methods **/

        return {
            showEditBox         : showEditBox,
            hideEditBox         : hideEditBox,
            isAnyEditBoxVisible : isAnyEditBoxVisible,
            isEditBoxClicked    : isEditBoxClicked,
            blockHideEditBox    : blockHideEditBox,
            unblockHideEditBox  : unblockHideEditBox
        };
    }]);
})();
