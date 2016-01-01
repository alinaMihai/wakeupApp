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
                        topic: ['$stateParams', 'TopicService','$state',
                            function($stateParams, TopicService,$state) {
                                return TopicService.getTopic($stateParams.topicId).then(function(topic) {
                                    return topic;
                                },function(err){
                                    if(typeof err==="string" && err.toLocaleLowerCase().replace(" ",'')==="notfound"){
                                        $state.go('pageNotFound');    
                                    }else{
                                        $state.go('login');
                                    }
                                    console.log(err);
                                    
                                });

                            }
                        ]
                    }
                });
        });
})();