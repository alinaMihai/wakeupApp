(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('SessionDetailsCtrl', SessionDetailsCtrl);

    SessionDetailsCtrl.$inject = ['QuestionService', '$stateParams', '$state', 'usSpinnerService','$filter'];

    /* @ngInject */
    function SessionDetailsCtrl(QuestionService, $stateParams, $state, usSpinnerService,$filter) {
        var vm = this;
        vm.questionSetId = $stateParams.questionSetId;
        vm.questionSetName = $stateParams.questionSetName;
        vm.questions = [];

        activate();


        function activate() {
            QuestionService.getQuestionSetData(vm.questionSetId).then(function(questions) {
                
                questions.forEach(function(question){
                    question.answers=addDateFilterForAnswers(question.answers);
                });
                vm.questions = questions;
                usSpinnerService.stop('spinner-1');
            }, function(err) {
                if (typeof err === "string" && err.toLocaleLowerCase().replace(" ", '') === "notfound") {
                    $state.go('pageNotFound');
                } else {
                    $state.go('login');
                }
            });
        }

        function addDateFilterForAnswers(answers){
            answers.forEach(function(answer){
                answer.theDay=$filter('date')(answer.date, 'hh:mm a on EEEE, dd MMM, yyyy');
            });
            return answers;
        }
    }
})();
