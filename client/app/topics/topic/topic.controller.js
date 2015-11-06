(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('TopicDetailCtrl', TopicDetailCtrl);

    TopicDetailCtrl.$inject = ['topic'];

    /* @ngInject */
    function TopicDetailCtrl(topic) {
        var vm = this;
        vm.topic = topic;

        activate();

        ////////////////

        function activate() {}
    }
})();