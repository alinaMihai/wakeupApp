(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('SessionDetailsCtrl', SessionDetailsCtrl);

    SessionDetailsCtrl.$inject = ['QuestionService', '$stateParams', '$state', 'usSpinnerService',
        '$filter', 'AnswersFactory', 'Auth'
    ];

    /* @ngInject */
    function SessionDetailsCtrl(QuestionService, $stateParams, $state, usSpinnerService,
        $filter, AnswersFactory, Auth) {
        var vm = this;
        vm.questionSetId = $stateParams.questionSetId;
        vm.questionSetName = $stateParams.questionSetName;
        vm.questions = [];

        activate();


        function activate() {
            QuestionService.getQuestionSetData(vm.questionSetId).then(function(questions) {
                AnswersFactory.openIndexedDb().then(function() {
                    questions.forEach(function(question) {
                        AnswersFactory.getAnswers(question._id).then(function(answers) {
                            var answers = question.answers.concat(filterAnswers(answers));
                            question.answers = addDateFilterForAnswers(answers);
                            vm.questions.push(question);
                        });
                    });
                });

                usSpinnerService.stop('spinner-1');
            }, function(err) {
                if (typeof err === "string" && err.toLocaleLowerCase().replace(" ", '') === "notfound") {
                    $state.go('pageNotFound');
                } else {
                    $state.go('login');
                }
            });
        }

        function filterAnswers(answers) {
            var user = Auth.getCurrentUser();
            return answers.filter(function(answer) {
                return answer.userId === user._id;
            });
        }

        function addDateFilterForAnswers(answers) {
            answers.forEach(function(answer) {
                answer.theDay = $filter('date')(answer.date, 'hh:mm a on EEEE, dd MMM, yyyy');
            });
            return answers.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });
        }
    }
})();