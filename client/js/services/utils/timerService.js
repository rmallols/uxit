(function (clearInterval) {
    'use strict';

    COMPONENTS.factory('timerService', [function () {

        /**
         * (Re)sets the timer that executes a given function
         *
         * @param   {int}       transitionTimer The pointer to the timer
         * @param   {object}    method          The function that is going to be executed every time interval
         * @param   {int}       timer           The time interval
         * @returns {int}                       The ID of the interval reference
         */
        function updateInterval(transitionTimer, method, timer) {
            clearInterval(transitionTimer);
            transitionTimer = setInterval(method, timer);
            return transitionTimer;
        }

        /**
         * Provides a 10^5 scale random integer
         *
         * @returns {int} The random integer
         */
        function getRandomNumber() {
            return Math.floor(Math.random() * 1000000);
        }

        return {
            updateInterval: updateInterval,
            getRandomNumber : getRandomNumber
        };
    }]);
})(window.clearInterval);
