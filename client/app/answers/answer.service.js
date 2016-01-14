(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('AnswerService', AnswerService);

    AnswerService.$inject = ['$http', '$q', 'logger','QuestionService'];

    /* @ngInject */
    function AnswerService($http, $q, logger,QuestionService) {
        this.getAnswers = getAnswers;
        this.deleteAnswer = deleteAnswer;
        this.editAnswer = editAnswer;
        this.deleteAllAnswers=deleteAllAnswers;
        this.isModalOpened=false;

        ////////////////

        function getAnswers(questionId) {
            var deferred = $q.defer();
            $http.get('/api/answers/' + questionId).success(function(response) {
                var answers = response;
                if (answers) {
                    deferred.resolve(answers);
                }
            }).error(function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function deleteAnswer(answer) {
            var deferred = $q.defer();
            $http.delete('/api/answers/' + answer._id).then(function(response) {
                var answer = response.data;
                deferred.resolve();
                QuestionService.isUpdated=true;
                logger.success("Answer successfully deleted", answer, "Answer Deleted");
            });
            return deferred.promise;
        }

        function editAnswer(answerObj) {
            var deferred = $q.defer();
            var self = this;
            $http.put('/api/answers/' + answerObj._id, answerObj).then(function(response) {
                deferred.resolve();
                logger.success("Answer successfully updated", response.data, "Answer Updated");
            });

            return deferred.promise;
        }
        function deleteAllAnswers(questionId) {
            var deferred = $q.defer();
            $http.delete('/api/answers/deleteAllAnswers/' + questionId)
                .success(function(response) {
                    deferred.resolve();
                    QuestionService.isUpdated=true;
                    logger.success("All Answers successfully deleted", response, "Answers Deleted");
                })
                .error(function(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    }


})();;
