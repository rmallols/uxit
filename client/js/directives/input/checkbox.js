COMPONENTS.directive('checkbox', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    'use strict';
    return {
        require: 'ngModel',
        restrict: 'A',
        replace: true,
        template:   '<div class="checkContainer">' +
                        '<input tabindex="{{tabindex}}" type="checkbox" id="checkbox{{$id}}">' +
                        '<label for="checkbox{{$id}}" ng-show="label" title="{{title}}" i18n-title>' +
                            '<label i18n="{{label}}"></label>' +
                        '</label>' +
                    '</div>',
        scope: {
            ngModel             : '=',
            ngClick             : '&ngClick',
            label               : '@',
            tabindex            : '@',
            title               : '@',
            blockUpdateModel    : '@' //Avoid updating the model
        },
        link: function link(scope, element, attrs, ngModelCtrl) {

            var externalModelChange = false;

            //The plugins needs to be instantiated in a new thread, as otherwise its works clicking on the input
            //but clicking on the label performs strangely as the reference to its input is not always satisfied
            $timeout(function () {
                element.iCheck({
                    checkboxClass: 'check icheckbox_square-blue',
                    increaseArea: '20%' // optional
                });
                if (scope.ngModel) { element.iCheck('check');
                } else { element.iCheck('uncheck'); }
            }, 0);

            scope.$watch('ngModel', function (newVal) {
                //Whenever the model changes externally, we need to visually update the component
                //The problem is that this update process will trigger the ifChecked / ifUnchecked methods
                //which will try to update again the model by themselves, causing a circular, infinite loop.
                //Consequently, it's necessary to distinguish when to update the model and when not from there
                //noinspection JSUnusedAssignment
                externalModelChange = true;
                element.iCheck((newVal) ? 'check' : 'uncheck');
                //Close the mutex after some courtesy delay
                setTimeout(function () {
                    externalModelChange = false;
                }, 0);
            });

            element.on('ifChecked', function () {
                updateState(true);
            });

            element.on('ifUnchecked', function () {
                updateState(false);
            });

            function updateState(newState) {
                //Update the model and side effects (i.e. ngClick callback, if case)
                //just if the change comes directly from the checkbox, not from a external source
                if (!externalModelChange) {
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
                    if (!$rootScope.$$phase) { scope.$apply(); }
                    if (scope.ngClick) { scope.ngClick(); }
                }
            }
        }
    };
}]);
