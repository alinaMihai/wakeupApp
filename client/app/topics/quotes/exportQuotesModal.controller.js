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
            vm.sources = display(data.sources, "source");
            vm.authors = display(data.authors, "author");
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
                        if (vm.source = "N/A") {
                            vm.source = "";
                        }
                        vm.exportQuotes = vm.data.quotes.filter(function(quote) {
                            return quote.source === vm.source;
                        });
                        vm.noQuotes = vm.exportQuotes.length;
                        break;
                    }
                case 2:
                    {
                        vm.exportQuotes = vm.data.quotes.filter(function(quote) {
                            return quote.author === vm.author;
                        });
                        vm.noQuotes = vm.exportQuotes.length;
                        break;
                    }
            }
        }

        function display(array, property) {
            if (!array) {
                return [];
            }
            var displayArray = [];

            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < vm.data.quotes.length; j++) {
                    if (vm.data.quotes[j][property] === array[i]) {
                        displayArray.push(array[i]);
                        break;
                    }
                }
            }
            return displayArray;
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
