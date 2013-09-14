(function () {
    'use strict';

    COMPONENTS.factory('contentEditableService', ['$compile', '$timeout', 'editBoxUtilsService',
    function ($compile, $timeout, editBoxUtilsService) {

        /**
         * Updates the model, sending the uxChange event
         *
         * @param {object} cEScope      The scope of the content editable component
         * @param {object} cEDomObj     The pointer to the DOM object where the content editable is
         * @param {object} ngModelCtrl  The controller of the ng-model directive attached to the content editable component
         */
        function updateValue(cEScope, cEDomObj, ngModelCtrl) {
            if (cEDomObj.html() === '<br>') { cEDomObj.html(''); }
            cEScope.content = cEDomObj.html();     //Set the model value
            handlePlaceholder(cEScope);
            ngModelCtrl.$setViewValue(cEScope.content);
            if (cEScope.uxChange) { cEScope.uxChange(); }
        }

        /**
         * Propagates the blur event. In practice, this means to finish editing the content of the content editable component
         *
         * @param {object} cEScope The scope of the content editable component
         */
        function propagateChanges(cEScope) {
            //It's necessary to execute the blur actions with some delay to ensure the model is up to date before
            //For instance, without it the showActions flag will be set to false immediately,
            //and so the action buttons will never be reached as their keyup event is fired after this blur one
            $timeout(function() {
                if (!editBoxUtilsService.isAnyEditBoxVisible()) {
                    cEScope.showActions = false;
                    if (cEScope.onBlur) {
                        cEScope.onBlur();
                    }
                }
            }, 250);
        }

        /**
         * Determines if the placeholder of the content editable component has to be shown or hidden depending on the content
         *
         * @param {object} cEScope The scope of the content editable component
         */
        function handlePlaceholder(cEScope) {
            cEScope.showPlaceholder = (cEScope.content === undefined || cEScope.content === '');
        }

        /**
         * Compiles a piece of DOM
         *
         * @param {object} cEScope  The scope of the content editable component
         * @param {object} elmObj   The pointer to the DOM object where the content editable is
         */
        function compileElement(cEScope, elmObj) {
            $compile(elmObj)(cEScope);
        }

        /** Private methods **/

        /** End of private methods **/

        return {
            updateValue: updateValue,
            propagateChanges: propagateChanges,
            handlePlaceholder: handlePlaceholder,
            compileElement: compileElement
        };
    }]);
})();