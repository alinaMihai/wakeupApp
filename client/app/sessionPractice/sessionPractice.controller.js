(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('SessionController', SessionController);

    SessionController.$inject = ['cached', 'QuestionService', '$timeout', 'PracticeSessionService',
        '$stateParams', '$state', 'logger', '$sessionStorage', 'QuoteService', '$window', 'AnswersFactory','CoreService'
    ];

    /* @ngInject */
    function SessionController(cached, QuestionService, $timeout, PracticeSessionService, $stateParams,
        $state, logger, $sessionStorage, QuoteService, $window, AnswersFactory,CoreService) {
        var vm = this;
        vm.startQuestionSet = startQuestionSet;
        vm.endQuestionSet = endQuestionSet;
        vm.isIE=CoreService.detectIE();
        vm.processQuestion = processQuestion;
        vm.practiceSessionService = PracticeSessionService;
        var questions, questionsNo, timer;
        var questionSetId = $stateParams.questionSetId;
        var indexedDbOpened = false;
        activate();

        ////////////////

        function activate() {
            cached.getQuestions(questionSetId).then(function(questionSet) {
                vm.questionSetQuestions = questionSet;
                questions = questionSet.questions;
                questionsNo = questions.length;
                logger.success("Question Set Session successfully started", {}, "Question Set Session");
                PracticeSessionService.questionSetSession = true;

                //is configuration in sessionStorage?
                PracticeSessionService.questionInterval = $sessionStorage.questionInterval ?
                    $sessionStorage.questionInterval : PracticeSessionService.questionInterval;
                PracticeSessionService.repeatQS = $sessionStorage.repeatQS ?
                    $sessionStorage.repeatQS : PracticeSessionService.repeatQS;
                PracticeSessionService.shuffleQuestions = $sessionStorage.shuffleQuestions ?
                    $sessionStorage.shuffleQuestions : PracticeSessionService.shuffleQuestions;

                if (PracticeSessionService.shuffleQuestions) {
                    questions = shuffle(questions);
                }
                PracticeSessionService.currentQuestionIndex = 0;
                PracticeSessionService.displayProgress = PracticeSessionService.currentQuestionIndex + 1 + "/" + questionsNo;
                vm.currentQuestion = questions[PracticeSessionService.currentQuestionIndex];
                if (vm.currentQuestion.quote) {
                    QuoteService.getQuote(vm.currentQuestion.quote).then(function(quote) {
                        vm.currentQuestion.quote = quote;
                    });
                }
            });
            AnswersFactory.openIndexedDb().then(function() {
                indexedDbOpened = true;
            });

        }

        function startQuestionSet() {
            PracticeSessionService.questionSetSession = true;
            logger.success("Question Set Session successfully started", {}, "Question Set Session");
            PracticeSessionService.currentQuestionIndex = 0;
            PracticeSessionService.displayProgress = PracticeSessionService.currentQuestionIndex + 1 + "/" + questionsNo;
            vm.currentQuestion = questions[PracticeSessionService.currentQuestionIndex];
        }

        function endQuestionSet() {
            PracticeSessionService.questionSetSession = false;
            PracticeSessionService.repeatQS = false;

            //remove any session configuration from sessionStorage
            delete $sessionStorage.questionInterval;
            delete $sessionStorage.repeatQS;
            delete $sessionStorage.shuffleQuestions;

            PracticeSessionService.currentQuestionIndex = undefined;
            logger.success("Question Set Session successfully ended", {}, "Question Set Session");
            PracticeSessionService.questionInterval = undefined;
            QuestionService.registerSession(questionSetId).then(function(questionSet) {
                QuestionService.isUpdated = true;
            }, function(err) {
                console.log(err);
            });
            $timeout(function() {
                $window.location.href = "/sessionDetails/" + questionSetId + "/" + vm.questionSetQuestions.name;
            }, 1000);

            if (timer) {
                $timeout.cancel(timer);
            }

        }

        function processQuestion(skipObj) {
            //save answer 
            if (!skipObj) {
                saveAnswer();
            }
            if (skipObj) {
                vm.currentAnswer = "";
            }
            //setTimeInterval for next question if any
            if (PracticeSessionService.currentQuestionIndex >= 0 &&
                PracticeSessionService.currentQuestionIndex < questionsNo - 1) {
                timer = $timeout(function() {
                    PracticeSessionService.currentQuestionIndex++;
                    PracticeSessionService.displayProgress = PracticeSessionService.currentQuestionIndex + 1 + "/" + questionsNo;
                    vm.currentQuestion = questions[PracticeSessionService.currentQuestionIndex];

                    if (vm.currentQuestion.quote && typeof vm.currentQuestion.quote !== 'object') {
                        QuoteService.getQuote(vm.currentQuestion.quote).then(function(quote) {
                            vm.currentQuestion.quote = quote;
                        });
                    }

                }, PracticeSessionService.questionInterval * 60 * 1000);
            } else {
                if (PracticeSessionService.repeatQS) {
                    PracticeSessionService.currentQuestionIndex = undefined;
                    timer = $timeout(function() {

                        startQuestionSet();

                    }, PracticeSessionService.questionInterval * 60 * 1000);

                } else {
                    endQuestionSet();
                }

            }

        }

        function saveAnswer() {
            var questionId = vm.currentQuestion._id;
            var answerText = vm.currentAnswer;
            if (answerText !== undefined && answerText.trim() !== "") {
                var today = new Date().getTime();
                var answer = {
                        questionId: questionId,
                        text: answerText,
                        date: today
                    }
                    //QuestionService.saveAnswer(answer);
                    //QuestionService.isUpdated = true;
               
                if (indexedDbOpened) {
                    AnswersFactory.saveAnswer(answer);
                    vm.currentAnswer = '';
                }
            }
        }

        function shuffle(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
    }
})();
