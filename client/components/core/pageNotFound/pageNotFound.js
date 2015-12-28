(function() {

    'use strict';

    angular.module('wakeupApp')
        .config(['$stateProvider',
            function($stateProvider) {
                $stateProvider
                    .state('pageNotFound', {
                        url: '/pageNotFound',
                        templateUrl: 'components/core/pageNotFound/pageNotFound.html'
                    });
            }
        ]);

})();