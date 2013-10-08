(function () {
    'use strict';
    COMPONENTS.service('staticContentAppService', ['$rootScope', 'contentService', 'pageService',
    'constantsService',
    function ($rootScope, contentService, pageService, constantsService) {

        function view(scope) {
            var onContentChangedFn = constantsService.collections.content + 'Changed';
            scope.onContentUpdated = function () { //Save callback from content editable
                contentService.updateContent(scope.internalData, null);
            };
            loadContent(scope);
            $rootScope.$on(onContentChangedFn, function (e, updatedContentId) {
                //Refresh the content just if the updated content is the current one
                if (scope.internalData._id === updatedContentId) {
                    loadContent(scope);
                }
            });
        }

        function edit(scope) {
        }

        function onEditSave(scope, callback) {
            var originalShowTitles = scope.model.showTitles;
            if (scope.model.showTitles !== originalShowTitles) {
                pageService.updateCurrentPage(null);
            }
            callback();
        }

        function selectContent(scope) {
            scope.contentList = [];
            var params = { projection: {title: 1}};
            contentService.getContent(null, params, function (contentList) {
                //IMPORTANT!!! Avoid the temptation of doing scope.contentList = content.results
                //As the pointer to the options would be broken
                $.each(contentList.results, function (index, content) {
                    scope.contentList.push(content);
                });
            });

            scope.$watch('model.selectedContentId', function (newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    contentService.getContent(newVal, null, function (content) {
                        pageService.updateCurrentPage(null);
                        //It's necessary to store each field to avoid
                        //breaking the pointer referenced by angular
                        updateData(scope.internalData, content);
                    });
                }
            });
        }

        function add(scope) {
            scope.internalData.displayAddedContent = true;
        }

        function onAddSave(scope, callback) {
            contentService.createContent(scope.content, function (newContent) {
                //1. Update the current selected ID
                scope.model.selectedContentId = newContent._id;
                //2. Display the newly added content
                //It's necessary to store each field to avoid breaking the pointer referenced by angular
                scope.internalData.title    = newContent.title;
                scope.internalData.summary  = newContent.summary;
                scope.internalData.content  = newContent.content;
                //3. Return control to the app
                callback();
            });
        }

        /** Private methods **/
        function loadContent(scope) {
            contentService.getContent(scope.model.selectedContentId, null, function (content) {
                updateData(scope.internalData, content);
            });
        }

        function updateData(internalData, content) {
            internalData.title     = content.title;
            internalData.summary   = content.summary;
            internalData.content   = content.content;
            internalData.avgRating = content.avgRating;
        }
        /** End of private methods **/

        return {
            view: view,
            edit: edit,
            onEditSave: onEditSave,
            add: add,
            onAddSave: onAddSave,
            selectContent: selectContent
        };
    }]);
})();
