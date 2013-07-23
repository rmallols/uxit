COMPONENTS.directive('radio', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
	'use strict';
    return {
        require: 'ngModel',
		restrict: 'A',
        replace: true,
        template:   '<div class="checkContainer">' +
                        '<input tabindex="{{tabindex}}" type="radio" id="radio{{$id}}" name="{{name}}">' +
                        '<label for="radio{{$id}}" ng-show="label" title="{{title}}" i18n-title>' +
                            '<label i18n="{{label}}"></label>' +
                        '</label>' +
                    '</div>',
        scope: {
            ngModel : '=',
            name    : '@',
            label   : '@',
            tabindex: '@',
            title   : '@'
        },
		link: function link(scope, element, attrs, ngModelCtrl) {

            var externalModelChange = false;

            //The plugins needs to be instantiated in a new thread, as otherwise its works clicking on the input
            //but clicking on the label performs strangely as the reference to its input is not always satisfied
            $timeout(function () {
                element.iCheck({
                    radioClass: 'check iradio_square-blue',
                    increaseArea: '20%' // optional
                });
            }, 0);
            if (scope.ngModel === attrs.value) {
                $(' > input', element).attr('checked', true);
            }

            element.on('ifChecked', function () {
                updateState(attrs.value);
            });

            function updateState(newState) {
                //Update the model and side effects (i.e. ngClick callback, if case)
                //just if the change comes directly from the checkbox, not from a external source
                if (newState && !externalModelChange) {
                    //In some situations, it could be interesting avoid updating the model
                    //whenever the state of the checkbox changes.
                    //This is mainly about the ng-click event, that can wire a function that will change
                    //the model by its own. It the model is updated here, that function will receive the opposite state
                    //so the toggle will probably do nothing
                    if (scope.blockUpdateModel !== 'true') {
                        scope.ngModel = newState;
                        //If the value has actually changed, propagate the view value change  to the ng-form controller
                        //so he'll set the $dirty state to the form
                        ngModelCtrl.$setViewValue(scope.ngModel);
                    }
                    if (scope.ngClick) { scope.ngClick(); }
                    if (!$rootScope.$$phase) { scope.$apply(); }
                }
            }
		}
	};
}]);
