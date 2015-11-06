(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('confirmClick', confirmClick);

    confirmClick.$inject = [];

    /* @ngInject */
    function confirmClick() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            priority: -1,
            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {


            element.bind('click', function(e) {
                var msg = attrs.confirmClick || "Are you sure";
                var clickAction = attrs.ngClick;
                if (window.confirm(msg)) {
                    scope.$eval(clickAction);
                }
                e.stopImmediatePropagation();
                e.preventDefault();
            });

        }
    }


})();