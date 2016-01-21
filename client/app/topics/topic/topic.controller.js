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
        vm.deleteTopic=deleteTopic;

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
            data.addQsToTopic = addQsToTopic;
            data.removeQsFromTopic = removeQsFromTopic;

            function addQsToTopic(event, qs) {
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                var questionSetId = parseInt(qs);
                var isPresent = data.questionSetList.indexOf(questionSetId);
                if (isPresent === -1) {
                    data.questionSetList.push(questionSetId);
                }
            }

            function removeQsFromTopic(qsId) {
                var questionSetId = parseInt(qsId);
                var index = data.questionSetList.indexOf(questionSetId);
                data.questionSetList.splice(index, 1);
            }

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
                vm.topic=updatedTopic;
            });
        }
        function deleteTopic() {
            TopicService.deleteTopic(vm.topic).then(function() {
                $state.go('topicsList');
            });
        }
    }

})();
