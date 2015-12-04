(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuoteDetailCtrl', QuoteDetailCtrl);

    QuoteDetailCtrl.$inject = ['QuoteService', '$stateParams', 'topic', 'usSpinnerService'];

    /* @ngInject */
    function QuoteDetailCtrl(QuoteService, $stateParams, topic, usSpinnerService) {
        var vm = this;
        vm.quote = {};
        vm.topic = topic;
        activate();

        ////////////////

        function activate() {

            QuoteService.getQuote($stateParams.quoteId).then(function(quote) {
                vm.quote = quote;
                usSpinnerService.stop('spinner-1');
            });

        }
    }
})();