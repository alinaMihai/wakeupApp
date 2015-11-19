describe('Directive:refreshDir', function() {

    var directiveElem, compile, scope, $window, message;

    function createDirective(template) {
        var elm, QuestionService;
        elm = compile(template)(scope);

        scope.$apply();

        return elm;
    }

    beforeEach(function() {
        module('wakeupApp');

        module(function($provide) {
            $provide.value('QuestionService', {
                questionSetSession: false,
                endSessionOnBackBtn: false
            });
        });
        inject(function($rootScope, $compile, _$window_, _QuestionService_) {
            scope = $rootScope.$new();
            compile = $compile;
            $window = _$window_;
            QuestionService = _QuestionService_;
            spyOn($window, 'onbeforeunload').and.callFake(function(e) {
                message = e.result;
            });

        });

        directiveElem = createDirective('<div refresh-dir></div>');


    });

    describe('when created, it', function() {
        xit('should return a confirmation message before refreshing the page during a session', function() {
            QuestionService.questionSetSession = true;
            scope.$digest();
            $(window).trigger('beforeunload');
            scope.$digest();
            expect(message).toBe("Are you sure you want to refresh? Your Question Set Session will end");
        });
        it('should set endSessionOnBackBtn property of QuestionService to true when a session is active', function() {

            expect(QuestionService.endSessionOnBackBtn).toBe(false);
            QuestionService.questionSetSession = true;
            scope.$digest();
            $(window).trigger('popstate');
            scope.$digest();
            expect(QuestionService.endSessionOnBackBtn).toBe(true);

            //prevent the popup from displaying while refreshing the suit tests
            QuestionService.questionSetSession = false;
            scope.$digest();

        });
    });

});