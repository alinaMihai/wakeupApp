(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('QuoteService', QuoteService);

    QuoteService.$inject = ['$q', '$http', 'logger'];

    /* @ngInject */
    function QuoteService($q, $http, logger) {
        this.createQuote = createQuote;
        this.getQuotes = getQuotes;
        this.getQuote = getQuote;
        this.deleteQuote = deleteQuote;
        this.updateQuote = updateQuote;

        ////////////////

        function createQuote(topicId, quoteObj) {
            var deferred = $q.defer();
            $http.post('/api/quotes/' + topicId,
                quoteObj).then(function(response) {

                deferred.resolve(response.data);
                logger.success("The quote was successfully created", response.data, "Success");
            }, function(response) {
                console.log("error", response);
            });
            return deferred.promise;
        }

        function getQuotes(topicId) {
            var deferred = $q.defer();
            $http.get('/api/quotes/' + topicId).then(function(response) {

                deferred.resolve(response.data);

            }, function(response) {
                console.log("error", response);
            });
            return deferred.promise;
        }

        function getQuote(quoteId) {
            var deferred = $q.defer();
            $http.get('/api/quotes/quote/' + quoteId).then(function(response) {

                deferred.resolve(response.data);

            }, function(response) {
                console.log("error", response);
            });
            return deferred.promise;
        }

        function deleteQuote(quote) {
            var deferred = $q.defer();
            $http.delete('/api/quotes/' + quote._id).then(function(response) {
                var quote = response.data;
                deferred.resolve();
                logger.success("Quote successfully deleted", quote, "Quote Deleted");
            });
            return deferred.promise;
        }

        function updateQuote(quoteObj) {
            var deferred = $q.defer();
            $http.put('/api/quotes/' + quoteObj._id,
                quoteObj).then(function(response) {

                deferred.resolve(response.data);
                logger.success("The quote was successfully updated", response.data, "Success");
            }, function(response) {
                console.log("error", response);
            });
            return deferred.promise;
        }
    }
})();