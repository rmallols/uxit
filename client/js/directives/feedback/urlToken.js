COMPONENTS.directive('urlToken', ['i18nDbService', 'stringService', function (i18nDS, stringService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            input   : '=',
            output  : '='
        },
        template: '<label>{{output}}</label>',
		link: function link(scope) {
            scope.$watch('input', function(newVal) {
                var updatedInput, output;
                if(newVal !== undefined) {
                    updatedInput = (i18nDS.hasI18nStructure(newVal))
                                    ? i18nDS.getI18nProperty(newVal).text
                                    : newVal;
                    output = stringService.replaceToken(updatedInput, ' ', '-', false);
                    scope.output = stringService.toCamelCase(output);
                }
            }, true);
		}
	};
}]);
