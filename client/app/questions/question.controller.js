(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionCtrl', QuestionCtrl);

    QuestionCtrl.$inject = ['cached', '$stateParams', 'QuestionService', '$uibModal', 'usSpinnerService', 'PracticeSessionService', '$state', '$scope', 'logger'];

    /* @ngInject */
    function QuestionCtrl(cached, $stateParams, QuestionService, $uibModal, usSpinnerService, PracticeSessionService, $state, $scope, logger) {
        var vm = this;
        vm.title = 'Question  List';

        vm.addQuestionBool = false;
        vm.exportQuestions = [];

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
                vm.exportQuestions = updateQuestionsToExport(vm.questionSetQuestions.questions);
                usSpinnerService.stop('spinner-1');
            }, function(err) {
                if (typeof err === "string" && err.toLocaleLowerCase().replace(" ", '') === "notfound") {
                    $state.go('pageNotFound');
                } else {
                    $state.go('login');
                }

            });
            $scope.$watch(function() {
                return vm.csvResult;
            }, function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal.length >= 1 && newVal[0] != '') {
                        QuestionService.importQuestions(vm.questionSetQuestions._id, newVal).then(function(questions) {
                            questions.forEach(function(question) {
                                vm.questionSetQuestions.questions.push(question);
                            });
                            vm.exportQuestions=updateQuestionsToExport(vm.questionSetQuestions.questions);
                        });
                        newVal = undefined;
                        vm.csvContent = undefined;
                        vm.showImport = false;
                    } else {
                        logger.error("Could not import questions");
                    }

                }
            });
        }

        function hasErrorAddForm() {
            return !vm.addQuestion.questionText.$valid && vm.addQuestion.questionText.$dirty;
        }

        function startQuestionSet() {
            PracticeSessionService.questionInterval = vm.questionInterval;
            PracticeSessionService.repeatQS = vm.repeatQS;
            PracticeSessionService.shuffleQuestions = vm.shuffleQuestions;
            $state.go('practiceSession', {
                'questionSetId': questionSetId
            });
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
                    vm.exportQuestions = updateQuestionsToExport(vm.questionSetQuestions.questions);
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
                vm.exportQuestions = updateQuestionsToExport(vm.questionSetQuestions.questions);
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

        function updateQuestionsToExport(questions) {
            var exportQuestions = questions.map(function(question) {
                return {
                    questionName: question.text
                };
            });
            return exportQuestions;
        }
    }

})();
