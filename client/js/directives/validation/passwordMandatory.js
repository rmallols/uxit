COMPONENTS.directive('passwordMandatory', ['$compile', 'validationService', function ($compile, validationService) {
    'use strict';
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var value = scope.$eval(attrs.ngModel),
                validationTitle = 'Password must meet the following requirements', validationKey = 'passwordMandatory',
                errorHtmlDetails =  '<ul>' +
                    '<li ng-class="pwdHasLetter">At least <strong>one letter</strong></li>' +
                    '<li ng-class="pwdHasNumber">At least <strong>one number</strong></li>' +
                    '<li ng-class="pwdValidLength">At least <strong>8 characters long</strong></li>' +
                    '</ul>',
                compiledErrorHtmlDetails = $compile(errorHtmlDetails)(scope),
                validationFn = function (viewValue) {
                    if(!viewValue) {
                       return true;
                    } else {
                        scope.pwdValidLength = (viewValue && viewValue.length >= 8  ? 'valid' : undefined);
                        scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                        scope.pwdHasNumber = (viewValue && /\d/.test(viewValue))    ? 'valid' : undefined;
                        return scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber;
                    }
                };
            validationService.setupValidation(value, element, ctrl, validationTitle,
                                              compiledErrorHtmlDetails, validationKey, validationFn);
        }
    };
}]);