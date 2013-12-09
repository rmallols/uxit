COMPONENTS.directive('colorPicker', ['$rootScope', 'styleService', 'i18nService',
function ($rootScope, styleService, i18nService) {
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
		link: function link(scope, element, attrs, ngModelCtrl) {

            var rgbObj = null, inputElm = $(' > input[type="text"]', element);
            if (scope.model) {
                if(scope.model === 'transparent') { //Initialize the transparency, if case
                    scope.isTransparent = true;
                }
                rgbObj = styleService.rgbStrToRgbObj(scope.model);
                if (rgbObj) {
                    scope.model = styleService.rgbObjToHexStr(rgbObj);
                }
            }

            inputElm.minicolors({
                letterCase: 'uppercase',
                animationSpeed: 0,
                showSpeed: 0,
                hideSpeed: 0,
                show: function () {
                    removeTransparentColor();
                    $(this).focus();
                },
                changeDelay: 10, //Give some time margin to ensure that the change() callback takes the new value
                change: function (hex) {
                    //Normalize the model format to avoid problems with the lowercase translations
                    if(!scope.model) { scope.model = ''; }
                    //If the value has actually changed, propagate the view value change  to the ng-form controller
                    //so he'll set the $dirty state to the form
                    if (hex.toLowerCase() !== scope.model.toLowerCase()) {
                        ngModelCtrl.$setViewValue(scope.model);
                    }
                    scope.model = hex;
                    if(!$rootScope.$$phase) { scope.$apply(); }
                    if (scope.onChange) { scope.onChange(); }
                }
            });

            //We're manually setting the default value of the component as the built-in 'defaultValue' option
            //makes the component perform in a strange way
            scope.$watch('model', function (newVal) {
                //Wrap the plugin in a try-catch statement as for some unknown reason sometimes the settings
                //don't arrive to the minicolor plugin so it throwns an error
                if(scope.isTransparent) { //Check if the current value is set to 'transparent'
                    try { inputElm.minicolors('value', ''); }
                    catch (ex) {}
                    setTransparentColor();
                } else {
                    try { inputElm.minicolors('value', newVal); }
                    catch (ex) {}
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
