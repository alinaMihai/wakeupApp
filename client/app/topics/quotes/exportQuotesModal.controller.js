(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('ExportQuotesCtrl', Controller);

    Controller.$inject = ['$scope', '$modalInstance', 'data','logger'];

    /* @ngInject */
    function Controller($scope, $modalInstance, data,logger) {
        var vm = this;
        vm.data = data;
        vm.fshow = "3";
        vm.ok = okHandler;
        vm.cancel = cancelHandler;
        vm.exportQuotes = data.quotes;
        vm.noQuotes = vm.exportQuotes.length;
        vm.allQuotes = allQuotes;
        vm.noQuotes;

        activate();

        function activate() {
            vm.sources=data.sources;
            vm.authors=data.authors;
            $scope.$watch(function() {
                return vm.source;
            }, function(newVal, oldVal) {
                if (newVal !== oldVal && newVal) {
                    vm.author = "";
                    filterQuotes();
                }
            });
            $scope.$watch(function() {
                return vm.author;
            }, function(newVal, oldVal) {
                if (newVal !== oldVal && newVal) {
                    vm.source = "";
                    filterQuotes();
                }
            });
        }

        function filterQuotes() {
            switch (parseInt(vm.fshow)) {
                case 1:
                    {
                        
                        vm.exportQuotes = vm.data.quotes.filter(function(quote) {
                            var source=vm.source==="N/A"?"":vm.source;
                            return quote.source === source;
                        });
                        vm.noQuotes = vm.exportQuotes.length;
                        break;
                    }
                case 2:
                    {
                        vm.exportQuotes = vm.data.quotes.filter(function(quote) {
                            var author=vm.author==="N/A"?"":vm.author;
                            return quote.author === author;
                        });
                        vm.noQuotes = vm.exportQuotes.length;
                        break;
                    }
            }
        }
        function allQuotes() {
            vm.exportQuotes = vm.data.quotes;
            vm.author = "";
            vm.source = "";
            vm.noQuotes = vm.exportQuotes.length;
        }

        function okHandler() {
            logger.success("Quotes successfully exported",null,"Success");
            $modalInstance.close(data);
        }

        function cancelHandler() {
            $modalInstance.dismiss('cancel');
        }
    }

})();
