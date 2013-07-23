COMPONENTS.directive('emailMandatory', ['emailService', 'validationService', function (emailService, validationService) {
    'use strict';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var value = scope.$eval(attrs.ngModel),
                validationTitle = 'Please enter a valid e-mail', validationKey = 'emailMandatory',
                validationFn    = function (viewValue) {
                    return !viewValue || viewValue === '' || emailService.validateEmail(viewValue);
                };
            validationService.setupValidation(value, element, ctrl, validationTitle, null, validationKey, validationFn);
        }
    };
}]);