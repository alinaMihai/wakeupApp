(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('refreshDir', refreshDir);

    refreshDir.$inject = ['$window', 'QuestionService'];

    /* @ngInject */
    function refreshDir($window, QuestionService) {

        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            $(window).on("beforeunload", function(e) {

                if (QuestionService.questionSetSession) {
                    QuestionService.questionSetSession = false;
                    return "Are you sure you want to refresh? Your Question Set Session will end";

                }
            });
            $(window).on('popstate', function() {
                if (QuestionService.questionSetSession) {
                    QuestionService.endSessionOnBackBtn = true;
                    scope.$apply();
                }

            });
        }
    }
})();