(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionSetsCtrl', QuestionSetsCtrl);

    QuestionSetsCtrl.$inject = ['cached', 'QuestionSetService', '$uibModal', '$location', 'usSpinnerService'];

    /* @ngInject */
    function QuestionSetsCtrl(cached, QuestionSetService, $uibModal, $location, usSpinnerService) {
        var vm = this;
        vm.title = 'Question Sets List';
        vm.cancelAddQuestionSet = cancelAddQuestionSet;
        vm.hasErrorAddForm = hasErrorAddForm;
        vm.questionSetService = QuestionSetService;
        vm.deleteQuestionSet = deleteQuestionSet;
        vm.openModal = openModal;
        vm.questionSets = [];
        vm.addQuestionSetBool = false;
        activate();

        function activate() {
            usSpinnerService.spin('spinner-1');
            cached.getQuestionSets().then(function(questionSets) {
                vm.questionSets = questionSets;
                usSpinnerService.stop('spinner-1');
            }, function(err) {
                usSpinnerService.stop('spinner-1');
            });
        }

        function hasErrorAddForm() {
            return !vm.addQuestionSet.questionSetText.$valid && vm.addQuestionSet.questionSetText.$dirty;
        }

        function createQuestionSet(questionSet) {
            QuestionSetService.addQuestionSet(questionSet).then(function(questionSet) {
                vm.questionSets.push(questionSet);
                //go to the questionList page
                $location.path('/questionList/' + questionSet._id);

            });
        }

        function cancelAddQuestionSet() {
            vm.questionSetText = undefined;
            vm.addQuestionSetBool = !vm.addQuestionSetBool;
            vm.addQuestionSet.$setPristine();
        }

        function deleteQuestionSet(questionSet) {

            QuestionSetService.deleteQuestionSet(questionSet).then(function() {
                var index = vm.questionSets.indexOf(questionSet);
                vm.questionSets.splice(index, 1);
            });
        }

        function openModal(size, questionSetId) {
            var emptyQuestionSet = {
                name: "",
                impact: 0,
                description: ""
            };
            var questionSet = findQuestionSetById(questionSetId) || emptyQuestionSet;
            var questionSetHeading = questionSetId ? "Edit" : "Create";
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/questionSets/editQuestionSetModal.html',
                size: size,
                controller: 'ModalInstanceCtrl as modalCtrl',
                resolve: {
                    data: function() {
                        return {
                            name: questionSet.name,
                            impact: questionSet.impact,
                            description: questionSet.description,
                            questionSetHeading: questionSetHeading
                        };
                    }
                }
            });

            modalInstance.result.then(function(data) {
                if (!questionSetId) {
                    var today = new Date().getTime();
                    var createQuestionSetObj = {
                        name: data.name,
                        impact: data.impact,
                        description: data.description,
                        createDate: today
                    };
                    createQuestionSet(createQuestionSetObj);
                } else {
                    var updatedObj = angular.extend(questionSet, data);
                    updateQuestionSet(updatedObj);
                }

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function updateQuestionSet(updatedObj) {
            vm.questionSetService.editQuestionSet(updatedObj);
        }

        function findQuestionSetById(id) {
            return _.find(vm.questionSets, {
                '_id': id
            });
        }

    }
})();
