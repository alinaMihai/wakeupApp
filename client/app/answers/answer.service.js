(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('AnswerService', AnswerService);

    AnswerService.$inject = ['$http', '$q'];

    /* @ngInject */
    function AnswerService($http, $q) {
        this.getAnswers = getAnswers;

        ////////////////

        function getAnswers(questionId) {
            var deferred = $q.defer();
            $http.get('/api/questions/answers/' + questionId).then(function(response) {
                var question = response.data[0];


                deferred.resolve(question);

            });
            return deferred.promise;
        }
    }


})();;