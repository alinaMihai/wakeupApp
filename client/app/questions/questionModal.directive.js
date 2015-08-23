(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('questionModal', questionModal);

    questionModal.$inject = ['ngAudio'];

    /* @ngInject */
    function questionModal(ngAudio) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            // bindToController: true,
            // controller: Controller,
            // controllerAs: 'vm',
            link: link,
            restrict: 'AE',
            templateUrl: 'app/questions/questionModal.html',
            transclude: true,
            scope: {

                cindex: '=',
                processQuestion: '&'
            }

        };
        return directive;

        function link(scope, element, attrs) {

            scope.$watch('cindex', function(newValue, oldValue) {
                if (newValue >= 0 && newValue != oldValue) {
                    $(element).children().first().css('display', 'block');
                    var sound = ngAudio.load("assets/sounds/awareness.mp3");
                    sound.play();
                }

            });
            $(element).find('button').on('click', function() {
                $(element).find('div').first().css('display', 'none');
                $(element).find('input').val(undefined);

            });

        }
    }

    /* @ngInject */
    /*
    function Controller() {

    }*/
})();