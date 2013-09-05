COMPONENTS.directive('autoComplete', ['$rootScope', 'tagService', 'constantsService', 'i18nService', 'i18nDbService',
function ($rootScope, tagService, constantsService, i18nService, i18nDbService) {
    'use strict';
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="autoCompleteContainer"><input type="hidden" /></div>',
        require: '?ngModel',
        scope: {
            model       : '=ngModel',
            options     : '=ngOptions',
            multiple    : '@',
            placeholder : '@',
            labelKey    : '@',
            valueKey    : '@',
            onChange    : '=uxChange'
        },
        link: function link(scope, element, attrs, ctrl) {

            var autoCompleteObj = $(' > input[type="hidden"]', element);
            if (!attrs.valueKey) { attrs.valueKey = '_id'; }  //By default, use the _id tag as the export value

            autoCompleteObj.on("change", function (e) {
                if (e.added && e.added.newItem) {
                    delete e.added.newItem;
                    //Save the newly added element
                    tagService.createTag(e.added.text, function (newTag) {
                        e.val[e.val.length - 1] = newTag[attrs.valueKey];
                        updateModel(e.val);
                    });
                } else {
                    updateModel((e.val.length > 0) ? e.val : undefined);
                }
                if (scope.onChange) { scope.onChange(); }
            });

            scope.$watch('options', function (newVal) {
                if (scope.model) {
                    ctrl.$setViewValue(scope.model);
                }
                if (newVal && newVal.length > 0) {
                    var setup = {
                        data: {
                            results: scope.options,
                            text: function (item) {
                                var labelKey = i18nDbService.getI18nProperty(item[attrs.labelKey]).text;
                                return labelKey || '';
                            }
                        },
                        multiple: attrs.multiple === 'true',
                        placeholder: i18nService(attrs.placeholder),
                        minimumInputLength: 0,
                        id: function (item) {
                            return item[attrs.valueKey];
                        },
                        createSearchChoice: function (term, data) {
                            if ($(data).filter(function () {
                                var labelKey = i18nDbService.getI18nProperty(this[attrs.labelKey]).text;
                                return parseInt(labelKey.localeCompare(term), 10) === 0;
                            }).length === 0) {
                                var choiceObj = {};
                                choiceObj.newItem = true;
                                choiceObj[attrs.valueKey] = term;   //Reserved attribute
                                choiceObj[attrs.labelKey] = term;
                                return choiceObj;
                            }
                            return null;
                        },
                        initSelection: function (element, callback) {
                            var data = [], ids = element.val().split(","), id;
                            $(ids).each(function () {
                                id = this;
                                $(scope.options).each(function () {
                                    if (parseInt(id.localeCompare("" + this[attrs.valueKey]), 10) === 0) {
                                        if (attrs.multiple === 'true') {

                                            data.push(this);
                                        } else {
                                            data = this;
                                        }
                                    }
                                });
                            });
                            callback(data);
                        },
                        formatResult: function (item) {
                            var labelKey = i18nDbService.getI18nProperty(item[attrs.labelKey]).text,
                                htmlMarkup = '<label>' + labelKey + '</label>';
                            if (item.newItem) {
                                htmlMarkup += ' <i>(New item)</i>';
                            }
                            return htmlMarkup;
                        },
                        formatSelection: function (item) {
                            return i18nDbService.getI18nProperty(item[attrs.labelKey]).text;
                        }
                    };
                    autoCompleteObj.select2(setup).select2("val", scope.model); //It's necessary to provide a default value
                }
            }, true /*Compare object for equality rather than for reference*/);

            function updateModel(newVal) {
                scope.model = newVal;
                ctrl.$setViewValue(scope.model);
                if (!$rootScope.$$phase) {
                    scope.$apply();
                }
            }
        }
    };
}]);

