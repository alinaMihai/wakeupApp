(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('SessionController', SessionController);

    SessionController.$inject = ['cached', 'QuestionService', '$timeout', 'PracticeSessionService', '$stateParams', '$state', 'logger', '$sessionStorage'];

    /* @ngInject */
    function SessionController(cached, QuestionService, $timeout, PracticeSessionService, $stateParams, $state, logger, $sessionStorage) {
        var vm = this;
        vm.startQuestionSet = startQuestionSet;
        vm.endQuestionSet = endQuestionSet;

        vm.processQuestion = processQuestion;
        vm.practiceSessionService = PracticeSessionService;
        var questions, questionsNo, timer;
        var questionSetId = $stateParams.questionSetId;
        activate();

        ////////////////

        function activate() {
            cached.getQuestions(questionSetId).then(function(questionSet) {
                vm.questionSetQuestions = questionSet;
                questions = questionSet.questions;
                questionsNo = questions.length;
                logger.success("Question Set Session successfully started", {}, "Question Set Session");
                PracticeSessionService.questionSetSession = true;
                PracticeSessionService.currentQuestionIndex = 0;
                vm.currentQuestion = questions[PracticeSessionService.currentQuestionIndex];

                //is configuration in sessionStorage?
                PracticeSessionService.questionInterval = $sessionStorage.questionInterval ?
                    $sessionStorage.questionInterval : PracticeSessionService.questionInterval;
                PracticeSessionService.repeatQS = $sessionStorage.repeatQS ?
                    $sessionStorage.repeatQS : PracticeSessionService.repeatQS;

            });

        }

        function startQuestionSet() {
            PracticeSessionService.questionSetSession = true;
            logger.success("Question Set Session successfully started", {}, "Question Set Session");
            PracticeSessionService.currentQuestionIndex = 0;
            vm.currentQuestion = questions[PracticeSessionService.currentQuestionIndex];
        }

        function endQuestionSet() {
            PracticeSessionService.questionSetSession = false;
            PracticeSessionService.repeatQS = false;

            //remove any session configuration from sessionStorage
            delete $sessionStorage.questionInterval;
            delete $sessionStorage.repeatQS;

            PracticeSessionService.currentQuestionIndex = undefined;
            logger.success("Question Set Session successfully ended", {}, "Question Set Session");
            PracticeSessionService.questionInterval = undefined;
            if (!vm.questionSetQuestions.isDefault) {
                QuestionService.registerSession(questionSetId).then(function(questionSet) {
                    //vm.questionSetQuestions.practiceTimes = questionSet.practiceTimes;
                    QuestionService.isUpdated = true;
                    $state.go('questionList', {
                        'questionSetId': questionSetId
                    });

                });
            } else {
                $state.go('questionList', {
                    'questionSetId': questionSetId
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
            if (PracticeSessionService.currentQuestionIndex < questionsNo - 1) {
                timer = $timeout(function() {
                    PracticeSessionService.currentQuestionIndex++;
                    vm.currentQuestion = questions[PracticeSessionService.currentQuestionIndex];

                }, PracticeSessionService.questionInterval * 60 * 1000);
            } else {
                if (PracticeSessionService.repeatQS) {
                    PracticeSessionService.currentQuestionIndex = undefined;
                    timer = $timeout(function() {

                        startQuestionSet();

                    }, PracticeSessionService.questionInterval * 60 * 1000);

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
    }
})();
