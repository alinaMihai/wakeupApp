(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .factory('cached', cached);

    cached.$inject = ['QuestionSetService', 'QuestionService', 'AnswerService'];

    /* @ngInject */
    function cached(QuestionSetService, QuestionService, AnswerService) {
        var questionsSets, questions = {},
            answers = {};
        var service = {
            getQuestionSets: getQuestionSets,
            getQuestions: getQuestions,
            getAnswers: getAnswers
        };
        return service;

        ////////////////

        function getQuestionSets() {
            if (!questionsSets) {
                questionsSets = QuestionSetService.getQuestionSets();
            }
            return questionsSets;
        }

        function getQuestions(questionSetId) {
            if (!questions[questionSetId]) {
                questions[questionSetId] = QuestionService.getQuestions(questionSetId);

            }
            return questions[questionSetId];
        }

        function getAnswers(questionId) {
            if (!answers[questionId]) {
                answers[questionId] = AnswerService.getAnswers(questionId);
            }
            return answers[questionId];
        }
    }
})();