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
                if (newValue >= 0) {
                    $(element).children().first().css('display', 'block');
                    var sound = ngAudio.load("sounds/mySound.mp3");
                }

            });
            $(element).find('button').on('click', function() {
                $(element).find('div').first().css('display', 'none');

            });

        }
    }

    /* @ngInject */
    /*
    function Controller() {

    }*/
})();