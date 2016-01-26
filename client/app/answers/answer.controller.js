(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('AnswerCtrl', AnswerCtrl);

    AnswerCtrl.$inject = ['cached', 'question', 'AnswerService', '$uibModal', 'usSpinnerService', 'CoreService', 'AnswersFactory', '$q'];

    /* @ngInject */
    function AnswerCtrl(cached, question, AnswerService, $uibModal, usSpinnerService, CoreService, AnswersFactory, $q) {
        var vm = this;
        vm.title = 'Answer  List';
        vm.question = question;
        var indexCurrentQuestion;

        vm.deleteAnswer = deleteAnswer;
        vm.deleteAllAnswers = deleteAllAnswers;
        vm.openEditAnswerModal = openEditAnswerModal;
        var questionId = question._id;
        vm.indexedDbAnswers = [];

        activate();

        function activate() {
            indexCurrentQuestion = question.questionSet.questions.indexOf(question._id);
            vm.questionText = (indexCurrentQuestion + 1) + ". " + question.text;
            vm.nextQuestionId = findNextQuestionId(question.questionSet, question._id);
            vm.prevQuestionId = findPreviousQuestionId(question.questionSet, question._id);

            var indexedDbAnswers;
            var mongodbAnswers = cached.getAnswers(questionId);

            AnswersFactory.openIndexedDb().then(function() {
                indexedDbAnswers = AnswersFactory.getAnswers(questionId);

                $q.all([mongodbAnswers, indexedDbAnswers]).then(function(data) {

                    usSpinnerService.stop('spinner-1');
                    var answers = data[0].concat(data[1]);
                    vm.questionAnswers = CoreService.groupArrayObjectsByDate(answers);

                }, function(err) {
                    if (err.toLowerCase().replace(" ", '') === "notfound") {
                        $state.go('pageNotFound');
                    }
                    usSpinnerService.stop('spinner-1');
                });
            });


        }

        function deleteAnswer(answer) {
            if (answer.local) {
                AnswersFactory.deleteAnswer(answer._id);
            } else {
                AnswerService.deleteAnswer(answer);
            }
            var index = vm.questionAnswers.indexOf(answer);
            vm.questionAnswers.splice(index, 1);

        }

        function deleteAllAnswers() {
            var deleteMongoDbAnswers = AnswerService.deleteAllAnswers(vm.question._id);
            var deleteIndexedDbAnswers = AnswersFactory.deleteAllAnswers(vm.question._id);
            $q.all([deleteMongoDbAnswers, deleteIndexedDbAnswers]).then(function(response) {
                vm.questionAnswers = [];
            });
        }

        function openEditAnswerModal(size, answerId) {
            var emptyAnswer = {
                text: ""
            };
            var answerHeading = answerId ? "Edit" : "Add";
            var answer = findAnswerById(answerId) || emptyAnswer;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/answers/editAnswerModal.html',
                size: size,
                controller: 'ModalInstanceCtrl as modalCtrl',
                resolve: {
                    data: function() {
                        return {
                            text: answer.text,
                            question: vm.question.text,
                            answerHeading: answerHeading
                        };
                    }
                }
            });
            AnswerService.isModalOpened = true;

            modalInstance.result.then(function(data) {

                if (answerId) {
                    var updatedObj = angular.copy(angular.extend(answer, {
                        text: data.text
                    }));
                    updateAnswer(updatedObj);
                } else {
                    saveAnswer(data.text);
                }

                AnswerService.isModalOpened = false;
            }, function() {
                AnswerService.isModalOpened = false;
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function updateAnswer(updatedObj) {
            if (updatedObj.local) {
                AnswersFactory.updateAnswer(updatedObj);
            } else {
                AnswerService.editAnswer(updatedObj);
            }

        }

        function saveAnswer(text) {
            var today = new Date().getTime();
            var answer = {
                questionId: vm.question._id,
                text: text,
                date: today
            }
            AnswersFactory.saveAnswer(answer).then(function(answer) {
                answer.theDay="now";
                vm.questionAnswers.push(answer);
            });
        }

        function findAnswerById(id) {
            return _.find(vm.questionAnswers, {
                '_id': id
            });
        }

        function findNextQuestionId(questionSet, currentQuestionId) {
            // var indexCurrentQuestion = questionSet.questions.indexOf(currentQuestionId);
            var nextQuestionId = questionSet.questions[indexCurrentQuestion + 1];
            return nextQuestionId;
        }

        function findPreviousQuestionId(questionSet, currentQuestionId) {
            //var indexCurrentQuestion = questionSet.questions.indexOf(currentQuestionId);
            var prevQuestionId = questionSet.questions[indexCurrentQuestion - 1];
            return prevQuestionId;
        }

    }
})();
