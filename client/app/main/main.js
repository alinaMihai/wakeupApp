(function() {

    'use strict';

    angular.module('wakeupApp')
        .config(['$stateProvider',
            function($stateProvider) {
                $stateProvider
                    .state('main', {
                        url: '/',
                        templateUrl: 'app/main/main.html'
                    });
            }
        ]);

})();