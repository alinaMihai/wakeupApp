(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('myPopup', myPopup);

    // directive.$inject = ['dependencies'];

    /* @ngInject */
    function myPopup() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            //bindToController: true,
            //controller: Controller,
            //controllerAs: 'vm',
            link: link,
            restrict: 'AE',
            transclude: true,
            templateUrl: 'app/questions/popup.html'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    /* @ngInject */
    /*function Controller() {

    }*/
})();