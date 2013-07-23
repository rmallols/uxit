(function (undefined) {
    'use strict';

    COMPONENTS.factory('validationService', [function () {

        /**
         * Determines if a given form(s) is/are valid or not
         *
         * @param {*} formObjs A form (or an array of forms) that represent the ng-form object
         * @returns {boolean} True if the form (or group of forms) is valid. False otherwise
         */
        function isFormValid(formObjs) {

            function validateForm(formObj) {
                return formObj.$pristine || (formObj.$dirty && formObj.$valid);
            }

            var isValid = true;
            if ($.isArray(formObjs)) {
                formObjs.forEach(function (formObj) {
                    //The form will be valid just if all the subforms are valid
                    isValid *= validateForm(formObj);
                });
            } else {
                isValid = validateForm(formObjs);
            }
            return isValid;
        }

        /**
         * Sets the focus on the first invalid model binded field
         *
         * @param {object} wrapperObj The pointer to the DOM objects that wraps the scope of the invalid field search
         */
        function setFocusOnFirstError(wrapperObj) {
            $('.ng-invalid[ng-model]:first', wrapperObj).focus().addClass('forceMessage');
        }

        /**
         * Defines the validation mechanism of a given component
         *
         * @param {*}           defValue            The default value of the component
         * @param {object}      element             The pointer to the component DOM object
         * @param {object}      ctrl                The ng-model controller of the component
         * @param {string}      errorTitle          The message to be shown each time the component is invalid
         * @param {string}      errorHtmlDetails    The details to be appended to the message
         * @param {string}      validationKey       The identifier of the validation chain attached to the component
         * @param {function}    validationFn        The method that will decide if the current state of the component is valid or not
         */
        function setupValidation(defValue, element, ctrl, errorTitle, errorHtmlDetails, validationKey, validationFn) {

            function addHelpMessage(inputObj, errorTitle, errorHtmlDetails) {
                if (!inputObj.data('decorated')) {
                    inputObj.wrap('<div class="positionRelative"></div>');
                    //The previous wrap sentence will cause the blur of the field, so, if it had before, it has to be focused again
                    inputObj.after('<div class="input-help"></div>');
                    setHelpMessageContent(inputObj, errorTitle, errorHtmlDetails);
                }
                inputObj.data('decorated', true); //Mark the input as already decorated
            }

            function updateHelpMessage(inputObj, errorTitle, errorHtmlDetails) {
                setHelpMessageContent(inputObj, errorTitle, errorHtmlDetails);
            }

            function setHelpMessageContent(inputObj, errorTitle, errorHtmlDetails) {
                var inputHelpObj = inputObj.next('.input-help'), detailsObj;
                inputHelpObj.empty();
                inputHelpObj.prepend('<div class="title">' + errorTitle + '</div>');
                if (errorHtmlDetails) { //Add details to the help bubble, if case
                    detailsObj = $('<div class="details"></div>');
                    inputHelpObj.append(detailsObj);
                    detailsObj.html(errorHtmlDetails);
                }
            }

            addHelpMessage(element, errorTitle, errorHtmlDetails);
            ctrl.$setValidity(validationKey, validationFn(defValue)); //Set the default validation status

            var validator = function (newValue) {
                if (validationFn(newValue)) {
                    ctrl.$setValidity(validationKey, true);
                    return newValue;
                } else {
                    ctrl.$setValidity(validationKey, false);
                    updateHelpMessage(element, errorTitle, errorHtmlDetails);
                    return undefined;
                }
            };
            ctrl.$formatters.push(validator);
            //noinspection JSUnresolvedFunction
            ctrl.$parsers.unshift(validator);
        }

        return {
            isFormValid: isFormValid,
            setFocusOnFirstError: setFocusOnFirstError,
            setupValidation: setupValidation
        };
    }]);
})(window.undefined);
