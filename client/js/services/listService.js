(function () {
    'use strict';
    COMPONENTS.factory('listService', ['crudService', 'i18nService', function (crudService, i18nService) {

        /**
         *
         *
         * @param options
         * @param callback
         */
        function loadList(options, callback) {
            var filter = {
                q           :   { $and: [
                                    { $or: getFilterOptions(options.searchText, options.searchTargets) },
                                    { $or: getTagOptions(options.tags) }
                                ]},
                currentPage :   options.currentPage,
                pageSize    :   options.pageSize,
                skip        :   options.skip,
                sort        :   options.sort,
                projection  :   options.projection
            };
            crudService.get(options.collection, null, filter, function (list) {
                if(callback) { callback(list); }
            });
        }

        /**
         *
         *
         * @param collection
         * @param itemId
         */
        function deleteListItem(collection, itemId) {
            crudService.delete(collection, itemId, null);
        }

        /** Private methods **/
        function getFilterOptions(searchText, searchTargets) {
            var filterOptions = [], currentLanguage = i18nService.getCurrentLanguage(),
                inexactSelector = dbService.getInexactSelector(searchText);
            searchTargets.forEach(function (searchTarget) {
                var filterOption = {}, i18nFilterOption = {}, i18nSearchTarget;
                filterOption[searchTarget] = inexactSelector;
                filterOptions.push(filterOption);     //Add plain text filter
                i18nSearchTarget = searchTarget + '.' + currentLanguage + '.text';
                i18nFilterOption[i18nSearchTarget] = inexactSelector;
                filterOptions.push(i18nFilterOption); //Add i18n text filter
            });
            return filterOptions;
        }

        function getTagOptions(tags) {
            var tagOptions = [];
            if (tags) {
                tags.forEach(function (tag) {
                    tagOptions[tagOptions.length] = { tag: tag };
                });
            }
            return tagOptions;
        }

        return {
            loadList : loadList,
            deleteListItem: deleteListItem
        };
    }]);
})();
