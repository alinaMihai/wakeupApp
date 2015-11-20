(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionCtrl', QuestionCtrl);

    QuestionCtrl.$inject = ['cached', '$stateParams', '$timeout', 'QuestionService', 'logger', '$scope', '$uibModal'];

    /* @ngInject */
    function QuestionCtrl(cached, $stateParams, $timeout, QuestionService, logger, $scope, $uibModal) {
        var vm = this;
        vm.title = 'Question  List';
        vm.currentQuestion = null;
        vm.addQuestionBool = false;

        vm.questionService = QuestionService;

        vm.startQuestionSet = startQuestionSet;
        vm.endQuestionSet = endQuestionSet;

        vm.processQuestion = processQuestion;
        vm.saveQuestion = saveQuestion;
        vm.cancelAddQuestion = cancelAddQuestion;
        vm.hasErrorAddForm = hasErrorAddForm;

        vm.deleteQuestion = deleteQuestion;
        vm.openEditQuestionModal = openEditQuestionModal;

        var questionSetId = $stateParams.questionSetId;
        var questionInterval = 0;
        var questionsNo;
        var questions = [];
        var timer;
        activate();


        function activate() {
            cached.getQuestions(questionSetId).then(function(questionSet) {

                vm.questionSetQuestions = questionSet;
                questions = questionSet.questions;
                questionsNo = questions.length;

            });
            $scope.$watch(function() {
                return vm.questionService.endSessionOnBackBtn;
            }, function(newVal, oldVal) {
                console.log(newVal, oldVal);
                //handle case user clicks back button during session
                if (newVal === true) {
                    endQuestionSet();
                    QuestionService.endSessionOnBackBtn = false;

                }
            });
        }

        function hasErrorAddForm() {
            return !vm.addQuestion.questionText.$valid && vm.addQuestion.questionText.$dirty;
        }

        function startQuestionSet() {
            QuestionService.questionSetSession = true;
            logger.success("Question Set Session successfully started", {}, "Question Set Session");
            QuestionService.currentQuestionIndex = 0;
            vm.currentQuestion = questions[QuestionService.currentQuestionIndex];
        };

        function endQuestionSet() {
            QuestionService.questionSetSession = false;
            vm.questionService.repeatQS = false;

            QuestionService.currentQuestionIndex = undefined;
            logger.success("Question Set Session successfully ended", {}, "Question Set Session");
            vm.questionInterval = undefined;
            if (!vm.questionSetQuestions.isDefault) {
                QuestionService.registerSession(questionSetId).then(function(questionSet) {
                    vm.questionSetQuestions.practiceTimes = questionSet.practiceTimes;
                });
            }

            if (timer) {
                $timeout.cancel(timer);
            }

        }

        function processQuestion() {
            //save answer 
            saveAnswer();
            //setTimeInterval for next question if any
            if (QuestionService.currentQuestionIndex < questionsNo - 1) {
                timer = $timeout(function() {

                    QuestionService.currentQuestionIndex++;
                    vm.currentQuestion = questions[QuestionService.currentQuestionIndex];

                }, vm.questionInterval * 60 * 1000);
            } else {
                if (vm.questionService.repeatQS) {
                    QuestionService.currentQuestionIndex = undefined;
                    timer = $timeout(function() {

                        startQuestionSet();

                    }, vm.questionInterval * 60 * 1000);

                } else {
                    endQuestionSet();
                }

            }

        };

        function saveAnswer() {
            var questionId = vm.currentQuestion._id;
            var answerText = vm.currentAnswer;
            if (answerText !== undefined && answerText.trim() !== "") {
                var today = new Date().getTime();
                var answer = {
                    question: questionId,
                    text: answerText,
                    date: today
                }
                QuestionService.saveAnswer(answer);
                QuestionService.isUpdated = true;
                vm.currentAnswer = '';
            }

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
                    questionsNo = vm.questionSetQuestions.questions.length;
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