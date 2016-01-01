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
        this.getQuestionById = getQuestionById;
        this.addQuestion = addQuestion;
        this.deleteQuestion = deleteQuestion;
        this.editQuestion = editQuestion;
        this.registerSession = registerSession;
        this.isUpdated = false;

        ////////////////

        function getQuestions(questionSetId) {
            var deferred = $q.defer();
            $http.get('/api/questionSet/' + questionSetId)
                .success(function(questionSet) {

                    deferred.resolve(questionSet);
                })
                .error(function(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getQuestionById(questionId) {
            var deferred = $q.defer();
            $http.get('/api/questions/question/' + questionId)
                .success(function(question) {

                    deferred.resolve(question);
                }).error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function saveAnswer(answerJson) {
            var deferred = $q.defer();
            $http.post('/api/answers/', answerJson).then(function(response) {
                    logger.success("Your answer was saved", response.data, "Success");
                    deferred.resolve(response.data);
                },
                function(response) {
                    //error handling
                    logger.log("error", response);
                    logger.error("The answer couldn't be saved", response.data, "Error");
                });
            return deferred.promise;
        }

        function addQuestion(questionJson) {
            var deferred = $q.defer();
            $http.post('/api/questions/',
                questionJson).then(function(response) {

                deferred.resolve(response.data);
                logger.success("The question was saved", response.data, "Success");
            }, function(response) {
                logger.error("The question could not be saved", response.data, "Error");
                logger.log("error", response);
            });
            return deferred.promise;
        }


        function deleteQuestion(question) {
            var deferred = $q.defer();
            $http.delete('/api/questions/' + question._id)
                .success(function(response) {
                    deferred.resolve();
                    logger.success("Question successfully deleted", response, "Question Deleted");
                })
                .error(function(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function editQuestion(questionObj) {
            var deferred = $q.defer();
            var self = this;
            $http.put('/api/questions/' + questionObj._id, questionObj)
                .success(function(response) {
                    deferred.resolve(response);
                    self.isUpdated = true;
                    logger.success("Question successfully updated", response, "Question Updated");
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function registerSession(questionSetId) {
            var deferred = $q.defer();
            var self = this;
            $http.put('/api/questionSet/session/' + questionSetId)
                .success(function(response) {
                    deferred.resolve(response);
                    //console.log("QuestionSet Session Registered", response.data, "QuestionSet Session");
                })
                .error(function(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

    }
})();;