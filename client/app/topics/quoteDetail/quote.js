(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('quote', {
                    url: '/topic/{topicId}/inspiration/quotes/{quoteId}',
                    templateUrl: 'app/topics/quoteDetail/quoteDetail.html',
                    controller: 'QuoteDetailCtrl as QuoteDetailCtrl',
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