(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('QuestionSetService', QuestionSetService);

    QuestionSetService.$inject = ['$http', '$q'];

    /* @ngInject */
    function QuestionSetService($http, $q) {
        this.getQuestionSets = getQuestionSets;

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
    }
})();;