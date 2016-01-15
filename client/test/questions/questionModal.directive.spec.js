describe('Directive: questionModal', function() {
    var directiveElem, scope, isolatedScope, compile, defaultData,
        validTemplate = '<question-modal repeat-qs="questionCtrl.questionService.repeatQS" ' +
        'cindex="questionCtrl.questionService.currentQuestionIndex" process-question="questionCtrl.processQuestion()">' +
        '<label for="currentAnswer"><p>{{questionCtrl.currentQuestion.text}}</p>' +
        '<textarea id="answerTextArea" type="text"  id="currentAnswer" ng-model=questionCtrl.currentAnswer ></textarea></label></question-modal>';

    function createDirective(data, template) {
        var elm;
        scope.questionCtrl = data || defaultData;

        elm = compile(template || validTemplate)(scope);

        //trigger watcher
        scope.$apply();

        return elm;
    }

    beforeEach(function() {
        module('wakeupApp', 'wakeupTemplates');


        defaultData = {
            questionService: {
                questionSetSession: true,
                repeatQS: false,
                currentQuestionIndex: undefined
            },
            processQuestion: function() {},
            currentQuestion: {
                text: 'question1'
            },
            currentAnswer: ''
        };

        //provide any mocks needed
        module(function($provide) {
            $provide.value('ngAudio', {
                load: function() {
                    return {
                        play: function() {}
                    };
                }
            });
        });

        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;
        });
        directiveElem = createDirective();
        scope.$digest();
        isolatedScope = directiveElem.isolateScope();

    });

    describe('when created, it', function() {
        it('should have applied template', function() {
            expect(directiveElem.html()).not.toEqual('');
        });
        it('should have repeatQs property set to false', function() {
            expect(isolatedScope.repeatQs).toBe(false);
        });
        it('should have processQuestion method set', function() {
            expect(typeof isolatedScope.processQuestion).toBe('function');
        });

        it('should have an ng-transclude directive in it', function() {
            var transculdeElem = directiveElem.find('ng-transclude');
            expect(transculdeElem.length).toBe(1);
        });
        it('should have transclude content', function() {
            var answerBox = directiveElem.find('label[for="currentAnswer"]');
            expect(answerBox.length).toBe(1);
            expect(answerBox.children().length).toBe(2);
            expect(answerBox.find('p').text()).toEqual(scope.questionCtrl.currentQuestion.text);
            expect(answerBox.find('textarea').length).toBe(1);
        });

        describe('link function, it', function() {
            it('should have a form element', function() {
                var formElem = directiveElem.find('form[name="answerForm"]');
                expect(formElem.length).toBe(1);
            });
            it('should have the parent div with display none', function() {
                var parentBlock = directiveElem.find('div').first();
                expect(parentBlock.css('display')).toEqual('none');
            });

            it('should change display to block for parent element when cindex property changes', function() {
                var parentBlock = directiveElem.find('div').first();
                expect(parentBlock.css('display')).toEqual('none');
                scope.questionCtrl.questionService.currentQuestionIndex = 0;
                scope.$digest();
                expect(parentBlock.css('display')).toEqual('block');

            });
            it('should change display to none for parent element when button clicked', function() {
                var parentBlock = directiveElem.find('div').first();
                scope.questionCtrl.questionService.currentQuestionIndex = 1;
                scope.$digest();
                expect(parentBlock.css('display')).toEqual('block');
                directiveElem.find('button').triggerHandler('click');
                scope.$digest();
                expect(parentBlock.css('display')).toEqual('none');
            });
        });
    });

});