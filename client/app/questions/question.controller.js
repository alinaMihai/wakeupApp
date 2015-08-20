(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionCtrl', QuestionCtrl);

    QuestionCtrl.$inject = ['cached', '$stateParams', '$timeout', '$localStorage', 'QuestionService'];

    /* @ngInject */
    function QuestionCtrl(cached, $stateParams, $timeout, $localStorage, QuestionService) {
        var vm = this;
        vm.title = 'Question  List';



        vm.questionService = QuestionService;
        vm.currentQuestion = null;


        vm.startQuestionSet = function startQuestionSet() {
            QuestionService.currentQuestionIndex = 0;

            $localStorage.questionInterval = vm.questionInterval; //store interval vm.questionInterval;
            $localStorage.currentQuestionIndex = QuestionService.currentQuestionIndex;
            vm.currentQuestion = questions[$localStorage.currentQuestionIndex];
            //alert(questionInterval);
        };

        vm.processQuestion = function processQuestion() {
            //save answer 
            //setTimeInterval
            if (QuestionService.currentQuestionIndex < questionsNo - 1) {
                $timeout(function() {

                    QuestionService.currentQuestionIndex++;
                    $localStorage.currentQuestionIndex = QuestionService.currentQuestionIndex;
                    vm.currentQuestion = questions[$localStorage.currentQuestionIndex];

                }, $localStorage.questionInterval * 60 * 1000);
            }

        };

        var questionSetId = $stateParams.questionSetId;
        var questionInterval;
        var questionsNo;
        var questions = [];

        cached.getQuestions(questionSetId).then(function(questionSet) {

            vm.questionSetQuestions = questionSet;
            questions = questionSet.questions;
            questionsNo = questions.length;

        });




    }
})();