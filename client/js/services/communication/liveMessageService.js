(function (io) {
    'use strict';
    COMPONENTS.factory('liveMessageService', ['globalMsgService', function (globalMsgService) {

        var socket = io.connect(window.location.origin);

        socket.on('publicMessageReceived', function (data) {
            globalMsgService.show("msg received: " + data.text, data.details, 0);
        });

        /**
         * Sends a public portal message to all the connected users
         * @param {object}  data        The details of the message that is going to be shown (title and details)
         * @param           callback    The method to execute once the message is sent
         */
        function sendPublicMessage(data, callback) {
            socket.emit('publicMessage', data, function (result) {
                if (callback) { callback(result); }
            });
        }

        return {
            sendPublicMessage: sendPublicMessage
        };
    }]);
})(window.io);
