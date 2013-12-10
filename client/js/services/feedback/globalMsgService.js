(function () {
    'use strict';
    COMPONENTS.factory('globalMsgService', ['arrayService', function (arrayService) {

        var onShowObservers = [], onHideObservers = [], onShowQueue = [];

        /**
         * Shows the global message
         *
         * @param {string} text     Main text of to be displayed
         * @param {string} details  Secondary text to be displayed,
         * @param {number} type     The type of the message (1=success, 0=info, -1=error)
         *                          that will be shown just whenever the user will click in the 'show details' link
         */
        function show(text, details, type) {
            if(!type) { type = -1; } //Assume an error message by default
            var normalizedMsg = normalizeMessage(text, details, type);
            if(onShowObservers.length) {
                onShowObservers.forEach(function (onShowObserver) {
                    onShowObserver(normalizedMsg.text, normalizedMsg.details, normalizedMsg.type);
                });
            } else { //If no observer has arrived yet, save the message into a queue
                arrayService.add(onShowQueue, {text: text, details: details, type: type}, 0);
            }
        }

        /**
         * Hides the global message
         *
         */
        function hide() {
            onHideObservers.forEach(function (onHideObserver) {
                onHideObserver();
            });
        }

        /**
         * Triggers a given observer event whenever the global message is shown
         *
         * @param {function} observer The function to be executed whenever the global message is shown
         */
        function onShow(observer) {
            onShowObservers.push(observer);
            //If there's something to show pending on the queue, show it and remove it from the queue
            if(onShowQueue.length) {
                onShowQueue.forEach(function(onShowQueyeMsg, index) {
                    show(onShowQueyeMsg.text, onShowQueyeMsg.details, onShowQueyeMsg.type);
                    arrayService.delete(onShowQueue, index);
                });
            }
        }

        /**
         * Triggers a given observer event whenever the global message is hidden
         *
         * @param {function} observer The function to be executed whenever the global message is hidden
         */
        function onHide(observer) {
            onHideObservers.push(observer);
        }

        /** Private methods **/
        function normalizeMessage(text, details, type) {
            var normalizedMsg = {};
            try {
                normalizedMsg = $.parseJSON(text);
            } catch(ex) {
                normalizedMsg = { text: text, details: details, type: type };
            }
            return normalizedMsg;
        }
        /** End of private methods **/

        return {
            show: show,
            hide: hide,
            onShow: onShow,
            onHide: onHide
        };
    }]);
})();
