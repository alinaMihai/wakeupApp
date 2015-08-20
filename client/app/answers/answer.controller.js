(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('AnswerCtrl', AnswerCtrl);

    AnswerCtrl.$inject = ['cached', '$stateParams'];

    /* @ngInject */
    function AnswerCtrl(cached, $stateParams) {
        var vm = this;
        vm.title = 'Answer  List';
        var questionId = $stateParams.questionId;

        cached.getAnswers(questionId).then(function(questionAnswers) {

            vm.questionAnswers = questionAnswers;
        });


    }
})();