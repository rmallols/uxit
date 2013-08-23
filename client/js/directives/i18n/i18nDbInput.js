(function () {
    'use strict';
    COMPONENTS.directive('i18nDbInput', ['$rootScope', '$compile', 'i18nService', 'i18nDbService', 'stringService', 'objectService',
    function ($rootScope, $compile, i18nService, i18nDbService, stringService, objectService) {
        var i18nPreffix = '_i18n_';
        return {
            priority: 1000,
            restrict: 'A',
            replace: true,
            transclude: 'element',
            controller: ['$scope', '$element', '$attrs', '$transclude', '$compile',
                function ($scope, $element, $attrs, $transclude, $compile) {
                    this.i18nNgModel = stringService.replaceToken(i18nPreffix + $attrs.ngModel, '\\.', '_');
                    $element.removeAttr('i18n-db-input');
                    $element.attr('ng-model', this.i18nNgModel + '.text');
                    $compile($element)($scope);
                }],
            template: '<input />',
            link: function (scope, element, attrs, controller) {

                var hasI18nStructure, isDisabled, originalModelLeafPointer,
                    defaultLanguage = i18nService.getDefaultLanguage(), ngModelLevels = attrs.ngModel.split('.'),
                    originalModelParentLeafPointer, leafProp, currentLanguage, creatingFromCustomLanguage;

                //Bind with the click function in a new thread as otherwise some components
                //could not have been initialized yet
                setTimeout(function() {
                    element.click(function () {
                        currentLanguage = i18nService.getCurrentLanguage();
                        if (isDisabled) {
                            isDisabled = false;
                            $(this).removeAttr('readonly');
                            originalModelLeafPointer[currentLanguage] = {};
                            originalModelLeafPointer[currentLanguage].text = originalModelLeafPointer[defaultLanguage].text;
                            scope[controller.i18nNgModel] = originalModelLeafPointer[currentLanguage];
                            scope.$apply();
                        }
                    });
                });

                scope.$watch(attrs.ngModel, function (newVal) {
                    updateModel(newVal);
                });

                $rootScope.$on('languageChanged', function (e, newLanguage) {
                    currentLanguage = newLanguage;
                    updateNgModel(scope.$eval(attrs.ngModel));
                });

                function updateModel(newVal) {
                    currentLanguage     = i18nService.getCurrentLanguage();
                    hasI18nStructure    = i18nDbService.hasI18nStructure(newVal);
                    setOriginalModelPointers(newVal, hasI18nStructure);
                    if (!hasI18nStructure) {
                        initI18nStructure(newVal);
                    }
                    updateNgModel(newVal);
                    hasI18nStructure = true;
                }

                function updateNgModel(newVal) {
                    if ((currentLanguage === defaultLanguage) || creatingFromCustomLanguage) {
                        updateEditableNgModel(defaultLanguage);
                    } else if (i18nDbService.hasI18nStructure(newVal)) {
                        updateEditableNgModel(currentLanguage);
                    } else {
                        updateReadonlyNgModel();
                    }
                }

                function updateEditableNgModel(language) {
                    scope[controller.i18nNgModel] = originalModelLeafPointer[language];
                    isDisabled = false;
                    element.removeAttr('readonly');
                }

                function updateReadonlyNgModel() {
                    scope[controller.i18nNgModel] = originalModelLeafPointer[defaultLanguage];
                    isDisabled = true;
                    element.attr('readonly', 'readonly');
                }

                function initLeafStructure() {
                    originalModelParentLeafPointer[leafProp] = {};
                    originalModelParentLeafPointer[leafProp][defaultLanguage] = {};
                    originalModelLeafPointer = originalModelParentLeafPointer[leafProp];
                }

                function initDefaultLanguageStructure(newVal) {
                    originalModelLeafPointer[defaultLanguage] = {};
                    originalModelLeafPointer[defaultLanguage].text = newVal;
                }

                function initI18nStructure(newVal) {
                    //If the leaf object was a primitive one (i.e. a string), we should get its parent object
                    //and initialize a new object in order to keep the double binding
                    if (!objectService.isObject(newVal)) {
                        initLeafStructure();
                        initDefaultLanguageStructure(newVal);
                        if (currentLanguage !== defaultLanguage) {
                            creatingFromCustomLanguage = true;
                        }
                    } else {
                        creatingFromCustomLanguage = false;
                    }
                }

                function setOriginalModelPointers(newVal, hasI18nStructure) {
                    if (!hasI18nStructure) { //Create the pointer to the leaf objects
                        setOriginalModelInitPointers();
                    } else {  //The pointers are already created, so we just need to point to the leafs
                        setOriginalModelModifiedPointers(newVal);
                    }
                }

                function setOriginalModelInitPointers() {
                    if (!scope[ngModelLevels[0]]) { scope[ngModelLevels[0]] = {}; }
                    scope[i18nPreffix + ngModelLevels[0]] = {};
                    originalModelLeafPointer = scope[ngModelLevels[0]];
                    for (var i = 1; i < ngModelLevels.length; i += 1) {
                        if (!originalModelLeafPointer[ngModelLevels[i]]) {
                            originalModelLeafPointer[ngModelLevels[i]] = {};
                        }
                        originalModelParentLeafPointer = originalModelLeafPointer;
                        originalModelLeafPointer = originalModelLeafPointer[ngModelLevels[i]];
                        if (i === ngModelLevels.length - 1) { leafProp = ngModelLevels[i]; }
                    }
                }

                function setOriginalModelModifiedPointers(newVal) {
                    originalModelLeafPointer = newVal;
                }
            }
        };
    }]);
})();