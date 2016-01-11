(function() {

    'use strict';

    var app = angular.module('wakeupApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ngStorage',
        'ngAudio',
        'angular.filter',
        'pasvaz.bindonce',
        'ui.bootstrap',
        'angularSpinner',
        'ngCsv',
        'ngCsvImport'
    ]);

    app.constant('toastr', toastr);
    app.constant('_', window._);
    app.config(toastrConfig);
    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-top-right';
    }

    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider','$logProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$logProvider) {
            $urlRouterProvider
                .otherwise('/');

            $locationProvider.html5Mode(true);
            $httpProvider.interceptors.push('authInterceptor');
            $logProvider.debugEnabled(false);
        }
    ]);

    app.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
        return {
            // Add authorization token to headers
            request: function(config) {
                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                    // remove any stale tokens
                    $cookieStore.remove('token');
                    return $q.reject(response);
                } else {
                    // $location.path('/login');
                    return $q.reject(response);
                }
            }
        };
    });

    app.run(function($rootScope, $location, Auth, cached) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function(event, next) {
            Auth.isLoggedInAsync(function(loggedIn) {
                if (next.authenticate && !loggedIn) {
                    event.preventDefault();
                    $location.path('/login');
                    cached.clear();
                }
            });
        });


    });


})();