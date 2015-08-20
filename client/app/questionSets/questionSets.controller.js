(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionSetsCtrl', QuestionSetsCtrl);

    QuestionSetsCtrl.$inject = ['cached'];

    /* @ngInject */
    function QuestionSetsCtrl(cached) {
        var vm = this;
        vm.title = 'Question Sets List';

        cached.getQuestionSets().then(function(questionSets) {

            vm.questionSets = questionSets;
        });


    }
})();