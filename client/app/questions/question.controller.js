(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionCtrl', QuestionCtrl);

    QuestionCtrl.$inject = ['cached', '$stateParams', '$timeout', '$localStorage', 'QuestionService', 'logger'];

    /* @ngInject */
    function QuestionCtrl(cached, $stateParams, $timeout, $localStorage, QuestionService, logger) {
        var vm = this;
        vm.title = 'Question  List';



        vm.questionService = QuestionService;
        vm.currentQuestion = null;


        vm.startQuestionSet = startQuestionSet;
        vm.endQuestionSet = endQuestionSet;

        vm.processQuestion = processQuestion;

        var questionSetId = $stateParams.questionSetId;
        var questionInterval;
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
        }

        function startQuestionSet() {
            QuestionService.questionSetSession = true;
            logger.success("Question Set Session successfully started", {}, "Question Set Session");
            QuestionService.currentQuestionIndex = 0;

            $localStorage.questionInterval = vm.questionInterval; //store interval vm.questionInterval;
            $localStorage.currentQuestionIndex = QuestionService.currentQuestionIndex;
            vm.currentQuestion = questions[$localStorage.currentQuestionIndex];
            //alert(questionInterval);
        };

        function endQuestionSet() {
            QuestionService.questionSetSession = false;
            logger.success("Question Set Session successfully ended", {}, "Question Set Session");
            vm.questionInterval = undefined;
            $timeout.cancel(timer);
        }

        function processQuestion() {
            //save answer 

            saveAnswer();

            //setTimeInterval for next question if any
            if (QuestionService.currentQuestionIndex < questionsNo - 1) {
                timer = $timeout(function() {

                    QuestionService.currentQuestionIndex++;
                    $localStorage.currentQuestionIndex = QuestionService.currentQuestionIndex;
                    vm.currentQuestion = questions[$localStorage.currentQuestionIndex];

                }, $localStorage.questionInterval * 60 * 1000);
            } else {
                logger.success("Question Set Session successfully ended", {}, "Question Set Session");
                QuestionService.questionSetSession = false;
            }

        };

        function saveAnswer() {
            var questionId = vm.currentQuestion._id;
            var answerText = vm.currentAnswer;
            if (answerText.trim() !== "" && answerText !== undefined) {
                var today = new Date().getTime();
                var answer = {
                    question: questionId,
                    text: answerText,
                    date: today
                }
                QuestionService.saveAnswer(answer);
            }

        }

    }
})();