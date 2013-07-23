(function (io) {
    'use strict';
    COMPONENTS.factory('liveMessageService', [function () {

        var socket = io.connect(window.location.origin);

        socket.on('publicMessageReceived', function (data) {
            //stdService.error(data.text, data.details);
            alert("msg received" + data.text + ' - ' + data.details);
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
