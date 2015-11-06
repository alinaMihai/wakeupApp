(function() {
    'use strict';

    angular.module('wakeupApp')
        .config(function($stateProvider) {
            $stateProvider
                .state('topic', {
                    url: '/topic/{topicId}',
                    templateUrl: 'app/topics/topic/topicDetail.html',
                    controller: 'TopicDetailCtrl as TopicDetailCtrl',
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