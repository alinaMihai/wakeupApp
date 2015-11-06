(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .factory('cached', cached);

    cached.$inject = ['QuestionSetService', 'QuestionService', 'AnswerService', 'TopicService'];

    /* @ngInject */
    function cached(QuestionSetService, QuestionService, AnswerService, TopicService) {
        var questionsSets = [],
            questions = [],
            answers = [],
            topics = [];

        var service = {
            getQuestionSets: getQuestionSets,
            getQuestions: getQuestions,
            getAnswers: getAnswers,
            getTopics: getTopics,
            clear: clear
        };

        return service;

        ////////////////

        function getQuestionSets() {
            if (questionsSets.length === 0) {
                questionsSets = QuestionSetService.getQuestionSets();
            }
            return questionsSets;
        }

        function getQuestions(questionSetId) {
            if (!questions[questionSetId] || QuestionSetService.isUpdated) {
                questions[questionSetId] = QuestionService.getQuestions(questionSetId);

            }
            return questions[questionSetId];
        }

        function getAnswers(questionId) {
            if (!answers[questionId] || QuestionService.isUpdated) {
                answers[questionId] = AnswerService.getAnswers(questionId);
            }
            return answers[questionId];
        }

        function getTopics() {
            if (topics.length === 0) {
                topics = TopicService.getTopics();
            }
            return topics;
        }

        function clear() {
            questionsSets = [];
            questions = [];
            answers = [];
            topics = [];
        }
    }
})();