(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('QuestionSetService', QuestionSetService);

    QuestionSetService.$inject = ['$http', '$q', 'logger'];

    /* @ngInject */
    function QuestionSetService($http, $q, logger) {
        this.getQuestionSets = getQuestionSets;
        this.addQuestionSet = addQuestionSet;
        this.deleteQuestionSet = deleteQuestionSet;
        this.editQuestionSet = editQuestionSet;
        this.isUpdated = false;
        ////////////////

        function getQuestionSets() {
            var deferred = $q.defer();
            $http.get('/api/questionSet').then(function(response) {
                var questionSets = response.data;
                if (questionSets.length > 0) {
                    deferred.resolve(questionSets);
                }
            });
            return deferred.promise;
        }


        function addQuestionSet(questionSetJson) {
            var deferred = $q.defer();
            $http.post('/api/questionSet/',
                questionSetJson).then(function(response) {

                deferred.resolve(response.data);
                logger.success("The question set was saved", response.data, "Success");
            }, function(response) {
                console.log("error", response);
            });
            return deferred.promise;
        }

        function deleteQuestionSet(questionSet) {
            var deferred = $q.defer();
            $http.delete('/api/questionSet/' + questionSet._id).then(function(response) {
                var questionSet = response.data;
                deferred.resolve();
                logger.success("QuestionSet successfully deleted", questionSet, "QuestionSet Deleted");
            });
            return deferred.promise;
        }

        function editQuestionSet(questionSet) {
            var deferred = $q.defer();
            var self = this;
            $http.put('/api/questionSet/' + questionSet._id, questionSet).then(function(response) {
                deferred.resolve();
                self.isUpdated = true;
                logger.success("QuestionSet successfully updated", response.data, "QuestionSet Updated");
            });
            return deferred.promise;
        }

    }


})();;
