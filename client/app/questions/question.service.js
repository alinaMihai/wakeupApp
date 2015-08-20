(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('QuestionService', QuestionService);

    QuestionService.$inject = ['$http', '$q'];

    /* @ngInject */
    function QuestionService($http, $q) {
        this.getQuestions = getQuestions;
        this.currentQuestionIndex;

        ////////////////

        function getQuestions(questionSetId) {
            var deferred = $q.defer();
            $http.get('/api/questionSet/' + questionSetId).then(function(response) {
                var questionSet = response.data[0];

                if (questionSet.questions.length > 0) {
                    deferred.resolve(questionSet);
                }
            });
            return deferred.promise;
        }


    }
})();;