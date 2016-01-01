(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('AnswerCtrl', AnswerCtrl);

    AnswerCtrl.$inject = ['cached', 'question', 'AnswerService', '$uibModal', 'usSpinnerService'];

    /* @ngInject */
    function AnswerCtrl(cached, question, AnswerService, $uibModal, usSpinnerService) {
        var vm = this;
        vm.title = 'Answer  List';
        vm.question = question;
        vm.nextQuestionId = findNextQuestionId(question.questionSet, question._id);
        vm.prevQuestionId = findPreviousQuestionId(question.questionSet, question._id);
        vm.timeConverter = timeConverter;
        vm.deleteAnswer = deleteAnswer;
        vm.openEditAnswerModal = openEditAnswerModal;
        var questionId = question._id;

        activate();

        function activate() {
            cached.getAnswers(questionId).then(function(questionAnswers) {
                vm.questionAnswers = groupAnswersByDate(questionAnswers);
                usSpinnerService.stop('spinner-1');
            },function(err){
                usSpinnerService.stop('spinner-1');
                if (err.toLocaleLowerCase().replace(" ", '') === "notfound") {
                    $state.go('pageNotFound');
                }
            });
        }

        function deleteAnswer(answer) {

            var index = vm.questionAnswers.indexOf(answer);
            vm.questionAnswers.splice(index, 1);
            AnswerService.deleteAnswer(answer);
        }

        function groupAnswersByDate(answers) {
            var grouped_answers = answers.map(function(answer) {
                var theDay = timeConverter(answer.date);
                answer.theDay = theDay;
                return answer;

            });
            return grouped_answers;
        }

        function timeConverter(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();

            var time = date + ' ' + month + ' ' + year;
            return time;
        }

        function openEditAnswerModal(size, answerId) {

            var answer = findAnswerById(answerId);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/answers/editAnswerModal.html',
                size: size,
                controller: 'ModalInstanceCtrl as modalCtrl',
                resolve: {
                    data: function() {
                        return {
                            text: answer.text
                        };
                    }
                }
            });

            modalInstance.result.then(function(data) {
                debugger;
                var updatedObj = angular.extend(answer, data);

                updateAnswer(updatedObj);

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function updateAnswer(updatedObj) {
            AnswerService.editAnswer(updatedObj);
        }

        function findAnswerById(id) {
            return _.find(vm.questionAnswers, {
                '_id': id
            });
        }

        function findNextQuestionId(questionSet, currentQuestionId) {
            var indexCurrentQuestion = questionSet.questions.indexOf(currentQuestionId);
            var nextQuestionId = questionSet.questions[indexCurrentQuestion + 1];
            return nextQuestionId;
        }

        function findPreviousQuestionId(questionSet, currentQuestionId) {
            var indexCurrentQuestion = questionSet.questions.indexOf(currentQuestionId);
            var prevQuestionId = questionSet.questions[indexCurrentQuestion - 1];
            return prevQuestionId;
        }

    }
})();