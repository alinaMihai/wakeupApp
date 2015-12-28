(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('practiceSession', {
                    url: '/practiceSession/{questionSetId}',
                    templateUrl: 'app/sessionPractice/sessionPractice.html',
                    controller: 'SessionController as vm'
                });
        });
})();
