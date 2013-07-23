(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('nestedItems', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            terminal: true,
            scope : {
                items: '=',
                selectedItem: '=',
                onSelect: '&',
                onAdd: '&',
                onDelete: '&',
                sortableOptions: '='
            },
            link: function link(scope, element) {

                /* PRIVATE METHODS */
                function emitFn(fn, item) {
                    if (scope[fn]) {
                        scope[fn]({$item: item});
                    }
                }
                /* END PRIVATE METHODS */

                scope.selectItem    = function (item) { emitFn('onSelect', item); };
                scope.addItem       = function (item) { emitFn('onAdd', item); };
                scope.deleteItem    = function (item) { emitFn('onDelete', item); };
                scope.emitSelect    = function (item) { emitFn('onSelect', item); };
                scope.emitAdd       = function (item) { emitFn('onAdd', item); };
                scope.emitDelete    = function (item) { emitFn('onDelete', item); };

                scope.toggleSubItems = function (item) {
                    item.areSubItemsHidden = item.areSubItemsHidden !== true;
                };

                scope.getToggleSubItemsIcon = function (item) {
                    return item.areSubItemsHidden !== true ? 'downIcon' : 'rightIcon';
                };

                scope.$watch('sortableOptions', function (newVal) {
                    if (newVal) {
                        //The template has to be defined asyncrhonously because of its recursive nature
                        var template =  '<ul ui-sortable="sortableOptions" ng-model="items" class="items">' +
                                            '<li ng-repeat="item in items" class="item" ng-class="{hasSubItems:item.items.length}"' +
                                            'ng-show="!item.deleted">' +
                                                '<div class="box" ng-class="{selected:item._id == selectedItem._id, collapsed:item.areSubItemsHidden}">' +
                                                    '<div class="sortingBox"></div>' +
                                                    '<button class="toggleSubItems small" ng-click="toggleSubItems(item)" ' +
                                                    'ng-show="item.items.length" ng-class="getToggleSubItemsIcon(item)"></button>' +
                                                    '<div ng-click="selectItem(item)"><label i18n-db="item.text"></label></div>' +
                                                    '<div class="actions">' +
                                                        '<button class="addIcon" ng-click="addItem(item)"></button>' +
                                                        '<button class="removeIcon" ng-click="deleteItem(item)"></button>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="subItemsContainer" ng-class="{hasSubItems:item.items.length}" ' +
                                                'ng-show="!item.areSubItemsHidden">' +
                                                    '<nested-items items="item.items" on-select="emitSelect($item)" ' +
                                                    'on-add="emitAdd($item)" on-delete="emitDelete($item)" ' +
                                                    'selected-item="selectedItem" sortable-options="sortableOptions"></nested-items>' +
                                                '</div>' +
                                            '</li>' +
                                        '</ul>';
                        element.append(template);
                        $compile(element.contents())(scope);
                    }
                });
            }
        };
    }]);
})(window.COMPONENTS);