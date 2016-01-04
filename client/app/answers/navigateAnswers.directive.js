(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .directive('navigateArrows', directive);

    directive.$inject = ['$state', 'AnswerService'];

    /* @ngInject */
    function directive($state, AnswerService) {
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
            $('html').keydown(handleArrowNavigation);

            scope.$watch(function() {
                return AnswerService.isModalOpened;
            }, function(newVal, oldVal) {
                if (newVal !== oldVal && newVal === true) {
                    $('html').off('keydown');
                } else if (newVal !== oldVal && newVal === false) {
                    $('html').keydown(handleArrowNavigation);
                }

            });

            scope.$on(
                "$destroy",
                function handleDestroyEvent() {
                    $('html').off('keydown');
                }
            );

            function handleArrowNavigation(e) {
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
            }


        }


    }



})();
