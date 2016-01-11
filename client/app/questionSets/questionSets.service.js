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
            },function(err){
                deferred.reject(err);
                logger.error("Could not retrieve question sets",err,"Error");
            });
            return deferred.promise;
        }


        function addQuestionSet(questionSetJson) {
            var deferred = $q.defer();
            $http.post('/api/questionSet/',
                questionSetJson).then(function(response) {

                deferred.resolve(response.data);
                logger.success("The question set was saved", response.data, "Success");
            }, function(err) {
                var message="Could not create the question set";
                deferred.reject(err);
                if(err.data.code===11000){
                    message="Duplicate question set name. You already have a question set with this name";
                }
                logger.error(message,err,"Error");
                /*console.log("error", response);*/
            });
            return deferred.promise;
        }

        function deleteQuestionSet(questionSet) {
            var deferred = $q.defer();
            $http.delete('/api/questionSet/' + questionSet._id).then(function(response) {
                var questionSet = response.data;
                deferred.resolve();
                logger.success("QuestionSet successfully deleted", questionSet, "QuestionSet Deleted");
            },function(err){
                deferred.reject(err);
                logger.error("Could not delete question set",err,"Error");
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
            },function(err){
                deferred.reject(err);
                logger.error("Could not update question set",err,"Error");
            });
            return deferred.promise;
        }

    }


})();;
