(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('list', ['$rootScope', '$location', 'rowService', 'listService',
    function ($rootScope, $location, rowService, listService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'list.html',
            scope : {
                _id             : '=id',   //???
                collection      : '=',
                items           : '=list',
                config          : '=',
                projection      : '=',
                searchTargets   : '=',
                template        : '=',
                transcludedData : '=',
                onSelectPanels  : '=',
                onSelect        : '&'
            },
            link: function link(scope) {

                console.log("WE NEED TO STORE SEARCH AND CURRENTPAGE IN AN OBJECT EACH IN ORDER TO ALLOW SENDING IT FROM THE LIST-ARRAY AND SO APPLY A WATCH AND AVOID FOR INSTANCE THE EXECUTESEARCH() METHOD THERE")
                scope.search = {
                   text: ''
                };
                scope.currentPage = 0;

                console.log("SEET!");

                setTimeout(function() {
                       console.log("AA", scope.searchText)
                }, 1000)

                scope.loadList = function () {
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
                    listService.loadList(options, function(list) {
                        scope.totalSize = list.totalSize;
                        scope.items = list.results;
                    });
                };

                scope.deleteItem = function (id) {
                    listService.deleteItem(scope.collection, id);
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

                /** End of private methods **/
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);