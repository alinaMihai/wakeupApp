(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('CoreService', CoreService);

    CoreService.$inject = [];

    /* @ngInject */
    function CoreService() {
        this.isDelete = false;


    }
})();