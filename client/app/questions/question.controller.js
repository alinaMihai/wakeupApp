(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionCtrl', QuestionCtrl);

    QuestionCtrl.$inject = ['cached', '$stateParams', 'QuestionService',
        '$uibModal', 'usSpinnerService', 'PracticeSessionService',
        '$state', '$scope', 'logger', 'QuestionSetService', 'CoreService'
    ];

    /* @ngInject */
    function QuestionCtrl(cached, $stateParams, QuestionService, $uibModal,
        usSpinnerService, PracticeSessionService, $state, $scope, logger, QuestionSetService, CoreService) {
        var vm = this;
        vm.title = 'Question  List';
        vm.addQuestionBool = false;
        vm.exportQuestions = [];
        vm.questionService = QuestionService;
        vm.startQuestionSet = startQuestionSet;
        vm.cancelAddQuestion = cancelAddQuestion;
        vm.hasErrorAddForm = hasErrorAddForm;
        vm.deleteQuestion = deleteQuestion;
        vm.openQuestionModal = openQuestionModal;
        vm.editQuestionSet = editQuestionSet;
        vm.deleteQuestionSet = deleteQuestionSet;
        var questionSetId = $stateParams.questionSetId;

        activate();


        function activate() {
            cached.getQuestions(questionSetId).then(function(questionSet) {
                vm.questionSetQuestions = questionSet;
                vm.exportQuestions = updateQuestionsToExport(vm.questionSetQuestions.questions);
                usSpinnerService.stop('spinner-1');
            }, function(err) {
                if (typeof err === "string" && err.toLocaleLowerCase().replace(" ", '') === "notfound") {
                    $state.go('pageNotFound');
                } else {
                    $state.go('login');
                }

            });
            $scope.$watch(function() {
                return vm.csvResult;
            }, function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal.length >= 1 && newVal[0] != '') {
                        QuestionService.importQuestions(vm.questionSetQuestions._id, newVal).then(function(questions) {
                            questions.forEach(function(question) {
                                vm.questionSetQuestions.questions.push(question);
                            });
                            vm.exportQuestions = updateQuestionsToExport(vm.questionSetQuestions.questions);
                        });
                        newVal = undefined;
                        vm.csvContent = undefined;
                        vm.showImport = false;
                    } else {
                        logger.error("Could not import questions");
                    }

                }
            });
        }

        function hasErrorAddForm() {
            return !vm.addQuestion.questionText.$valid && vm.addQuestion.questionText.$dirty;
        }

        function startQuestionSet() {
            PracticeSessionService.questionInterval = vm.questionInterval || 0;
            PracticeSessionService.repeatQS = vm.repeatQS;
            PracticeSessionService.shuffleQuestions = vm.shuffleQuestions;
            $state.go('practiceSession', {
                'questionSetId': questionSetId
            });
        }

        function addQuestion(question) {
            QuestionService.addQuestion(question).then(function(question) {
                vm.questionSetQuestions.questions.push(question);
                vm.exportQuestions = updateQuestionsToExport(vm.questionSetQuestions.questions);
            });
        }

        function cancelAddQuestion() {
            vm.addQuestionBool = !vm.addQuestionBool;
            vm.addQuestion.$setPristine();
            vm.questionText = undefined;
        }

        function deleteQuestion(question) {
            QuestionService.deleteQuestion(question).then(function() {
                var index = vm.questionSetQuestions.questions.indexOf(question);
                vm.questionSetQuestions.questions.splice(index, 1);
                vm.exportQuestions = updateQuestionsToExport(vm.questionSetQuestions.questions);
            });
        }

        function openQuestionModal(size, questionId) {
            var modalInstance;
            var emptyQuestion = {
                text: ""
            };
            var quotes;
            var topics;
            var questionHeading = questionId ? "Edit" : "Create";
            var question = angular.copy(findQuestionById(questionId)) || emptyQuestion;

            QuestionService.getUserQuotes().then(function(topics) {
                topics = topics;
                quotes = getQuotes(topics);
                if (!vm.questionSetQuestions.isDefault) {
                    var callback = function(data) {
                        var questionObj = {
                            text: data.text,
                            questionSet: vm.questionSetQuestions._id,
                            quote: data.quote
                        }
                        if (questionId) {
                            var updatedObj = angular.extend(question, questionObj);
                            updateQuestion(updatedObj);
                        } else {
                            var today = new Date().getTime();
                            questionObj.date = today;
                            addQuestion(questionObj);
                        }
                    };
                    CoreService.openModal({
                        text: question.text,
                        quote: question.quote,
                        quotes: quotes,
                        heading: questionHeading,
                        findTopicName: findTopicName(topics),
                        findQuoteText: findQuoteText(quotes)
                    }, 'app/questions/editQuestionModal.html', callback);
                }
            });
        }


        function updateQuestion(updatedObj) {
            vm.questionService.editQuestion(updatedObj).then(function(updatedQuestion) {
                angular.extend(findQuestionById(updatedQuestion._id), updatedQuestion);
            });
        }

        function findQuestionById(id) {
            return _.find(vm.questionSetQuestions.questions, {
                '_id': id
            });
        }

        function updateQuestionsToExport(questions) {
            var exportQuestions = questions.map(function(question) {
                return {
                    questionName: question.text
                };
            });
            return exportQuestions;
        }

        function editQuestionSet() {
            var data = {};
            data._id = vm.questionSetQuestions._id;
            data.name = vm.questionSetQuestions.name;
            data.impact = vm.questionSetQuestions.impact;
            data.description = vm.questionSetQuestions.description;
            data.questionSetHeading = "Edit";
            var template = "app/questionSets/editQuestionSetModal.html";
            var callback = function(data) {
                updateQuestionSet(data);
            };
            CoreService.openModal(data, template, callback);
        }

        function updateQuestionSet(updatedObj) {
            QuestionSetService.editQuestionSet(updatedObj).then(function(updateQs) {
                //delete questions because it returns only the ids, whereas the original has the objects
                delete updateQs.questions;
                _.merge(vm.questionSetQuestions, updateQs, vm.questionSetQuestions);
            });
        }

        function deleteQuestionSet() {
            QuestionSetService.deleteQuestionSet(vm.questionSetQuestions).then(function() {
                $state.go('questionSetList');
            });
        }

        // utility function question modal 

        function getQuotes(topics) {
            var quotes = [];
            topics.forEach(function(topic) {
                quotes = quotes.concat(topic.quoteList);
            });
            return quotes;
        }

        function findTopicName(topics) {
            return function(topicId) {
                var topic = _.find(topics, {
                    _id: topicId
                });

                return topic ? topic.title : "";
            }

        }

        function findQuoteText(quotes) {
            return function(quoteId) {
                var quote = _.find(quotes, {
                    _id: quoteId
                });
                return quote ? quote.text : "";
            }

        }

    }

})();
