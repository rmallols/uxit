(function () {
    'use strict';
    angular.module('mocks.$timeout', ['ng']).config(function($provide) {
        $provide.decorator('$timeout', function($delegate, $browser) {
            $delegate.flush = function(delay) {
                $browser.defer.flush(delay);
            };
            return $delegate;
        });
    });
})();
