(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .factory('cached', cached);

    cached.$inject = ['QuestionSetService', 'QuestionService', 'AnswerService', 'TopicService', 'User', '$location'];

    /* @ngInject */
    function cached(QuestionSetService, QuestionService, AnswerService, TopicService, User, $location) {
        var questionsSets = [],
            questions = [],
            answers = [],
            topics = [],
            questionsList = {};

        var service = {
            getQuestionSets: getQuestionSets,
            getQuestions: getQuestions,
            getQuestion: getQuestion,
            getAnswers: getAnswers,
            getTopics: getTopics,
            clear: clear
        };

        return service;

        ////////////////
        function redirect() {
            var currentUser = User.get().$promise.then(function(currentUser) {
                if (!currentUser) {
                    $location.path('/login');
                }
            });

        }

        function getQuestion(questionId) {
            if (!questionsList[questionId] || QuestionSetService.isUpdated || QuestionService.isUpdated) {
                questionsList[questionId] = QuestionService.getQuestionById(questionId);
            }
            return questionsList[questionId];
        }

        function getQuestionSets() {
            if (questionsSets.length === 0) {
                questionsSets = QuestionSetService.getQuestionSets();
            } else {
                redirect();
            }

            return questionsSets;
        }

        function getQuestions(questionSetId) {
            if (!questions[questionSetId] || QuestionSetService.isUpdated || QuestionService.isUpdated) {
                questions[questionSetId] = QuestionService.getQuestions(questionSetId);
                
                if(QuestionService.isUpdated){
                    QuestionService.isUpdated=false;
                }

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
            } else {
                redirect();
            }
            return topics;
        }

        function clear() {
            questionsSets = [];
            questions = [];
            answers = [];
            topics = [];
            questionsList = {};
        }
    }
})();