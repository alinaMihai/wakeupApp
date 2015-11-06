(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('topicsList', {
                    url: '/topicsList',
                    templateUrl: 'app/topics/topics.html',
                    controller: 'TopicCtrl as topicCtrl'
                });
        });
})();