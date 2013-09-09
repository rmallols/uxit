(function ()  {
    'use strict';
    COMPONENTS.directive('comments', ['commentsService', 'sessionService', function (commentsService, sessionService) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                targetId        : '=',
                onAdd           : '=',
                allowRatings    : '=',
                parentComment   : '=',
                hideAdd         : '=',
                placeholder     : '@'
            },
            templateUrl: '/client/html/comments/comments.html',
            link: function link(scope) {

                scope.loggedUser = sessionService.isUserLogged();

                scope.$watch('targetId', function (newVal) {
                    if (newVal) {
                        commentsService.loadComments(scope.targetId, function(comments) {
                            scope.comments = comments.results;
                            if(scope.parentComment) {
                                //noinspection JSPrimitiveTypeWrapperUsage
                                scope.parentComment.comments = scope.comments;
                            }
                        });
                    }
                });

                scope.createComment = function () {
                    commentsService.createComment(scope.newCommentText, scope.targetId, function(newComment) {
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
            }
        };
    }]);
})();
