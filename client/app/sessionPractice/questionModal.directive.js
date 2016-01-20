(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('questionModal', questionModal);

    questionModal.$inject = ['ngAudio', 'ngAudioGlobals','PracticeSessionService'];

    /* @ngInject */
    function questionModal(ngAudio, ngAudioGlobals,PracticeSessionService) {
        ngAudioGlobals.unlock = false;
        var directive = {

            link: link,
            restrict: 'AE',
            templateUrl: 'app/sessionPractice/questionModal.html',
            transclude: true,
            scope: {
                repeatQs: "=",
                cindex: '=',
                processQuestion: '&'
            }

        };
        return directive;

        function link(scope, element, attrs) {
              var callback = scope.processQuestion();
            scope.processQuestion = function(skip) {
                callback(skip);
            }

            scope.$watch('cindex', function(newValue, oldValue) {
                if (newValue >= 0) {
                    showQuestion(element);
                } else if (newValue == oldValue && scope.repeatQs) {
                    showQuestion(element);
                }

            });
            $(element).find('button').on('click', function() {
                $(element).find('div').first().css('display', 'none');
                $(element).find('input').val(undefined);

            });

        }

        function showQuestion(element) {
            $(element).find('.currentQuestionText span').html(PracticeSessionService.displayProgress);
            $(element).children().first().css('display', 'block');
            var sound = ngAudio.load("assets/sounds/Bell-ding.mp3");
            sound.play();

        }



    }

})();
