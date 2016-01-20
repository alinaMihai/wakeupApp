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
        this.getSuggestions = getSuggestions;
        this.getAllQuestions = getAllQuestions;
        this.addComment = addComment;
        this.getComments = getComments;
        this.deleteComment = deleteComment;
        this.importQuotes = importQuotes;

        ////////////////

        function createQuote(topicId, quoteObj) {
            var deferred = $q.defer();
            $http.post('/api/quotes/' + topicId,
                quoteObj).then(function(response) {
                deferred.resolve(response.data);
                logger.success("The quote was successfully created", response.data, "Success");
            }, function(err) {
                deferred.reject(err);
                logger.error("Could not create quote", err, "Error");
            });
            return deferred.promise;
        }

        function getQuotes(topicId) {
            var deferred = $q.defer();
            $http.get('/api/quotes/' + topicId).then(function(response) {
                deferred.resolve(response.data);
            }, function(err) {
                deferred.reject(err);
                logger.error("Could not get quotes", err, "Error");
            });
            return deferred.promise;
        }

        function getQuote(quoteId) {
            var deferred = $q.defer();
            $http.get('/api/quotes/quote/' + quoteId).then(function(response) {
                deferred.resolve(response.data);
            }, function(err) {
                deferred.reject(err);
                logger.error("Could not get quote", err, "Error");
            });
            return deferred.promise;
        }

        function deleteQuote(quote) {
            var deferred = $q.defer();
            $http.delete('/api/quotes/' + quote._id).then(function(response) {
                var quote = response.data;
                deferred.resolve();
                logger.success("Quote successfully deleted", quote, "Quote Deleted");
            }, function(err) {
                deferred.reject(err);
                logger.error("Quote could not be deleted", err, "Error");
            });
            return deferred.promise;
        }

        function updateQuote(quoteObj) {
            var deferred = $q.defer();
            $http.put('/api/quotes/' + quoteObj._id,
                quoteObj).then(function(response) {
                deferred.resolve(response.data);
                logger.success("The quote was successfully updated", response.data, "Success");
            }, function(err) {
                deferred.reject(err);
                logger.error("Quote could not be updated", err, "Error");
            });
            return deferred.promise;
        }

        function getSuggestions() {
            var deferred = $q.defer();
            $http.get('/api/quotes/suggestions').then(function(response) {
                deferred.resolve(response.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function getAllQuestions() {
            var deferred = $q.defer();
            $http.get('/api/quotes/allQuestions').then(function(response) {
                deferred.resolve(response.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function getComments(quoteId) {
            var deferred = $q.defer();
            $http.get('/api/quotes/comments/' + quoteId).then(function(response) {
                deferred.resolve(response.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function addComment(quoteId, isDefaultTopic, commentObj) {
            var deferred = $q.defer();
            $http.put('/api/quotes/addComment/' + quoteId + '/' + isDefaultTopic,
                commentObj).then(function(response) {
                deferred.resolve(response.data);
                logger.success("Comment successfully added", response.data, "Success");
            }, function(err) {
                deferred.reject(err);
                logger.error("Comment could not be added", err, "Error");
            });
            return deferred.promise;
        }

        function deleteComment(quoteId, commentId) {
            var deferred = $q.defer();
            $http.delete('/api/quotes/deleteComment/' + quoteId + '/' + commentId).then(function() {
                deferred.resolve();
                logger.success("Comment successfully deleted", null, "Success");
            }, function(err) {
                deferred.reject(err);
                logger.error("Comment could not be deleted", err, "Error");
            });
            return deferred.promise;
        }

        function importQuotes(topicId, quotes) {
            var deferred = $q.defer();
            $http.post('/api/quotes/importQuotes/' + topicId, {
                'quotes': quotes
            }).then(function(response) {
                deferred.resolve(response.data);
                logger.success("Quotes successfully imported", response.data, "Success");
            }, function(err) {
                deferred.reject(err);
                logger.error("Could not import quotes", err, "Error");
            });
            return deferred.promise;
        }
    }
})();
