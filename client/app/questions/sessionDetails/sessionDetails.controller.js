(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('SessionDetailsCtrl', SessionDetailsCtrl);

    SessionDetailsCtrl.$inject = ['QuestionService', '$stateParams', '$state', 'usSpinnerService'];

    /* @ngInject */
    function SessionDetailsCtrl(QuestionService, $stateParams, $state, usSpinnerService) {
        var vm = this;
        vm.questionSetId = $stateParams.questionSetId;
        vm.questionSetName = $stateParams.questionSetName;
        vm.questions = [];

        activate();


        function activate() {
            QuestionService.getQuestionSetData(vm.questionSetId).then(function(questions) {
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
    }
})();
