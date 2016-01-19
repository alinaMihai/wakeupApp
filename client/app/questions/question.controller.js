(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuestionCtrl', QuestionCtrl);

    QuestionCtrl.$inject = ['cached', '$stateParams', 'QuestionService', '$uibModal', 'usSpinnerService', 'PracticeSessionService', '$state', '$scope', 'logger'];

    /* @ngInject */
    function QuestionCtrl(cached, $stateParams, QuestionService, $uibModal, usSpinnerService, PracticeSessionService, $state, $scope, logger) {
        var vm = this;
        vm.title = 'Question  List';

        vm.addQuestionBool = false;
        vm.exportQuestions = [];

        vm.questionService = QuestionService;

        vm.startQuestionSet = startQuestionSet;

        /* vm.saveQuestion = saveQuestion;*/
        vm.cancelAddQuestion = cancelAddQuestion;
        vm.hasErrorAddForm = hasErrorAddForm;

        vm.deleteQuestion = deleteQuestion;
        vm.openQuestionModal = openQuestionModal;

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
                    modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/questions/editQuestionModal.html',
                        size: size,
                        controller: 'ModalInstanceCtrl as modalCtrl',
                        resolve: {
                            data: function() {
                                return {
                                    text: question.text,
                                    quote:question.quote,
                                    quotes: quotes,
                                    heading: questionHeading,
                                    findTopicName: findTopicName,
                                    findQuoteText: findQuoteText
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function(data) {
                        if (questionId) {
                            var quoteObj = {
                                text: data.text,
                                quote:data.quote,
                                questionSet: vm.questionSetQuestions._id,
                            };
                            var updatedObj = angular.extend(question, quoteObj);
                            updateQuestion(updatedObj);
                        } else {
                            var today = new Date().getTime();
                            var questionObj = {
                                text: data.text,
                                quote:data.quote,
                                questionSet: vm.questionSetQuestions._id,
                                date: today
                            };
                            addQuestion(questionObj);
                        }
                    }, function() {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                }

                function getQuotes(topics) {
                    var quotes = [];
                    topics.forEach(function(topic) {
                        quotes = quotes.concat(topic.quoteList);
                    });
                    return quotes;
                }

                function findTopicName(topicId) {
                    var topic = _.find(topics, {
                        _id: topicId
                    });

                    return topic ? topic.title : "";
                }

                function findQuoteText(quoteId) {
                    var quote = _.find(quotes, {
                        _id: quoteId
                    });
                    return quote ? quote.text : "";
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
    }

})();
