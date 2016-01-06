(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('PracticeSessionService', PracticeSessionService);

    function PracticeSessionService() {
        this.repeatQuestionSet;
        this.questionInterval;
        this.questionSetSession;
        this.currentQuestionIndex;
        this.shuffleQuestions;
    }
})();
