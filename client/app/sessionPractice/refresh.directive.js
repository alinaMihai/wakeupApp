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
                    //store in localstorage the session configuration
                    $sessionStorage.repeatQS = PracticeSessionService.repeatQS;
                    $sessionStorage.questionInterval = PracticeSessionService.questionInterval;


                }
            });
            $(window).on('popstate', function(e) {
                if (PracticeSessionService.questionSetSession) {
                    $sessionStorage.repeatQS = PracticeSessionService.repeatQS;
                    $sessionStorage.questionInterval = PracticeSessionService.questionInterval;
                }
            });
        }
    }
})();
