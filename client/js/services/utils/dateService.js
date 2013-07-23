(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('dateService', [function () {

        /**
         * Normalizes the date format, setting always two digits for days and months tokens
         *
         * @param   {date}      date    The date to be formatted, with {m}m-{d}d-{yy}yy format
         * @returns {string}            The formatted date, with dd-mm-yyyy format
         */
        function getFormattedDate(date) {

            function normalizeDateToken(token) {
                return ("0" + token).slice(-2);
            }

            var dateObj, day, month, year;
            dateObj = new Date(date);
            day     = normalizeDateToken(dateObj.getDate());
            month   = normalizeDateToken(dateObj.getMonth() + 1); //Months are zero based
            year    = dateObj.getFullYear();
            return day + "-" + month + "-" + year;
        }

        return {
            getFormattedDate: getFormattedDate
        };
    }]);
})(window.COMPONENTS);
