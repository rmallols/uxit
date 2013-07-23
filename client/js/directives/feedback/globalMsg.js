COMPONENTS.directive('globalMsg', ['globalMsgService', 'domService', function (globalMsgService, domService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {},
        template:   '<div id="globalMsg" ng-class="getActiveStyleClass()">' +
                        '<div class="text">' +
                            '<label>{{globalMsg.text}}</label> ' +
                            '<a href="#" ng-show="globalMsg.details" ng-click="toggleDetails()">[Details]</a>' +
                            '<div class="details" ng-show="isDetailsVisible"><label>{{globalMsg.details}}</label></div>' +
                        '</div>' +
                        '<div class="actions"><button class="removeIcon" ng-click="hide()"></button></div>' +
                    '</div>',
		link: function link(scope) {

            globalMsgService.onShow(function (text, details) {
                //Show the global message if it was not visible already
                if (!scope.globalMsg) {
                    scope.globalMsg = {
                        text: text,
                        details: details
                    };
                    //Maybe the loading message is visible, so it's necessary to remove it
                    domService.removeLoadingFeedback($('body'));
                }
            });

            globalMsgService.onHide(function () {
                delete scope.globalMsg;
            });

            scope.isDetailsVisible = false;

            scope.hide = function () {
                globalMsgService.hide();
            };

            scope.getActiveStyleClass = function () {
                return (scope.globalMsg) ? 'active' : '';
            };

            scope.toggleDetails = function () {
                scope.isDetailsVisible = scope.isDetailsVisible === false;
            };
		}
	};
}]);
