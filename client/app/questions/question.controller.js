(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionCtrl', QuestionCtrl);

    QuestionCtrl.$inject = ['cached', '$stateParams', 'QuestionService', '$uibModal', 'usSpinnerService','PracticeSessionService','$state'];

    /* @ngInject */
    function QuestionCtrl(cached, $stateParams, QuestionService, $uibModal, usSpinnerService,PracticeSessionService,$state) {
        var vm = this;
        vm.title = 'Question  List';
       
        vm.addQuestionBool = false;

        vm.questionService = QuestionService;

        vm.startQuestionSet = startQuestionSet;

        vm.saveQuestion = saveQuestion;
        vm.cancelAddQuestion = cancelAddQuestion;
        vm.hasErrorAddForm = hasErrorAddForm;

        vm.deleteQuestion = deleteQuestion;
        vm.openEditQuestionModal = openEditQuestionModal;

        var questionSetId = $stateParams.questionSetId;
       
        activate();


        function activate() {
            cached.getQuestions(questionSetId).then(function(questionSet) {
                vm.questionSetQuestions = questionSet;
                usSpinnerService.stop('spinner-1');
            });
        }

        function hasErrorAddForm() {
            return !vm.addQuestion.questionText.$valid && vm.addQuestion.questionText.$dirty;
        }

        function startQuestionSet() {
            PracticeSessionService.questionInterval=vm.questionInterval;
            PracticeSessionService.repeatQS=vm.repeatQS;
            $state.go('practiceSession',{'questionSetId':questionSetId});
        }

        function saveQuestion() {
            var questionText = vm.questionText;
            var questionSetId = vm.questionSetQuestions._id;
            if (questionText.trim() !== "" && questionText !== undefined) {
                var today = new Date().getTime();
                var question = {
                    text: questionText,
                    questionSet: questionSetId,
                    date: today
                };
                QuestionService.addQuestion(question).then(function(question) {
                    vm.questionSetQuestions.questions.push(question);
                });
                vm.questionText = undefined;
                vm.addQuestion.$setPristine();
                vm.addQuestionBool = false;
            }
        }

        function cancelAddQuestion() {
            vm.addQuestionBool = !vm.addQuestionBool;
            vm.addQuestion.$setPristine();
            vm.questionText = undefined;
        }

        function deleteQuestion(question) {
            QuestionService.deleteQuestion(question).then(function() {
                var index = vm.questionSetQuestions.questions.indexOf(question);
                vm.questionSetQuestions.questions.splice(index, 1);
            });
        }

        function openEditQuestionModal(size, questionId) {

            var question = angular.copy(findQuestionById(questionId));

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/questions/editQuestionModal.html',
                size: size,
                controller: 'ModalInstanceCtrl as modalCtrl',
                resolve: {
                    data: function() {
                        return {
                            text: question.text
                        };
                    }
                }
            });

            modalInstance.result.then(function(data) {

                var updatedObj = angular.extend(question, data);

                updateQuestion(updatedObj);

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function updateQuestion(updatedObj) {
            vm.questionService.editQuestion(updatedObj).then(function(updatedQuestion) {
                angular.extend(findQuestionById(updatedQuestion._id), updatedQuestion);
            });
        }

        function findQuestionById(id) {
            return _.find(vm.questionSetQuestions.questions, {
                '_id': id
            });
        }

    }

})();