COMPONENTS.directive('verticalTabs', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        template:   '<ul class="tabs level2">' +
                        '<li class="tabButton {{tab.styleClass}}" ng-repeat="tab in tabs" ng-class="isCurrentLayer($index)" ' +
                        'ng-click="setCurrentLayer($index)">' +
                            '<label i18n="{{tab.title}}"></label>' +
                        '</li>' +
                    '</ul>',
        scope: {
            tabs: '=verticalTabs'
        },
        link: function link(scope) {

            scope.isCurrentLayer = function (layer) {
                if (layer === scope.activePanel) {
                    return 'active';
                }
                return null;
            };

            scope.setCurrentLayer = function (tabIndex) {
                scope.activePanel = tabIndex;
                $('.content.level2 > ul').css('top', '-' + (tabIndex * 100) + '%');
            };

            scope.activePanel = 0;
        }
    };
}]);