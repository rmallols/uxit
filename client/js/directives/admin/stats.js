COMPONENTS.directive('stats', ['$rootScope', 'crudService', 'roleService', 'constantsService',
function($rootScope, crudService, roleService, constantsService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/html/admin/stats.html',
        scope: {},
        link: function link(scope) {

            var filter;

            function normalizeTimeTmpDelete(stats) {
                stats.forEach(function (stat) {
                    if (!stat['create.date']) { stat['create.date'] = '2013-04-01T22:00:00.000Z'; }
                });
            }

            function normalizeUserData(stats) {
                var normalizedData = [];
                stats.forEach(function (stat) {
                    normalizedData.push({
                        label: (stat.create.author) ? stat.create.author.fullName : undefined,
                        value: stat.count
                    });
                });
                return normalizedData;
            }

            function normalizeUsersPerRoleData(stats) {
                var roleObj, normalizedData = [];
                stats.forEach(function (stat) {
                    roleObj = roleService.getRole(stat.role);
                    normalizedData.push({
                        label : (roleObj) ? roleObj.title : 'undefined',
                        value: stat.count
                    });
                });
                return normalizedData;
            }

            crudService.getStats(constantsService.collections.content, {}, function (stats) {
                normalizeTimeTmpDelete(stats);
                scope.newsPerDay = stats;
            });

            crudService.getStats(constantsService.collections.users, {}, function (stats) {
                normalizeTimeTmpDelete(stats);
                scope.usersPerDay = stats;
            });

            filter = { groupBy : 'create.authorId'};
            crudService.getStats(constantsService.collections.content, filter, function (stats) {
                scope.contentPerUser = normalizeUserData(stats);
            });

            filter = { groupBy : 'role'};
            crudService.getStats(constantsService.collections.users, filter, function (stats) {
                scope.usersPerRole = normalizeUsersPerRoleData(stats);
            });

            filter = { groupBy : 'create.authorId'};
            crudService.getStats(constantsService.collections.comments, filter, function (stats) {
                scope.commentsPerUser = normalizeUserData(stats);
            });
        }
    };
}]);