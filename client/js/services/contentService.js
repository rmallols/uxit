(function () {
    'use strict';
    COMPONENTS.factory('contentService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         * Creates a new content article
         *
         * @param {object}      content     The elements that define the content
         * @param {function}    callback    The function that will be executed once the content has been created
         */
        function createContent(content, callback) {
            var data;
            if (content && (content.title || content.summary || content.content)) {
                data = {
                    title   : content.title,
                    summary : content.summary,
                    content : content.content,
                    tags    : content.tags
                };
                crudService.create(constantsService.collections.content, data, function (newContent) {
                    if (callback) {
                        callback(newContent);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         * Updates an existing content article
         *
         * @param {object}      content     The elements that define the content
         * @param {function}    callback    The function that will be executed once the content has been updated
         */
        function updateContent(content, callback) {
            var data;
            if (content && (content.title || content.summary || content.content)) {
                data = {
                    title   : content.title,
                    summary : content.summary,
                    content : content.content,
                    tags    : content.tags
                };
                crudService.update(constantsService.collections.content, content._id, data, function (updatedContent) {
                    if (callback) {
                        callback(updatedContent);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        return {
            createContent: createContent,
            updateContent: updateContent
        };
    }]);
})();
