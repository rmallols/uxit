(function () {
    'use strict';
    COMPONENTS.directive('editBox', ['editBoxUtilsService', 'pageService', 'keyboardService',
    function (editBoxUtilsService, pageService, keyboardService) {
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

                var arrowPosOptions = { top: 'top', right: 'right', bottom: 'bottom', left: 'left' },
                    directiveId     = 'editBox', mainScrollingElm = pageService.getMainScrollingElm(),
                    mainScrollingElmMarginLeft = parseInt(mainScrollingElm.css('margin-left'), 10),
                    arrowWidth = $(' > .arrow', element).width() / 2;
                scope.activeTab = { current: 0};
                scope.getStyles = function () {
                    var topPos  = scope.target.coordinates.top + (scope.target.coordinates.height / 2),
                        leftPos = (scope.arrowPos === arrowPosOptions.left)
                                    ? scope.target.coordinates.width + scope.target.coordinates.left
                                    - mainScrollingElmMarginLeft + arrowWidth
                                    : -(element.width() + arrowWidth)
                                    + scope.target.coordinates.left - mainScrollingElmMarginLeft;
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
                    var topPos              = scope.target.coordinates.top,
                        offsetTop           = element.offset().top,
                        scrollTop           = mainScrollingElm.scrollTop();
                    return {
                        top: topPos - offsetTop -  scrollTop
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
