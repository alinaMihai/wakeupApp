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
        this.currentQuestionIndex;
        this.repeatQS;
        this.questionSetSession = false;
        this.addQuestion = addQuestion;
        this.deleteQuestion = deleteQuestion;
        this.editQuestion = editQuestion;
        this.registerSession = registerSession;
        this.endSessionOnBackBtn = false;
        this.isUpdated = false;

        ////////////////

        function getQuestions(questionSetId) {
            var deferred = $q.defer();
            $http.get('/api/questionSet/' + questionSetId).then(function(response) {
                var questionSet = response.data[0];
                deferred.resolve(questionSet);
            });
            return deferred.promise;
        }

        function getQuestionById(questionId) {
            var deferred = $q.defer();
            $http.get('/api/questions/question/' + questionId).success(function(response) {
                var question = response[0];
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
                },
                function(response) {
                    //error handling
                    console.log("error", response);
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
                console.log("error", response);
            });
            return deferred.promise;
        }


        function deleteQuestion(question) {
            var deferred = $q.defer();
            $http.delete('/api/questions/' + question._id).then(function(response) {
                var question = response.data;
                deferred.resolve();
                logger.success("Question successfully deleted", question, "Question Deleted");
            });
            return deferred.promise;
        }

        function editQuestion(questionObj) {
            var deferred = $q.defer();
            var self = this;
            $http.put('/api/questions/' + questionObj._id, questionObj).then(function(response) {
                deferred.resolve();
                self.isUpdated = true;
                logger.success("Question successfully updated", response.data, "Question Updated");
            });

            return deferred.promise;
        }

        function registerSession(questionSetId) {
            var deferred = $q.defer();
            var self = this;
            $http.put('/api/questionSet/session/' + questionSetId).then(function(response) {
                deferred.resolve(response.data);
                //console.log("QuestionSet Session Registered", response.data, "QuestionSet Session");
            });
            return deferred.promise;
        }

    }
})();;