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
                        topic: ['$stateParams', 'TopicService','$state',
                            function($stateParams, TopicService,$state) {
                                return TopicService.getTopic($stateParams.topicId).then(function(topic) {
                                    return topic;
                                },function(err){
                                    console.log(err);
                                    $state.go('pageNotFound');
                                });
                            }
                        ]
                    }
                });
        });
})();