(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('refreshDir', refreshDir);

    refreshDir.$inject = ['$window', 'QuestionService', 'logger'];

    /* @ngInject */
    function refreshDir($window, QuestionService, logger) {
        // Usage:
        //
        // Creates:
        //
        var directive = {

            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            $(window).on("beforeunload", function(e) {

                if (QuestionService.questionSetSession) {
                    return "Are you sure you want to refresh? Your Question Set Session will be lost";

                }
            });
            window.onpopstate = function() {
                if (QuestionService.questionSetSession) {
                    QuestionService.endSessionOnBackBtn = true;
                    scope.$apply();
                }

            };
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();