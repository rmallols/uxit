(function() {
    COMPONENTS.directive('fileUploader', ['$rootScope', 'stdService', function ($rootScope, stdService) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'fileUploader.html',
            scope: {
                model           : '=ngModel',
                endpoint        : '@',
                onUpload        : '=',
                defaultMediaUrl : '=',
                multiple        : '@',
                preview         : '@'
            },
            link: function link(scope, element) {

                scope.selectFile = function () {
                    $('input[type="file"]', element).click();
                };

                scope.submit = function () {
                    //Submit in progress...
                    element.ajaxSubmit({
                        error: function (xhr) {
                            stdService.error('Error uploading file', xhr);
                        },
                        success: function (uploadedFile) {
                            success(uploadedFile);
                        }
                    });
                    //It's necessary to return false in order to avoid page refresh
                    return false;
                };

                /** Private methods **/
                function success(file) {
                    if (scope.model) {
                        scope.model = file[0];
                    }
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                    if (scope.onUpload) {
                        scope.onUpload(file);
                    }
                }
                /** End of private methods **/
            }
        };
    }]);
})();
