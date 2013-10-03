COMPONENTS.directive('staticContentAppView', function ($rootScope, contentService, constantsService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'staticContentAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave : '='
        },
		link: function link(scope) {

            function loadContent() {
                contentService.getContent(scope.model.selectedContentId, null, function (content) {
                    scope.internalData = content;
                });
            }

            scope.onContentUpdated = function () { //Save callback from content editable
                contentService.updateContent(scope.internalData, null);
            };

            loadContent();
            $rootScope.$on(constantsService.collections.content + 'Changed', function (e, updatedContentId) {
                //Refresh the content just if the updated content is the current one
                if (scope.internalData._id === updatedContentId) {
                    loadContent();
                }
            });
		}
	};
});

COMPONENTS.directive('staticContentAppEdit', function (pageService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'staticContentAppEdit.html',
        scope: {
            model : '=',
            internalData : '=',
            onLayerSave : '='
        },
        link: function link(scope) {
            var originalShowTitles = scope.model.showTitles;
            scope.onLayerSave = function (callback) {
                if (scope.model.showTitles !== originalShowTitles) {
                    pageService.updateCurrentPage(null);
                }
                callback();
            };
        }
    };
});

COMPONENTS.directive('staticContentAppAdd', function (contentService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'staticContentAppAdd.html',
        scope: {
            model : '=',
            internalData : '=',
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.internalData.displayAddedContent = true;
            scope.onLayerSave = function (callback) {
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
            };
        }
    };
});

COMPONENTS.directive('staticContentAppSelectContent', function (pageService, contentService, constantsService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'staticContentAppSelectContent.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave : '='
        },
        link: function link(scope) {

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
                        //It's necessary to store each field to avoid breaking the pointer referenced by angular
                        scope.internalData.title     = content.title;
                        scope.internalData.summary   = content.summary;
                        scope.internalData.content   = content.content;
                        scope.internalData.avgRating = content.avgRating;
                    });
                }
            });
        }
    };
});