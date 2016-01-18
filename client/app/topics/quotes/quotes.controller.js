(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuotesCtrl', QuotesCtrl);

    QuotesCtrl.$inject = ['topic', 'QuoteService', '$uibModal', 'usSpinnerService', 'CoreService', '$scope', 'logger'];

    /* @ngInject */
    function QuotesCtrl(topic, QuoteService, $uibModal, usSpinnerService, CoreService, $scope, logger) {
        var vm = this;
        vm.quotes = [];
        vm.topic = topic;
        vm.exportQuotes = [];
        vm.openQuoteModal = openQuoteModal;
        vm.deleteQuote = deleteQuote;
        vm.openExportQuotesModal = openExportQuotesModal;

        vm.csv = {
            content: null,
            header: true,
            separator: ',',
            result: null,
            encoding: 'ISO-8859-1',
        };

        activate();

        ////////////////

        function activate() {
            usSpinnerService.spin('spinner-1');
            QuoteService.getQuotes(topic._id).then(function(quotes) {
                vm.quotes = CoreService.groupArrayObjectsByDate(quotes);
                vm.exportQuotes = updateQuotesToExport(vm.quotes);
                usSpinnerService.stop('spinner-1');
            }, function(err) {
                usSpinnerService.stop('spinner-1');
            });

            $scope.$watch(function() {
                return vm.csv.result;
            }, function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal.length >= 1 && checkImportFormat(newVal) && newVal[0] != '') {
                        console.log(newVal);
                        QuoteService.importQuotes(vm.topic._id, newVal).then(function(quotes) {
                            quotes.forEach(function(quote) {
                                vm.quotes.push(quote);
                            });
                            vm.exportQuotes = updateQuotesToExport(vm.quotes);
                        });
                        newVal = null;
                        vm.csv.content = null;
                        vm.showImport = false;
                    } else {
                        logger.error("Could not import quotes");
                    }

                }
            });
        }

        function openExportQuotesModal(topicName) {
            var data = {};
            var modalInstance;
            data.quotes = vm.exportQuotes;
            data.topicName = topicName;

            QuoteService.getSuggestions().then(function(suggestions) {
                data.authors = suggestions.authors;
                data.sources = suggestions.sources;

                modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/topics/quotes/exportQuotesModal.html',
                    size: 'lg',
                    controller: 'ExportQuotesCtrl as modalCtrl',
                    resolve: {
                        data: function() {
                            return data;
                        }
                    }
                });
                modalInstance.result.then(function(data) {}, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            });
        }

        function openQuoteModal(size, quoteId) {
            var quote = findQuoteById(quoteId);
            var emptyObj = {
                author: '',
                text: '',
                source: '',
                comment: '',
                question: ''
            };

            var data = quote ? angular.copy(quote) : emptyObj;

            data.heading = quote ? 'Edit' : 'Create';
            QuoteService.getSuggestions().then(function(suggestions) {
                data.authors = suggestions.authors;
                data.sources = suggestions.sources;
            });
            QuoteService.getAllQuestions().then(function(allQuestions) {
                data.allQuestions = allQuestions;

            });
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
                quoteObj.question = data.associatedQuestion;

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
                quote.theDay = CoreService.timeConverter(quote.date);
                vm.quotes.push(quote);
                vm.exportQuotes = updateQuotesToExport(vm.quotes);
            });
        }

        function deleteQuote(quote) {
            QuoteService.deleteQuote(quote).then(function() {
                var index = vm.quotes.indexOf(quote);
                vm.quotes.splice(index, 1);
                vm.exportQuotes = updateQuotesToExport(vm.quotes);
            });
        }

        function updateQuote(updatedObj) {
            var updateQuote = findQuoteById(updatedObj._id);
            QuoteService.updateQuote(updatedObj).then(function(updatedQuote) {
                updatedQuote.theDay = CoreService.timeConverter(updatedQuote.date);
                _.merge(updateQuote, updatedQuote, updateQuote);

            });
        }

        function updateQuotesToExport(quotes) {
            var exportQuotes = quotes.map(function(quote) {
                return {
                    author: quote.author,
                    text: quote.text,
                    source: quote.source
                };
            });
            return exportQuotes;
        }

        function checkImportFormat(quotes) {
            var formatOk = quotes.every(function(quote) {
                return quote.hasOwnProperty('author') && quote.hasOwnProperty('source') && quote.hasOwnProperty('text');
            });

            return formatOk;
        }
    }
})();
