(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('editNotifications', ['emailService', 'stdService', 'userService', 'liveMessageService',
    function (emailService, stdService, userService, liveMessageService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'editNotifications.html',
            scope: {
                model: '=',
                onLayerSave : '&'
            },
            link: function link(scope) {

                scope.usersList = userService.getUsers();

                scope.level2Tabs = [
                    { title: 'editNotifications.email',         styleClass : 'notificationsIcon' },
                    { title: 'editNotifications.liveMessage',   styleClass : 'infoIcon' }
                ];

                scope.onLayerSave = function (callback) {
                    sendEmail(function () {
                        sendLiveMessage(function () {
                            scope.model.notifications = {}; //Cleanup the notifications object to avoid saving it
                            callback();
                        });
                    });
                };

                function sendEmail(callback) {
                    if (scope.model.notifications.email
                        && scope.model.notifications.email.subject && scope.model.notifications.email.text
                        && scope.model.notifications.email.selectedUsers.length > 0) {
                        var data = {
                            subject : scope.model.notifications.email.subject,
                            text    : scope.model.notifications.email.text,
                            to      : scope.model.notifications.email.selectedUsers.join(',')
                        };
                        emailService.sendEmail(data, function (result) {
                            if (result) {
                                callback();
                            } else {
                                stdService.error('There was an error sending the e-mail');
                            }
                        });
                    }
                    callback();
                }

                function sendLiveMessage(callback) {
                    if (scope.model.notifications.liveMessage
                     && scope.model.notifications.liveMessage.subject && scope.model.notifications.liveMessage.text) {
                        var data = {
                            text: scope.model.notifications.liveMessage.subject,
                            details: scope.model.notifications.liveMessage.text
                        };
                        liveMessageService.sendPublicMessage(data, function (result) {
                            if (result) {
                                callback();
                            } else {
                                stdService.error('There was an error sending the live message');
                            }
                        });
                    }
                    callback();
                }
            }
        };
    }]);
})(window.COMPONENTS);