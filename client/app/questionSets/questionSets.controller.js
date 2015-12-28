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
        vm.saveQuestionSet = saveQuestionSet;
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
            });
        }

        function hasErrorAddForm() {
            return !vm.addQuestionSet.questionSetText.$valid && vm.addQuestionSet.questionSetText.$dirty;
        }

        function saveQuestionSet() {
            var questionSetText = vm.questionSetText;

            if (questionSetText.trim() !== "" && questionSetText !== undefined) {
                var today = new Date().getTime();
                var questionSet = {
                    name: questionSetText,
                    createDate: today
                };
                QuestionSetService.addQuestionSet(questionSet).then(function(questionSet) {
                    vm.questionSets.push(questionSet);
                    //go to the questionList page
                    $location.path('/questionList/' + questionSet._id);

                });
                vm.questionSetText = undefined;
                vm.addQuestionSet.$setPristine();
                vm.addQuestionSetBool = false;
            }
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

            var questionSet = findQuestionSetById(questionSetId);

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
                            description: questionSet.description
                        };
                    }
                }
            });

            modalInstance.result.then(function(data) {

                var updatedObj = angular.extend(questionSet, data);

                updateQuestionSet(updatedObj);

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
