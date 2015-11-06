(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('TopicCtrl', TopicCtrl);

    TopicCtrl.$inject = ['cached', '$uibModal', 'TopicService'];

    /* @ngInject */
    function TopicCtrl(cached, $uibModal, TopicService) {
        var vm = this;
        vm.topics = [];
        vm.openAddTopicModal = openAddTopicModal;
        vm.deleteTopic = deleteTopic;

        activate();

        ////////////////

        function activate() {

            cached.getTopics().then(function(topics) {
                vm.topics = topics;
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
            var title = topic ? "Update" : "Add";
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/topics/addTopicModal.html',
                size: size,
                controller: 'ModalInstanceCtrl as modalCtrl',
                resolve: {
                    data: function() {
                        return cached.getQuestionSets().then(function(questionSets) {
                            data.heading = title;
                            data.allQuestionSets = questionSets;
                            data.getQuestionSetName = getQuestionSetName;
                            data.addQsToTopic = addQsToTopic;
                            data.removeQsFromTopic = removeQsFromTopic;

                            return data;
                        });

                    }
                }
            });

            modalInstance.result.then(function(data) {
                var topicObj = {};
                topicObj._id = data._id;
                topicObj.title = data.title;
                topicObj.description = data.description;
                topicObj.createDate = new Date().getTime();
                topicObj.questionSetList = data.questionSetList;
                console.log(topicObj);
                return topic ? updateTopic(topicObj) : createTopic(topicObj);

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });


            function getQuestionSetName(questionSetId) {
                return _.find(data.allQuestionSets, {
                    _id: parseInt(questionSetId)
                }).name;
            }

            function addQsToTopic(event, qsId) {
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                var questionSetId = parseInt(qsId);
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