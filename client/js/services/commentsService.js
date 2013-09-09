(function () {
    'use strict';
    COMPONENTS.factory('commentsService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         *
         *
         * @param targetId
         * @param callback
         */
        function loadComments(targetId, callback) {
            var filter = {
                q       : { targetId : targetId },
                sort    : { field: 'create.date', order : '1' }
            };
            crudService.get(constantsService.collections.comments, null, filter, function (comments) {
                if(callback) { callback(comments); }
            });
        }

        /**
         *
         *
         * @param newCommentText
         * @param targetId
         * @param callback
         */
        function createComment(newCommentText, targetId, callback) {
            var data = { text : newCommentText, targetId : targetId };
            crudService.create(constantsService.collections.comments, data, function (newComment) {
                if(callback) { callback(newComment); }
            });
        }

        /**
         *
         *
         * @param commentId
         * @param data
         * @param callback
         */
        function updateComment(commentId, data, callback) {
            crudService.update(constantsService.collections.comments, commentId, data, function(updatedComment) {
                if(callback) { callback(updatedComment); }
            });
        }

        /**
         *
         *
         * @param commentId
         * @param callback
         */
        function deleteComment(commentId, callback) {
            crudService.delete(constantsService.collections.comments, commentId, function() {
                if(callback) { callback(); }
            });
        }

        return {
            loadComments : loadComments,
            createComment: createComment,
            updateComment: updateComment,
            deleteComment: deleteComment
        };
    }]);
})();
