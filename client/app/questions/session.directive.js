(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('sessionDir', sessionDir);

    function sessionDir() {
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/questions/sessionConfig.html'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }
})();