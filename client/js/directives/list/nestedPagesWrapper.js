(function () {
    'use strict';
    COMPONENTS.directive('nestedPagesWrapper', ['pageService', 'rowService', '$timeout',
    function (pageService, rowService, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template:   '<div>' +
                            '<nested-items-wrapper items="items" on-select="onSelect($item)" selected-item="selectedItem"' +
                            'on-add="onAddPage($item)"></nested-items-wrapper>' +
                        '</div>',
            scope: {
                pages: '=',
                items: '=',
                selectedItem: '=',
                onAdd: '&'
            },
            link: function link(scope) {

                /* PRIVATE METHODS */
                function getParentItem(parentId, parentItem) {
                    var matchedItem = null,
                        items = (parentItem) ? parentItem.items : scope.items;
                    items.forEach(function (candidateParentItem) {
                        if (candidateParentItem._id === parentId) {
                            matchedItem = candidateParentItem;
                        } else if (!matchedItem) {
                            matchedItem = getParentItem(parentId, candidateParentItem);
                        }
                    });
                    return matchedItem;
                }

                //The pages are stored flay way,
                //so it's necessary to create a hierarchical structure to ease the subpages handling
                function normalizeItems(pages) {
                    scope.pages = pages;
                    scope.items = [];
                    scope.pages.forEach(function (page) {
                        page.items = [];
                        if (!page.parentPageId) {
                            scope.items.push(page);
                        } else {
                            var parentItem = getParentItem(page.parentPageId);
                            parentItem.items.push(page);
                        }
                    });
                    selectFirstPage(); //By default, select the first page
                }

                function selectFirstPage() {
                    //We're selecting the new page in a new thready in order to allow other actions to be executed first
                    //For instance, if any of the properties set inside of the selectedItem object has to be init
                    //by the i18n component, we're letting this process to be executed before
                    //so once the page is selected, its structure will be fully ready
                    $timeout(function () {
                        scope.selectedItem = scope.items[0];
                    });
                }
                /* END PRIVATE METHODS */

                var pages;
                scope.selectedItem = {};
                scope.onSelect = function (page) {
                    scope.selectedItem = page;
                };

                scope.onAddPage = function (page) {
                    page.description = '';
                    //Initialize the rows structure to ensure that the apps will be able to be dropped there
                    page.rows = [rowService.getEmptyRow()];
                    if (scope.onAdd) { scope.onAdd({$page: page}); }
                };

                pages = pageService.getPages(); //Get all the pages in 'flat' mode
                normalizeItems(pages);          //Provide a hierarchical structure to ease the subpages handling
            }
        };
    }]);
})();