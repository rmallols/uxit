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
                show: onColorPaletteShow
            });

            inputElm.change(function() {
                scope.model = (scope.isTransparent) ? 'transparent' : $(this).val();
                scope.$apply();
                if (scope.onChange) { scope.onChange(); }
            });

            scope.$watch('model', function (newVal) {
                //Ensure that the new model value is an string, as some strange situation may occur...
                if(angular.isString(newVal)) {
                    updateInputColor(newVal);  //Update the UI part of the component
                //...Otherwise, just initialize the model to a valid, empty string
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
            function onColorPaletteShow() {
                removeTransparentColor();
                scope.$apply();
            }

            function updateInputColor(newColor) {
                var uiColor = (newColor === 'transparent') ? '' : newColor;
                if(newColor === 'transparent') { setTransparentColor(); }
                $timeout(function() { //Update the color in a new thread to avoid $digest problems
                    //Just update if the the source is external, not if the user is editing the input
                    if(!inputElm.is(':focus')) {
                        //Force the case again as otherwise, for some unknown reason,
                        //the minicolors component will complain from the 2nd time a DOM element
                        //is instantiated
                        inputElm.minicolors('letterCase', 'uppercase');
                        inputElm.minicolors('value', uiColor);
                        inputElm.val(uiColor);
                    }
                });
            }

            function setTransparentColor() {
                scope.isTransparent = true;
                scope.model = 'transparent';
                inputElm.attr('readonly', 'readonly');
            }

            function removeTransparentColor() {
                scope.isTransparent = false;
                if(scope.model === 'transparent') {
                    scope.model = '';
                }
                inputElm.removeAttr('readonly');
            }
		}
	};
}]);
