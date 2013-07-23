COMPONENTS.directive('listEdit', ['rowService', 'tagService', function (rowService, tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/html/utils/listEdit.html',
        link: function link(scope) {

            scope.availableTags = tagService.getTags();

            scope.sortTypes = {
                field : [
                    { id: 'create.date',     text: 'Create date' },
                    { id: 'update.date',     text: 'Update date' },
                    { id: 'create.author',   text: 'Create author' },
                    { id: 'update.author',   text: 'Update author' }
                ],
                order : [
                    { id: '1',  text: 'Asc' },
                    { id: '-1', text: 'Desc' }
                ]
            };

            if (!scope.model.sort) {
                scope.model.sort = {
                    field: scope.sortTypes.field[0].id,
                    order: scope.sortTypes.order[1].id
                };
            }

            scope.columnOptions = [];
            //noinspection JSHint
            for (var index = 0; index < rowService.getMaxSlots(); index += 1) {
                scope.columnOptions.push({value: index + 1, text: index + 1});
            }
            if (!scope.model.columns) {
                scope.model.columns = 1;
            }
        }
    };
}]);