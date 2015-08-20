(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('questionSetList', {
                    url: '/questionSetList',
                    templateUrl: 'app/questionSets/questionSetsList.html',
                    controller: 'QuestionSetsCtrl as questionSets'
                });
        });
})();