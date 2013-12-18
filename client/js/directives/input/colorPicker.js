COMPONENTS.directive('colorPicker', ['$rootScope', '$timeout', 'styleService', 'i18nService',
function ($rootScope, $timeout, styleService, i18nService) {
	'use strict';
    return {
        require: 'ngModel',
		restrict: 'A',
        replace: true,
        template:   '<div class="colorPicker">' +
                        '<input type="text" placeholder="{{getI18nPlaceholder()}}"/>' +
                        '<div class="transparentToggle" checkbox ng-model="isTransparent" label="colorPicker.transparent" ' +
                        'ng-click="toggleTransparent()" />' +
                    '</div>',
        scope: {
            model       : '=ngModel',
            placeholder : '@',
            onChange    : '&'
        },
		link: function link(scope, element) {

            var inputElm = $(' > input[type="text"]', element);

            inputElm.minicolors({
                letterCase: 'uppercase',
                animationSpeed: 0,
                showSpeed: 0,
                hideSpeed: 0,
                show: function () {
                    removeTransparentColor();
                    $(this).focus();
                }
            });

            inputElm.blur(function() {
                scope.model = $(this).val();
                scope.$apply();
                if (scope.onChange) { scope.onChange(); }
            });

            scope.$watch('model', function (newVal) {
                if(angular.isString(newVal)) {
                    var uiColor = (newVal === 'transparent') ? '' : newVal;
                    if(newVal === 'transparent') {
                        setTransparentColor();
                    }
                    $timeout(function() { //Update the color in a new thread to avoid $digest problems
                        inputElm.minicolors('value', uiColor);
                    });
                } else if(!inputElm.is(':focus')) {
                    scope.model = '';
                }
            });

            scope.getI18nPlaceholder = function () {
                return i18nService(scope.placeholder);
            };

            scope.toggleTransparent = function() {
                if(scope.isTransparent) {
                    setTransparentColor();
                } else {
                    removeTransparentColor();
                }
                if(!$rootScope.$$phase) {
                    scope.$apply();
                }
            };

            /** Private methods **/
            function setTransparentColor() {
                scope.isTransparent = true;
                scope.model = 'transparent';
                inputElm.attr('readonly', 'readonly');
            }

            function removeTransparentColor() {
                scope.isTransparent = false;
                scope.model = '';
                inputElm.removeAttr('readonly');
            }
		}
	};
}]);
