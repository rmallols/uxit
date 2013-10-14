COMPONENTS.directive('editUser', ['$routeParams', 'userService', 'mediaService', 'tagService', 'roleService', 'i18nService',
function ($routeParams, userService, mediaService, tagService, roleService, i18nService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editUser.html',
        scope: {
            user        : '=model',
            onLayer     : '='
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.roles         = roleService.getRoles();
            //Duplicate the array to avoid infecting the original languages object
            scope.languages = $.extend(true, [], i18nService.getLanguages());
            scope.languages.unshift({ code: '', text: i18nService('editUser.language.inheritBrowser')});
            scope.clickToChangePassword = true;
            scope.defaultAvatarUrl = mediaService.getDefaultAvatarUrl();
            if (scope.user) {
                if (!scope.user.media) {
                    scope.user.media = {};
                }
            }
            scope.onLayer.save = function (callback) {
                userService.updateUser(scope.user, function (result) {
                    callback(result);
                });
            };
        }
    };
}]);