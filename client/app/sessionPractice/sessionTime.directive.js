(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('sessionTime', sessionTime);

    sessionTime.$inject = ['$timeout', 'PracticeSessionService'];

    /* @ngInject */
    function sessionTime($timeout, PracticeSessionService) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {
            var elapsedMinutes = 0;
            var timeCount;
            scope.$watch(function() {
                return PracticeSessionService.questionSetSession
            }, function(newVal, oldVal) {
                if (newVal === true) {
                    timeCount = setInterval(function() {
                        elapsedMinutes++;
                    }, 60000);
                } else {
                    if (newVal !== oldVal && newVal === false) {
                        window.clearInterval(timeCount);
                    }
                }
            });

            $(element).hover(function() {
                $(this).find('.timeDisplay').html(elapsedMinutes + " m");
                $(this).find('.clockDisplay').html(displayClock());
            }, function() {
                $(this).find('.timeDisplay').html('');
                $(this).find('.clockDisplay').html('');
            });
        }

        function displayClock() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            if(m<10){
                m="0"+m;
            }
            return h+":"+m;
        }
    }

})();
