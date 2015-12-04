(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('confirmClick', confirmClick);

    confirmClick.$inject = ['$uibModal'];

    /* @ngInject */
    function confirmClick($uibModal) {
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
                var clickAction = attrs.ngClick;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/core/confirmDelete.html',
                    size: 'lg',
                    controller: 'ModalInstanceCtrl as modalCtrl',
                    resolve: {
                        data: {}
                    }
                });

                modalInstance.result.then(function() {
                    scope.$eval(clickAction);
                });

                e.stopImmediatePropagation();
                e.preventDefault();
            });

        }
    }


})();