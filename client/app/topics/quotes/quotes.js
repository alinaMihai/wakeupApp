(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('inspiration', {
                    url: '/topic/{topicId}/inspiration',
                    templateUrl: 'app/topics/quotes/inspiration.html',
                    controller: 'QuotesCtrl as QuotesCtrl',
                    resolve: {
                        topic: ['$stateParams', 'TopicService',
                            function($stateParams, TopicService) {
                                return TopicService.getTopic($stateParams.topicId).then(function(topic) {
                                    return topic;
                                });

                            }
                        ]
                    }
                });
        });
})();