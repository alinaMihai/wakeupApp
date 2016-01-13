(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('sessionDetails', {
                    url: '/sessionDetails/{questionSetId}/{questionSetName}',
                    templateUrl: 'app/questions/sessionDetails/sessionDetails.html',
                    controller: 'SessionDetailsCtrl as SessionDetailsCtrl'
                });
        });
})();