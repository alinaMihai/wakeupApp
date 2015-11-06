(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('ModalInstanceCtrl', Controller);

    Controller.$inject = ['$scope', '$modalInstance', 'data'];

    /* @ngInject */
    function Controller($scope, $modalInstance, data) {
        var vm = this;
        vm.data = data;
        vm.ok = okHandler;
        vm.cancel = cancelHandler;

        function okHandler() {
            $modalInstance.close(data);
        }

        function cancelHandler() {
            $modalInstance.dismiss('cancel');
        }
    }

})();