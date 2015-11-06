(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('answerList', {
                    url: '/answerList/{questionId}',
                    templateUrl: 'app/answers/answers.html',
                    controller: 'AnswerCtrl as answerCtrl',
                    resolve: {
                        'question': ['$stateParams', 'QuestionService',
                            function($stateParams, QuestionService) {
                                return QuestionService.getQuestionById($stateParams.questionId).then(function(question) {
                                    return question;
                                });
                            }
                        ]
                    }
                });
        });
})();