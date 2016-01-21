(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('TopicCtrl', TopicCtrl);

    TopicCtrl.$inject = ['cached', '$uibModal', 'TopicService', 'usSpinnerService', 'CoreService'];

    /* @ngInject */
    function TopicCtrl(cached, $uibModal, TopicService, usSpinnerService, CoreService) {
        var vm = this;
        vm.topics = [];
        vm.openAddTopicModal = openAddTopicModal;
        vm.deleteTopic = deleteTopic;

        activate();

        ////////////////

        function activate() {

            cached.getTopics().then(function(topics) {
                vm.topics = topics;
                usSpinnerService.stop('spinner-1');
            }, function(err) {
                usSpinnerService.stop('spinner-1');
            });

        }

        function openAddTopicModal(size, topicId) {
            var topic = findTopicById(topicId);
            var emptyObj = {
                title: "",
                description: "",
                questionSetList: []
            };
            var data = topic ? angular.copy(topic, emptyObj) : emptyObj;
            var title = topic ? "Edit" : "Add";
            var dataObj = cached.getQuestionSets().then(function(questionSets) {
                data.heading = title;
                data.allQuestionSets = questionSets;
                data.getQuestionSetName = getQuestionSetName(data);
                data.addQsToTopic = CoreService.addQsToTopic(data);
                data.removeQsFromTopic = CoreService.removeQsFromTopic(data);
                return data;
            });
            var callback = function(data) {
                var topicObj = {};
                topicObj._id = data._id;
                topicObj.title = data.title;
                topicObj.description = data.description;
                topicObj.createDate = new Date().getTime();
                topicObj.questionSetList = data.questionSetList;

                return topic ? updateTopic(topicObj) : createTopic(topicObj);
            };
            CoreService.openModal(dataObj, 'app/topics/addTopicModal.html', callback);
        }

        function getQuestionSetName(data) {
            return function(questionSetId) {
                return _.find(data.allQuestionSets, {
                    _id: parseInt(questionSetId)
                }).name;
            }

        }


        function createTopic(createObj) {
            TopicService.createTopic(createObj).then(function(topic) {
                vm.topics.push(topic);
            });
        }

        function deleteTopic(topic) {
            TopicService.deleteTopic(topic).then(function() {
                var index = vm.topics.indexOf(topic);
                vm.topics.splice(index, 1);
            });
        }

        function updateTopic(updatedObj) {
            var updateTopic = findTopicById(updatedObj._id);
            TopicService.updateTopic(updatedObj).then(function(updatedTopic) {
                _.merge(updateTopic, updatedTopic, updateTopic);

            });
        }


        function findTopicById(id) {
            return _.find(vm.topics, {
                '_id': id
            });
        }


    }
})();
