(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuoteDetailCtrl', QuoteDetailCtrl);

    QuoteDetailCtrl.$inject = ['QuoteService', '$stateParams', 'topic'];

    /* @ngInject */
    function QuoteDetailCtrl(QuoteService, $stateParams, topic) {
        var vm = this;
        vm.quote = {};
        vm.topic = topic;
        activate();

        ////////////////

        function activate() {

            QuoteService.getQuote($stateParams.quoteId).then(function(quote) {
                vm.quote = quote;
            });

        }
    }
})();