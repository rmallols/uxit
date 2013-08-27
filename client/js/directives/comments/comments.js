(function ()  {
    'use strict';
    COMPONENTS.directive('comments', ['crudService', 'sessionService', 'i18nService', 'constantsService',
    function ( crudService, sessionService, i18nService, constantsService) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                targetId        : '=',
                onAdd           : '=',
                allowRatings    : '=',
                parentComment   : '=',
                hideAdd         : '='
            },
            templateUrl: '/client/html/comments/comments.html',
            link: function link(scope, element, attrs) {

                scope.$watch('targetId', function (newVal) {
                    if (newVal) {
                        var filter = {
                            q       : { targetId : scope.targetId },
                            sort    : { field: 'create.date', order : '-1' }
                        };
                        crudService.get(constantsService.collections.comments, null, filter, function (comments) {
                            scope.comments = comments.results;
                            if(scope.parentComment) {
                                scope.parentComment.comments = scope.comments;
                            }
                        });
                    }
                });

                scope.createComment = function () {
                    var data = { text : scope.newCommentText, targetId : scope.targetId };
                    crudService.create(constantsService.collections.comments, data, function (newComment) {
                        scope.newCommentText = ''; //Clean the comment field
                        sessionService.addSessionDataToModel(newComment); //Add media info to the newly created comment
                        scope.comments.push(newComment);
                        if(scope.hideAdd !== undefined) {
                            scope.hideAdd = true;
                        }
                        if (scope.onAdd) {
                            scope.onAdd();
                        }
                    });
                };

                scope.getI18nPlaceholder = function () {
                    return i18nService(attrs.placeholder);
                };
            }
        };
    }]);
})();
