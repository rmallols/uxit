(function () {
    'use strict';
    COMPONENTS.directive('editBox', ['editBoxUtilsService', 'keyboardService',
    function (editBoxUtilsService, keyboardService) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/client/html/admin/editBox.html',
            replace: true,
            scope: {
                model           : '=',
                internalData    : '=',
                panels          : '=',
                onSave          : '=',
                onChange        : '=',
                onCancel        : '=',
                onClose         : '=',
                target          : '=',
                arrowPos        : '='
            },
            link: function (scope, element) {

                var arrowPosOptions = { top: 'top', right: 'right', bottom: 'bottom', left: 'left' }, directiveId = 'editBox';
                scope.activeTab = 0;
                scope.getStyles = function () {
                    var topPos  = scope.target.coordinates.top + (scope.target.coordinates.height / 2),
                        leftPos = (scope.arrowPos === arrowPosOptions.left)
                                    ? scope.target.coordinates.width + scope.target.coordinates.left
                                    : -(element.width() + scope.target.coordinates.width) + scope.target.coordinates.left;
                    return {
                        top : topPos,
                        left: leftPos
                    };
                };

                scope.save = function () {
                    console.log("X1", scope);
                    editBoxUtilsService.hideEditBox(scope.target.id);
                    if (scope.onSave)   { scope.onSave(scope.model, scope.$id); }
                    if (scope.onClose)  { scope.onClose(); }
                };

                scope.change = function (data) {
                    if (scope.onChange) { scope.onChange(scope.model, scope.$id, data); }
                };

                scope.cancel = function () {
                    editBoxUtilsService.hideEditBox(scope.target.id);
                    if (scope.onCancel) { scope.onCancel(); }
                    if (scope.onClose)  { scope.onClose(); }
                };

                function registerKeyboardEvents() {
                    keyboardService.register('ctrl+enter', directiveId, function () {
                        scope.save();
                        scope.$apply();
                    });
                    keyboardService.register('esc', directiveId, function () { //Add a app
                        scope.cancel();
                        scope.$apply();
                    });
                }

                registerKeyboardEvents();
            }
        };
    }]);
})();
