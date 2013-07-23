(function () {
    'use strict';
    COMPONENTS.factory('emailService', ['ajaxService', function (ajaxService) {

        /**
         * Validates a given email
         *
         * @param   {string}    email The email string to be validated
         * @returns {boolean}   True if the string is valid. False otherwise
         */
        function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }

        /**
         * Sends an email
         * @param {object}  data        The details of the email (addressee(s), title, content...)
         * @param           callback    The method to execute once the message is sent
         */
        function sendEmail(data, callback) {
            ajaxService.ajax({
                url     : '/rest/sendEmail',
                method  : 'POST',
                data    : data,
                success	: function (response) {
                    if (callback) {
                        callback(response);
                    }
                }
            });
        }

        return {
            validateEmail: validateEmail,
            sendEmail: sendEmail
        };
    }]);
})();
