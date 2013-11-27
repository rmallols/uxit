(function () {
    'use strict';
    COMPONENTS.directive('editBox', ['editBoxUtilsService', 'keyboardService',
    function (editBoxUtilsService, keyboardService) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'editBox.html',
            replace: true,
            scope: {
                model           : '=',
                internalData    : '=',
                panels          : '=',
                target          : '=',
                arrowPos        : '=',
                onSave          : '&',
                onChange        : '&',
                onCancel        : '&',
                onClose         : '&'
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

                scope.change = function () {
                    if (scope.onChange)  { scope.onChange(); }
                };

                scope.save = function () {
                    editBoxUtilsService.hideEditBox(scope.target.id);
                    if (scope.onSave)   { scope.onSave(scope.model, scope.$id); }
                    if (scope.onClose)  { scope.onClose(); }
                };

                scope.cancel = function () {
                    editBoxUtilsService.hideEditBox(scope.target.id);
                    if (scope.onCancel) { scope.onCancel(); }
                    if (scope.onClose)  { scope.onClose(); }
                };

                scope.getArrowPos = function () {
                    return {
                        top: scope.target.coordinates.top - element.offset().top
                    };
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
