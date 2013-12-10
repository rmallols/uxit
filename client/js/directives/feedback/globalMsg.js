COMPONENTS.directive('globalMsg', ['$rootScope', 'globalMsgService', 'domService',
function ($rootScope, globalMsgService, domService) {
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

            globalMsgService.onShow(function (text, details, type) {
                //Show the global message if it was not visible already
                if (!scope.globalMsg) {
                    scope.globalMsg = {
                        text    : text,
                        details : details,
                        type    : type
                    };
                    //Maybe the loading message is visible, so it's necessary to remove it
                    domService.removeLoadingFeedback($('body'));
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
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
                var type;
                if(scope.globalMsg) {
                    type = Number(scope.globalMsg.type);
                    return { active: true, success: type === 1, info: type === 0, error: type === -1 };
                }
                return null;
            };

            scope.toggleDetails = function () {
                scope.isDetailsVisible = scope.isDetailsVisible === false;
            };
		}
	};
}]);
