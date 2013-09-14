(function ()  {
    'use strict';
    COMPONENTS.directive('comment', ['$compile', 'portalService', 'dateService', 'objectService', 'mediaService',
                                    'commentsService', 'constantsService', 'tooltipService', 'sessionService',
    function ($compile, portalService, dateService, objectService, mediaService, commentsService, constantsService,
              tooltipService, sessionService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                comment: '='
            },
            templateUrl: '/client/html/comments/comment.html',
            link: function link(scope, element) {

                var repliesHtml =   '<comments target-id="comment._id" parent-comment="comment" hide-add="hideAdd" ' +
                                    'placeholder="comments.addReply.placeholder"></comments>';

                $('.repliesWrapper', element).replaceWith($compile(repliesHtml)(scope));

                scope.hideAdd = true;
                scope.comment.isEditable = false;
                scope.isLoggedUser = sessionService.isUserLogged();
                scope.isSelfActionAllowed = isSelfActionAllowed();
                scope.getDownloadUrl = function (media) {
                    return (media) ? mediaService.getDownloadUrl(media) : false;
                };

                scope.getFormattedDate = function () {
                    return dateService.getFormattedDate(scope.comment.create.date);
                };

                scope.showRatings = function () {
                    return (!objectService.isEmpty(scope.allowRatings))
                        ? scope.allowRatings
                        : portalService.getPortal().comments.allowRatings;
                };

                scope.toggleReply = function() {
                    scope.hideAdd = scope.hideAdd !== true;
                };

                scope.toggleEdit = function() {
                    scope.comment.isEditable = scope.comment.isEditable !== true;
                };

                scope.updateComment = function() {
                    commentsService.updateComment(scope.comment._id, { text: scope.comment.text});
                };

                scope.deleteComment = function() {
                    deleteCommentRecursively(scope.comment);
                    tooltipService.hide();
                };

                /** Private methods **/
                function deleteComment(comment) {
                    commentsService.deleteComment(comment._id, function() {
                        comment.deleted = true;
                    });
                }

                function deleteCommentRecursively(comment) {
                    if(comment.comments && comment.comments.length) {
                        comment.comments.forEach(function(comment) {
                            deleteCommentRecursively(comment);
                        });
                    }
                    deleteComment(comment);
                }

                function isSelfActionAllowed() {
                    return scope.isLoggedUser && scope.comment.create.author._id === sessionService.getUserSession()._id;
                }
                /** End of private methods **/
            }
        };
    }]);
})();