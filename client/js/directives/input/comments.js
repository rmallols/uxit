(function ()  {
    'use strict';
    COMPONENTS.directive('comments', ['$rootScope', 'crudService', 'sessionService', 'mediaService', 'dateService',
                                      'i18nService', 'constantsService', 'stringService',
    function ($rootScope, crudService, sessionService, mediaService, dateService, i18nService, constantsService, stringService) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                targetId        : '=',
                onAdd           : '=',
                allowRatings    : '='
            },
            templateUrl: '/client/html/input/comments.html',
            link: function link(scope, element, attrs) {

                var firstLevelCommentsObj = $('.firstLevel', element);

                scope.$watch('targetId', function (newVal) {
                    if (newVal) {
                        var filter = {
                            q       : { targetId : scope.targetId },
                            sort    : { field: 'create.date', order : '-1' }
                        };
                        crudService.get(constantsService.collections.comments, null, filter, function (comments) {
                            scope.comments = comments.results;
                        });
                    }
                });

                scope.createComment = function () {
                    var data = { text : scope.newCommentText, targetId : scope.targetId };
                    crudService.create(constantsService.collections.comments, data, function (newComment) {
                        scope.newCommentText = ''; //Clean the comment field
                        sessionService.addSessionDataToModel(newComment); //Add media info to the newly created comment
                        scope.comments.push(newComment);
                        //Scroll to the bottom to ensure that the newly created comment is actually visible
                        firstLevelCommentsObj.animate({scrollTop: firstLevelCommentsObj.get(0).scrollHeight}, window.speed);
                        if (scope.onAdd) {
                            scope.onAdd();
                        }
                        //Add a fancy effect to show the newly created comment
                        //It's necessary to execute the animation in a new thread because otherwise
                        //Angular has not repainted the screen and the first element is pointing to
                        //an old comment instead of the newly created one
                        setTimeout(function () {
                            $('li:last', firstLevelCommentsObj).hide().show("clip", {}, 150);
                        }, 0);
                    });
                };

                scope.getDownloadUrl = function (media) {
                    return (media) ? mediaService.getDownloadUrl(media) : false;
                };

                scope.getFormattedDate = function (date) {
                    return dateService.getFormattedDate(date);
                };

                scope.showRatings = function () {
                    return (!stringService.isEmpty(scope.allowRatings))
                        ? scope.allowRatings
                        : $rootScope.portal.comments.allowRatings;
                };

                scope.getI18nPlaceholder = function () {
                    return i18nService(attrs.placeholder);
                };
            }
        };
    }]);
})();
