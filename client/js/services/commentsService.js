(function () {
    'use strict';
    COMPONENTS.factory('commentsService', ['crudService', function (crudService) {

        /**
         *
         *
         * @param targetId
         * @param callback
         */
        function loadComments(targetId, callback) {
            var filter = {
                q       : { targetId : targetId },
                sort    : { field: 'create.date', order : '-1' }
            };
            crudService.get(constantsService.collections.comments, null, filter, function (comments) {
                if(callback) { callback(comments); }
            });
        }

        function createComment(newCommentText, targetId, callback) {
            var data = { text : newCommentText, targetId : targetId };
            crudService.create(constantsService.collections.comments, data, function (newComment) {
                if(callback) { callback(newComment); }
            });
        }

        return {
            loadComments : loadComments,
            createComment: createComment
        };
    }]);
})();
