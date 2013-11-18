COMPONENTS.directive('stats', ['$rootScope', 'statsService', 'roleService', 'constantsService',
function($rootScope, statsService, roleService, constantsService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'stats.html',
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
                    if(normalizeUserData.create) {
                        normalizedData.push({
                            label: (stat.create.author) ? stat.create.author.fullName : undefined,
                            value: stat.count
                        });
                    }
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

            statsService.loadStats(constantsService.collections.content, {}, function (stats) {
                normalizeTimeTmpDelete(stats);
                scope.newsPerDay = stats;
            });

            statsService.loadStats(constantsService.collections.users, {}, function (stats) {
                normalizeTimeTmpDelete(stats);
                scope.usersPerDay = stats;
            });

            filter = { groupBy : 'create.authorId'};
            statsService.loadStats(constantsService.collections.content, filter, function (stats) {
                scope.contentPerUser = normalizeUserData(stats);
            });

            filter = { groupBy : 'role'};
            statsService.loadStats(constantsService.collections.users, filter, function (stats) {
                scope.usersPerRole = normalizeUsersPerRoleData(stats);
            });

            filter = { groupBy : 'create.authorId'};
            statsService.loadStats(constantsService.collections.comments, filter, function (stats) {
                scope.commentsPerUser = normalizeUserData(stats);
            });
        }
    };
}]);