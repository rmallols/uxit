(function () {
    'use strict';
    function createUser(mediaService, roleService, tagService, i18nService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'editUser.html',
            scope : {
                user : '=',
                onLayer : '='
            },
            link: function link(scope) {
                scope.availableTags     = tagService.getTags();
                scope.roles             = roleService.getRoles();
                scope.languages         = i18nService.getLanguages();
                scope.defaultAvatarUrl  = mediaService.getDefaultAvatarUrl();
                //Duplicate the array to avoid infecting the original languages object
                scope.languages = $.extend(true, [], i18nService.getLanguages());
                scope.languages.unshift({ code: '', text: i18nService('editUser.language.inheritBrowser')});
                initUserData();

                /** Private methods **/
                function initUserData() {
                    scope.user.role = 1;
                    scope.user.language = scope.languages[0].code;
                    scope.user.role = {};
                }
                /** End of private methods **/
            }
        };
    }
    var createUserArgs = ['mediaService', 'roleService', 'tagService', 'i18nService', createUser];
    COMPONENTS.directive('createUser', createUserArgs);
    COMPONENTS.directive('createUsers', createUserArgs);
})();