(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('questionList', {
                    url: '/questionList/{questionSetId}',
                    templateUrl: 'app/questions/question.html',
                    controller: 'QuestionCtrl as questionCtrl'
                });
        });
})();