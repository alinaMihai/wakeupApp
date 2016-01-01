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
                        'question': ['$stateParams', 'cached', '$state',
                            function($stateParams, cached, $state) {
                                return cached.getQuestion($stateParams.questionId).then(function(question) {
                                    return question;
                                }, function(err) {
                                    if(typeof err==="string" && err.toLocaleLowerCase().replace(" ",'')==="notfound"){
                                        $state.go('pageNotFound');    
                                    }else{
                                        $state.go('login');
                                    }
                                });
                            }
                        ]
                    }
                });
        });
})();
