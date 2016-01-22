
(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('MainCtrl', Controller);

    Controller.$inject = [];

    /* @ngInject */
    function Controller(dependencies) {
        var vm = this;
        vm.title = 'Controller';
        vm.myInterval=3000;
        vm.slides=[{
            id:2,
            'image':'/assets/images/feature2.png'
        },{
            id:7,
            'image':'/assets/images/feature7.png'
        },{
            id:5,
            'image':'/assets/images/feature5.png'
        },{
        	id:1,
        	'image':'/assets/images/feature1.png'
        },{
        	id:3,
        	'image':'/assets/images/feature3.png'
        },{
        	id:4,
        	'image':'/assets/images/feature4.png'
        },{
            id:9,
            'image':'/assets/images/feature9.png'
        },{
        	id:6,
        	'image':'/assets/images/feature6.png'
        },{
        	id:8,
        	'image':'/assets/images/feature8.png'
        }];
        activate();

        ////////////////

        function activate() {
        }
    }
})();