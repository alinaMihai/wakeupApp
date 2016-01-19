(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('TopicService', TopicService);

    TopicService.$inject = ['$q', '$http', 'logger'];

    /* @ngInject */
    function TopicService($q, $http, logger) {
        this.getTopics = getTopics;
        this.createTopic = createTopic;
        this.deleteTopic = deleteTopic;
        this.updateTopic = updateTopic;
        this.getTopic = getTopic;

        function getTopics() {
            var deferred = $q.defer();
            $http.get('/api/topics').then(function(response) {
                var topics = response.data;
                if (topics.length > 0) {
                    deferred.resolve(topics);
                }
            },function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function getTopic(id) {
            var deferred = $q.defer();
            $http.get('/api/topics/' + id)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(err) {
                    logger.error("Could not retrieve topic",err,"Error");
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function createTopic(topicObj) {
            var deferred = $q.defer();
            $http.post('/api/topics/',
                topicObj).then(function(response) {

                deferred.resolve(response.data);
                logger.success("The topic was successfully created", response.data, "Success");
            }, function(response) {
                logger.error("Could not create topic",response,"Error");
                console.log("error", response);
                deferred.reject(response);
            });
            return deferred.promise;
        }

        function deleteTopic(topic) {
            var deferred = $q.defer();
            $http.delete('/api/topics/' + topic._id).then(function(response) {
                var topic = response.data;
                deferred.resolve();
                logger.success("Topic successfully deleted", topic, "Topic Deleted");
            },function(err){
                logger.error("Could not delete topic",err,"Error");
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function updateTopic(topicObj) {
            var deferred = $q.defer();
            $http.put('/api/topics/' + topicObj._id,
                topicObj).then(function(response) {

                deferred.resolve(response.data);
                logger.success("The topic was successfully updated", response.data, "Success");
            }, function(response) {
                logger.error("Could not update topic",response,"Error");
                deferred.reject(response);
                console.log("error", response);
            });
            return deferred.promise;
        }

    }
})();
