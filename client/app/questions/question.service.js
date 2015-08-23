(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('QuestionService', QuestionService);

    QuestionService.$inject = ['$http', '$q', 'logger'];

    /* @ngInject */
    function QuestionService($http, $q, logger) {
        this.getQuestions = getQuestions;
        this.saveAnswer = saveAnswer;
        this.currentQuestionIndex;
        this.questionSetSession = false;

        ////////////////

        function getQuestions(questionSetId) {
            var deferred = $q.defer();
            $http.get('/api/questionSet/' + questionSetId).then(function(response) {
                var questionSet = response.data[0];


                deferred.resolve(questionSet);

            });
            return deferred.promise;
        }

        function saveAnswer(answerJson) {
            var deferred = $q.defer();
            $http.post('/api/answers/', answerJson).then(function(response) {
                    logger.success("Your answer was saved", response.answer, "Success");
                },
                function(response) {
                    //error handling
                    console.log("error", response);
                });
            return deferred.promise;
        }


    }
})();;