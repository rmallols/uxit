COMPONENTS.directive('staticContentAppView', function ($rootScope, crudService, constantsService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/staticContentApp/staticContentAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
		link: function link(scope) {

            function loadContent() {
                crudService.get(constantsService.collections.content, scope.model.selectedContentId, null, function (content) {
                    scope.internalData = content;
                });
            }

            scope.onContentUpdated = function () { //Save callback from content editable
                var options =                                            {
                    title    : scope.internalData.title,
                    summary  : scope.internalData.summary,
                    content  : scope.internalData.content
                };
                crudService.update(constantsService.collections.content, scope.model.selectedContentId, options);
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
        templateUrl: '/client/apps/staticContentApp/staticContentAppEdit.html',
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
        templateUrl: '/client/apps/staticContentApp/staticContentAppAdd.html',
        scope: {
            model : '=',
            internalData : '=',
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.internalData.displayAddedContent = true;
            scope.onLayerSave = function (callback) {
                console.log("NEW CONTENT!!!!!", scope, scope.content)
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

COMPONENTS.directive('staticContentAppSelectContent', function (pageService, crudService, constantsService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/client/apps/staticContentApp/staticContentAppSelectContent.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
        link: function link(scope) {

            scope.contentList = [];
            var params = { projection: {title: 1}};
            crudService.get(constantsService.collections.content, null, params, function (contentList) {
                //IMPORTANT!!! Avoid the temptation of doing scope.contentList = content.results
                //As the pointer to the options would be broken
                $.each(contentList.results, function (index, content) {
                    scope.contentList.push(content);
                });
            });

            scope.$watch('model.selectedContentId', function (newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    crudService.get(constantsService.collections.content, newVal, null, function (content) {
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