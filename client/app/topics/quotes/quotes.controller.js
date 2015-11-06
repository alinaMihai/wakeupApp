(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuotesCtrl', QuotesCtrl);

    QuotesCtrl.$inject = ['topic', 'QuoteService', '$uibModal'];

    /* @ngInject */
    function QuotesCtrl(topic, QuoteService, $uibModal) {
        var vm = this;
        vm.quotes = [];
        vm.topic = topic;
        vm.openQuoteModal = openQuoteModal;
        vm.deleteQuote = deleteQuote;

        activate();

        ////////////////

        function activate() {

            QuoteService.getQuotes(topic._id).then(function(quotes) {
                vm.quotes = quotes;
            });
        }

        function openQuoteModal(size, quoteId) {
            var quote = findQuoteById(quoteId);
            var emptyObj = {
                author: '',
                text: '',
                source: '',
                comment: ''
            };
            var data = quote ? angular.copy(quote) : emptyObj;
            data.heading = quote ? 'Edit' : 'Add';

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/topics/quotes/addQuoteModal.html',
                size: size,
                controller: 'ModalInstanceCtrl as modalCtrl',
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                var quoteObj = {};
                quoteObj._id = data._id;
                quoteObj.author = data.author;
                quoteObj.text = data.text;
                quoteObj.source = data.source;
                quoteObj.date = new Date().getTime();
                quoteObj.comment = data.comment;

                return quote ? updateQuote(quoteObj) : createQuote(quoteObj);

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function findQuoteById(id) {
            return _.find(vm.quotes, {
                '_id': id
            });
        }

        function createQuote(createObj) {
            QuoteService.createQuote(vm.topic._id, createObj).then(function(quote) {
                vm.quotes.push(quote);
            });
        }

        function deleteQuote(quote) {
            QuoteService.deleteQuote(quote).then(function() {
                var index = vm.quotes.indexOf(quote);
                vm.quotes.splice(index, 1);
            });
        }

        function updateQuote(updatedObj) {
            var updateQuote = findQuoteById(updatedObj._id);
            QuoteService.updateQuote(updatedObj).then(function(updatedQuote) {
                _.merge(updateQuote, updatedQuote, updateQuote);

            });

        }
    }
})();