COMPONENTS.directive('mandatory', ['validationService', function (validationService) {
    'use strict';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var value = scope.$eval(attrs.ngModel),
                validationTitle = 'This field is required', validationKey = 'mandatory',
                validationFn    = function (viewValue) {
                    return viewValue && viewValue !== '';
                };
            validationService.setupValidation(value, element, ctrl, validationTitle, null, validationKey, validationFn);
        }
    };
}]);