(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('listDb', ['$rootScope', '$location', 'rowService', 'listService', 'listDbService',
    function ($rootScope, $location, rowService, listService, listDbService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'listDb.html',
            scope : {
                _id             : '=id',   //???
                collection      : '=',
                exportedItems   : '=list',
                config          : '=',
                projection      : '=',
                searchTargets   : '=',
                template        : '=',
                transcludedData : '=',
                onSelectPanels  : '=',
                onSelect        : '&'
            },
            link: function link(scope) {

                scope.currentPage = 0;
                scope.searchText = '';

                scope.loadList = function () {
                    loadList();
                };

                scope.createItem = function (item) {
                    listDbService.createItem(scope.collection, item);
                };

                scope.deleteItem = function (id) {
                    listDbService.deleteItem(scope.collection, id);
                    scope.loadList();
                };

                scope.onSearch = function($text) {
                    scope.searchText = $text;
                    scope.loadList();
                };

                //Load the list just once some meaningful data is provided as otherwise the current directive
                //could try to get data before it's provided from the invoking function
                scope.$watch('collection', function () {
                    scope.loadList();
                    //Reload changes everytime the change flag is received
                    $rootScope.$on(scope.collection + 'Changed', function () { scope.loadList(); });
                });

                /** Private methods **/
                function loadList() {
                    var options = {
                        collection      : scope.collection,
                        searchText      : scope.searchText,
                        searchTargets   : scope.searchTargets,
                        currentPage     : scope.currentPage,
                        pageSize        : listService.getDefaultValue('pageSize', scope.config),
                        skip            : listService.getDefaultValue('skip', scope.config),
                        sort            : listService.getDefaultValue('sort', scope.config),
                        projection      : scope.projection
                    };
                    listDbService.loadList(options, function(list) {
                        scope.totalSize = list.totalSize;
                        scope.items = list.results;
                        if(scope.exportedItems) {
                            scope.exportedItems = scope.items;
                        }
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);