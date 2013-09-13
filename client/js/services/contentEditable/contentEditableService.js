(function () {
    'use strict';

    COMPONENTS.factory('contentEditableService', ['$compile', '$timeout', 'editBoxUtilsService',
    function ($compile, $timeout, editBoxUtilsService) {

        function updateValue(cEScope, cEDomObj, ngModelCtrl) {
            if (cEDomObj.html() === '<br>') { cEDomObj.html(''); }
            cEScope.content = cEDomObj.html();     //Set the model value
            handlePlaceholder(cEScope);
            ngModelCtrl.$setViewValue(cEScope.content);
            if (cEScope.uxChange) { cEScope.uxChange(); }
        }

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

        function handlePlaceholder(cEScope) {
            cEScope.showPlaceholder = (cEScope.content === undefined || cEScope.content === '');
        }

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