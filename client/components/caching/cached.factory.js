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
                if(QuestionSetService.isUpdated){
                    QuestionSetService.isUpdated=false;
                }
                if(QuestionService.isUpdated){
                    QuestionService.isUpdated=false;
                }
            }
            return questionsList[questionId];
        }

        function getQuestionSets() {
            if (questionsSets.length === 0 || QuestionSetService.isUpdated) {
                questionsSets = QuestionSetService.getQuestionSets();
                if (QuestionSetService.isUpdated) {
                    QuestionSetService.isUpdated = false;
                }
            } else {
                redirect();
            }

            return questionsSets;
        }

        function getQuestions(questionSetId) {
            if (!questions[questionSetId] || QuestionSetService.isUpdated || QuestionService.isUpdated) {
                questions[questionSetId] = QuestionService.getQuestions(questionSetId);

                if (QuestionService.isUpdated) {
                    QuestionService.isUpdated = false;
                }
                if(QuestionSetService.isUpdated){
                    QuestionSetService.isUpdated=false;
                }

            }
            return questions[questionSetId];
        }

        function getAnswers(questionId) {
            if (!answers[questionId] || QuestionService.isUpdated || AnswerService.isUpdated) {
                answers[questionId] = AnswerService.getAnswers(questionId);
                
                if(QuestionService.isUpdated){
                    QuestionService.isUpdated=false;
                }
                if(AnswerService.isUpdated){
                    AnswerService.isUpdated=false;
                }

            }

            return answers[questionId];
        }

        function getTopics() {
            if (topics.length === 0 || TopicService.isUpdated) {
                topics = TopicService.getTopics();
                if (TopicService.isUpdated) {
                    TopicService.isUpdated = false;
                }
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
