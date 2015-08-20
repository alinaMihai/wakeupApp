(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('answerList', {
                    url: '/answerList/{questionId}',
                    templateUrl: 'app/answers/answer.html',
                    controller: 'AnswerCtrl as answerCtrl'
                });
        });
})();