(function () {
    'use strict';
    COMPONENTS.factory('listService', ['crudService', 'dbService', 'i18nService', function (crudService, dbService, i18nService) {

        /**
         * Gets a list of items from a given collection
         *
         * @param {object}      options     The settings that will define the query to execute (collection, filters...)
         * @param {function}    callback    The function to execute once the list has been loaded
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
         * Deletes an item from the list
         *
         * @param {string} collection   The collection where the item to be removed is
         * @param {string} itemId       The Id of the item that is going to be removed
         */
        function deleteItem(collection, itemId) {
            crudService.delete(collection, itemId, null);
        }

        /**
         * Stores the item that is going to be detailed following the master-detail view approach
         *
         * @param {object}  listScope   The scope of the list
         * @param {string}  detailId    The Id of the element that is going to be detailed
         */
        function setDetailId(listScope, detailId) {
            listScope.detailId = detailId;
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
        /** End of private methods **/

        return {
            loadList : loadList,
            deleteItem: deleteItem,
            setDetailId: setDetailId
        };
    }]);
})();
