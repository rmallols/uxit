(function ()  {
    'use strict';
    COMPONENTS.directive('comment', ['$compile', 'portalService', 'dateService', 'stringService', 'mediaService',
                                    'crudService', 'constantsService',
    function ($compile, portalService, dateService, stringService, mediaService, crudService, constantsService) {
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
                scope.getDownloadUrl = function (media) {
                    return (media) ? mediaService.getDownloadUrl(media) : false;
                };

                scope.getFormattedDate = function (date) {
                    return dateService.getFormattedDate(date);
                };

                scope.showRatings = function () {
                    return (!stringService.isEmpty(scope.allowRatings))
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
                    crudService.update(constantsService.collections.comments, scope.comment._id, { text: scope.comment.text});
                };

                scope.deleteComment = function() {
                    deleteCommentRecursively(scope.comment);
                };

                /** Private methods **/
                function deleteComment(comment) {
                    crudService.delete(constantsService.collections.comments, comment._id, function() {
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
                /** End of private methods **/
            }
        };
    }]);
})();