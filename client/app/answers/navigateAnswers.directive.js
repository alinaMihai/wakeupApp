(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('navigateArrows', directive);

    directive.$inject = ['$state'];

    /* @ngInject */
    function directive($state) {
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                prevId: '=',
                nextId: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            $('html').keydown(function(e) {
                switch (e.which) {
                    //right arrow
                    case 39:
                        {
                            if (scope.nextId) {
                                $state.go('answerList', {
                                    'questionId': scope.nextId
                                });
                            }

                            break;
                        }
                    //left arrow    
                    case 37:
                        {
                            if (scope.prevId) {
                                $state.go('answerList', {
                                    'questionId': scope.prevId
                                });
                            }

                            break;
                        }
                }
            });
            scope.$on(
                "$destroy",
                function handleDestroyEvent() {
                    $('html').off('keydown');
                }
            );
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();
