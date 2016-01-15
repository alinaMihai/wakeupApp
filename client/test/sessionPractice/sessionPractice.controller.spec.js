describe('SessionController as vm', function() {
    var SessionController, scope, cached, $q, questionSetQuestionsMock, $timeout,PracticeSessionService,$window,$httpBackend;
    var saveAnswerSpy, addQuestionSpy, deleteQuestionSpy, editQuestionSpy;

    function fakeCallback() {
        var deferred = $q.defer();
        deferred.resolve(questionSetQuestionsMock);
        return deferred.promise;
    }

    //Initialize the controller and scope
    beforeEach(function() {
        //Load the controller's module
        module('wakeupApp');
        module('wakeupApp.mocks');

        //provide any mocks needed
        module(function($provide) {

            $provide.value('QuestionService', {
                saveAnswer: function() {},
                registerSession:function(){},
                isUpdated:undefined
            });
            $provide.value('logger', {
                success: function(message) {
                    console.log(message);
                }
            });
             $provide.value('PracticeSessionService', {
                questionInterval: undefined,
                repeatQS: undefined,
                shuffleQuestions: undefined
            });
             $provide.value('$window',{
                location:{href:''}
             });
        });

        inject(function($controller, $rootScope, _cached_, _$q_, QuestionSetQuestions, $stateParams, _$timeout_,
         QuestionService, logger, $uibModal,_PracticeSessionService_,_$window_,_$httpBackend_) {
            scope = $rootScope.$new();
            cached = _cached_;
            $timeout = _$timeout_;
            $window=_$window_;
            $httpBackend=_$httpBackend_;
            questionSetQuestionsMock = QuestionSetQuestions.QuestionSet1;
            $q = _$q_;
            PracticeSessionService=_PracticeSessionService_;
            spyOn(cached, "getQuestions").and.callFake(fakeCallback);
            spyOn(QuestionService,'registerSession').and.callFake(angular.noop);
            spyOn($window.location,'href').and.callFake(angular.noop);
            saveAnswerSpy = spyOn(QuestionService, 'saveAnswer').and.callFake(fakeCallback);
        
            SessionController = $controller("SessionController as vm", {
                'cached': cached,
                '$stateParams': $stateParams,
                '$timeout': $timeout,
                'QuestionService': QuestionService,
                'logger': logger,
                '$scope': scope,
                '$uibModal': $uibModal,
                'PracticeSessionService':_PracticeSessionService_,
                '$window':$window

            });
            PracticeSessionService.questionInterval=0;
            scope.$digest();
        });
    });

    it('should exist', function() {
        expect(!!SessionController).toBe(true);
    });

    describe('when created, it,', function() {
        it('should expose a property practiceSessionService method', function() {
            expect(typeof scope.vm.practiceSessionService).toBeDefined();
        });
        it('should expose a startQuestionSet method', function() {
            expect(typeof scope.vm.startQuestionSet).toBe('function');
        });
        it('should expose an endQuestionSet', function() {
            expect(typeof scope.vm.endQuestionSet).toBe('function');
        });
        it('should expose a processQuestion method used during a session to advance to next question', function() {
            expect(typeof scope.vm.processQuestion).toBe('function');
        });
        
        it('should make a call to the cached service, getQuestions method', function() {
            expect(cached.getQuestions).toHaveBeenCalled();
        });
        it('should attach on the scope the questionSetQuestions object returned from the service', function() {
            expect(scope.vm.questionSetQuestions).toEqual(questionSetQuestionsMock);
        });

    });

    describe('when startQuestionSet method is called, it', function() {

        it('should set the questionSetSession property of the PracticeSessionService to true', function() {
            scope.vm.startQuestionSet();
            scope.vm.endQuestionSet();
            expect(PracticeSessionService.questionSetSession).toBe(false);
            scope.vm.startQuestionSet();
            expect(PracticeSessionService.questionSetSession).toBe(true);
        });
        it('should set currentQuestionIndex property of the PracticeSessionService to 0', function() {
            scope.vm.startQuestionSet();
            expect(PracticeSessionService.currentQuestionIndex).toEqual(0);

        });
        it('should set the currentQuestion property of the controller to the first question in the set', function() {
            var expectedQuestion = questionSetQuestionsMock.questions[0];
            scope.vm.startQuestionSet();
            expect(scope.vm.currentQuestion).toEqual(expectedQuestion);
        });

    });

    describe('when endQuestionSet method is called, it', function() {
        it('should set the questionSetSession property of the PracticeSessionService to false', function() {
            scope.vm.startQuestionSet();
            expect(PracticeSessionService.questionSetSession).toBe(true);
            scope.vm.endQuestionSet();
            expect(PracticeSessionService.questionSetSession).toBe(false);
        });
        it('should reset the repeatQS property of the PracticeSessionService to false', function() {
            scope.vm.startQuestionSet();
            scope.vm.endQuestionSet();
            expect(PracticeSessionService.repeatQS).toBe(false);
        });
        it('should reset the currentQuestionIndex of the PracticeSessionService to undefined', function() {
            scope.vm.startQuestionSet();
            expect(PracticeSessionService.currentQuestionIndex).toBeDefined();
            scope.vm.endQuestionSet();
            expect(PracticeSessionService.currentQuestionIndex).not.toBeDefined();
        });
        it('should reset the questionInterval of the PracticeSessionService to undefined', function() {
            PracticeSessionService.questionInterval = 0.5;
            scope.vm.startQuestionSet();
            expect(PracticeSessionService.questionInterval).toBeDefined();
            scope.vm.endQuestionSet();
            expect(PracticeSessionService.questionInterval).not.toBeDefined();
        });
    });

    describe('when processQuestion method is called, it', function() {
        beforeEach(function(){
            $httpBackend.when('GET', 'app/main/main.html').respond('');
        });
        it('should increment currentQuestionIndex and change currentQuestion from the first to the second question', function() {
            var expectedQuestion = questionSetQuestionsMock.questions[1];
            scope.vm.startQuestionSet();
            expect(PracticeSessionService.currentQuestionIndex).toEqual(0);
            expect(scope.vm.currentQuestion).toEqual(questionSetQuestionsMock.questions[0]);
            scope.vm.processQuestion();
            $timeout.flush(2000);
            expect(PracticeSessionService.currentQuestionIndex).toEqual(1);
            expect(scope.vm.currentQuestion).toEqual(expectedQuestion);
        });

        it('should make a call to the saveAnswer method of the QuestionService', function() {
            scope.vm.startQuestionSet();
            scope.vm.currentAnswer = "test";
            scope.vm.processQuestion();
         
            expect(saveAnswerSpy).toHaveBeenCalled();
        });

        describe('when the last question is passed, it', function() {
            it('should end the question set', function() {
                scope.vm.startQuestionSet();
                expect(PracticeSessionService.questionSetSession).toEqual(true);
                scope.vm.processQuestion();

                PracticeSessionService.currentQuestionIndex = questionSetQuestionsMock.questions.length - 1;
                scope.vm.processQuestion();
                $timeout.flush(1000);

                expect(PracticeSessionService.questionSetSession).toEqual(false);
            });
        });
        describe('when the last question is passed and the repeatQS is set, it', function() {

            it('should start the question set from index zero again', function() {
                PracticeSessionService.questionInterval=0;
                scope.vm.startQuestionSet();
                scope.vm.processQuestion();

                PracticeSessionService.currentQuestionIndex = questionSetQuestionsMock.questions.length - 1;
                PracticeSessionService.repeatQS = true;
                scope.vm.processQuestion();
                $timeout.flush(2000);

                expect(PracticeSessionService.currentQuestionIndex).toEqual(0);

            });

        });

    });
});
