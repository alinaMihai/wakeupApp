(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('questionModal', questionModal);

    questionModal.$inject = ['ngAudio', 'ngAudioGlobals'];

    /* @ngInject */
    function questionModal(ngAudio, ngAudioGlobals) {
        ngAudioGlobals.unlock = false;
        var directive = {

            link: link,
            restrict: 'AE',
            templateUrl: 'app/questions/questionModal.html',
            transclude: true,
            scope: {
                repeatQs: "=",
                cindex: '=',
                processQuestion: '&'
            }

        };
        return directive;

        function link(scope, element, attrs) {

            scope.$watch('cindex', function(newValue, oldValue) {
                if (newValue >= 0 && newValue != oldValue) {
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
            $(element).children().first().css('display', 'block');
            var sound = ngAudio.load("assets/sounds/awareness.mp3");
            sound.play();

        }



    }

})();