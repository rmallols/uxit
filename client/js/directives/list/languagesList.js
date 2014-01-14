COMPONENTS.directive('languagesList', ['$rootScope', 'i18nService', 'constantsService',
function ($rootScope, i18nService, constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'languagesList.html',
        scope : {},
		link: function link(scope) {
            getLanguagesList();
            scope.collection = constantsService.collections.languages;
            scope.onEditPanels = [{ title: 'Edit language', src: 'editLanguage' }];
            scope.template = getTemplate();
            scope.config = {
                creatable   : false,
                editable    : true,
                deletable   : false
            };

            /** Private methods**/
            function getLanguagesList() {
                scope.languagesList = i18nService.getLanguages(true);
            }

            function getTemplate() {
                return  '<div ng-class="{ disabled: item.inactive }">' +
                            '<div class="avatar columns large-2">' +
                                '<img ng-src="/client/images/flags/{{item.code}}.svg" />' +
                            '</div>' +
                            '<div class="columns large-23">' +
                                '<h3><a href="#" edit-target>{{item.text}}</a></h3>' +
                            '</div>' +
                        '</div>';
            }
            /** End of private methods**/
		}
	};
}]);
