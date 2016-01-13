(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('refreshDir', refreshDir);

    refreshDir.$inject = ['$window', 'PracticeSessionService', '$sessionStorage'];

    /* @ngInject */
    function refreshDir($window, PracticeSessionService, $sessionStorage) {

        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            $(window).on("beforeunload", function(e) {

                if (PracticeSessionService.questionSetSession) {
                   // return "Your configurations for this session will be lost";       
                }
            });
            $(window).on('popstate', function(e) {
                if (PracticeSessionService.questionSetSession) {
                    $sessionStorage.repeatQS = PracticeSessionService.repeatQS;
                    $sessionStorage.questionInterval = PracticeSessionService.questionInterval;
                    $sessionStorage.shuffleQuestions = PracticeSessionService.shuffleQuestions;
                    PracticeSessionService.questionSetSession=false;
                    /*location.reload();*/
                }
            });
        }
    }
})();
