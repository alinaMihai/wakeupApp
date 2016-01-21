(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('TopicDetailCtrl', TopicDetailCtrl);

    TopicDetailCtrl.$inject = ['topic', 'CoreService', '$state', 'cached', 'TopicService'];

    /* @ngInject */
    function TopicDetailCtrl(topic, CoreService, $state, cached, TopicService) {
        var vm = this;
        vm.topic = topic;
        vm.topic.questionSetList = getQuestionSetIds(vm.topic);
        vm.editTopic = editTopic;
        vm.getQuestionSetName = getQuestionSetName;
        vm.deleteTopic = deleteTopic;

        activate();

        ////////////////

        function activate() {
            cached.getQuestionSets().then(function(questionSets) {
                vm.allQuestionSets = questionSets;
            });
        }

        function editTopic() {
            var data = angular.copy(vm.topic);
            data.heading = "Edit";
            data.allQuestionSets = vm.allQuestionSets;
            data.getQuestionSetName = getQuestionSetName;
            data.addQsToTopic = CoreService.addQsToTopic(data);
            data.removeQsFromTopic = CoreService.removeQsFromTopic(data);

            var template = "app/topics/addTopicModal.html";
            var callbback = function(data) {
                var topicObj = {};
                topicObj._id = data._id;
                topicObj.title = data.title;
                topicObj.description = data.description;
                topicObj.questionSetList = data.questionSetList;

                return updateTopic(topicObj);

            };
            CoreService.openModal(data, template, callbback);
        }

        function getQuestionSetName(questionSet) {
            if (vm.allQuestionSets) {
                return _.find(vm.allQuestionSets, {
                    _id: parseInt(questionSet)
                }).name;
            }

        }

        function getQuestionSetIds(topic) {
            var questionSetIds = [];
            topic.questionSetList.forEach(function(questionSet) {
                questionSetIds.push(questionSet._id);
            });
            return questionSetIds;
        }

        function updateTopic(updatedObj) {
            TopicService.updateTopic(updatedObj).then(function(updatedTopic) {
                TopicService.isUpdated=true;
                vm.topic = updatedTopic;
            });
        }

        function deleteTopic() {
            TopicService.deleteTopic(vm.topic).then(function() {
                TopicService.isUpdated=true;
                $state.go('topicsList');
            });
        }
    }

})();
