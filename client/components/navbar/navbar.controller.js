(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('NavbarCtrl', NavbarCtrl);

    NavbarCtrl.$inject = ['$location', 'Auth'];

    /* @ngInject */
    function NavbarCtrl($location, Auth) {
        var vm = this;
        vm.menu = [{
            'title': 'Home',
            'state': 'main'
        }, {
            'title': 'Question Sets',
            'state': 'questionSetList'
        }, {
            'title': 'Topics',
            'state': 'topicsList'
        }];

        vm.isCollapsed = true;
        vm.isLoggedIn = Auth.isLoggedIn;
        vm.isAdmin = Auth.isAdmin;
        vm.getCurrentUser = Auth.getCurrentUser;

        vm.logout = function() {
            Auth.logout();
            $location.path('/login');
        };

        vm.isActive = function(route) {
            return route === $location.path();
        };

    }
})();