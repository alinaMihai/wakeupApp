describe('QuestionCtrl as questionCtrl', function() {
    var questionCtrl, scope, cached, $q, questionSetQuestionsMock, $timeout, PracticeSessionService,$state;
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
        module('ngCsv',
            'ngCsvImport');

        //provide any mocks needed
        module(function($provide) {

            $provide.value('QuestionService', {
                addQuestion: function() {},
                deleteQuestion: function() {},
                editQuestion: function() {}
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
        });

        inject(function($controller, $rootScope, _cached_, _$q_, QuestionSetQuestions, $stateParams, _$timeout_, QuestionService, logger, $uibModal, _$state_,_PracticeSessionService_) {
            scope = $rootScope.$new();
            cached = _cached_;
            $timeout = _$timeout_;
            questionSetQuestionsMock = QuestionSetQuestions.QuestionSet1;
            PracticeSessionService=_PracticeSessionService_;
            $state=_$state_;
            $q = _$q_;
            spyOn($state, 'go').and.callFake(angular.noop);
            spyOn(cached, "getQuestions").and.callFake(fakeCallback);
            addQuestionSpy = spyOn(QuestionService, 'addQuestion').and.callFake(fakeCallback);
            deleteQuestionSpy = spyOn(QuestionService, 'deleteQuestion').and.callFake(fakeCallback);
            editQuestionSpy = spyOn(QuestionService, 'editQuestion').and.callFake(fakeCallback);

            questionCtrl = $controller("QuestionCtrl as questionCtrl", {
                'cached': cached,
                '$stateParams': $stateParams,
                '$timeout': $timeout,
                'QuestionService': QuestionService,
                'logger': logger,
                '$scope': scope,
                '$uibModal': $uibModal,
                'PracticeSessionService':PracticeSessionService

            });
            scope.$digest();
        });
    });

    it('should exist', function() {
        expect(!!questionCtrl).toBe(true);
    });

    describe('when created, it,', function() {
        it('should define a questionService property', function() {
            expect(scope.questionCtrl.questionService).toBeDefined();
            expect(scope.questionCtrl.questionService instanceof Object).toBe(true);
        });
        it('should expose a startQuestionSet method', function() {
            expect(typeof scope.questionCtrl.startQuestionSet).toBe('function');
        });
        it('should expose a saveQuestion method, used to create a question in the question set', function() {
            expect(typeof scope.questionCtrl.saveQuestion).toBe('function');
        });
        it('should expose a cancelAddQuestion used when the user cancels the creation of a question', function() {
            expect(typeof scope.questionCtrl.cancelAddQuestion).toBe('function');
        });
        it('should expose a hasErrorAddForm, used for addQuestion form styling ', function() {
            expect(typeof scope.questionCtrl.hasErrorAddForm).toBe('function');
        });
        it('should expose an addQuestionBool property, used for displaying the addQuestion form', function() {
            expect(scope.questionCtrl.addQuestionBool).toBe(false);
        });
        it('should expose a deleteQuestion method', function() {
            expect(typeof scope.questionCtrl.deleteQuestion).toBe('function');
        });
        it('should expose an openEditQuestionModal', function() {
            expect(typeof scope.questionCtrl.openEditQuestionModal).toBe('function');
        });

        it('should make a call to the cached service, getQuestions method', function() {
            expect(cached.getQuestions).toHaveBeenCalled();
        });
        it('should attach on the scope the questionSetQuestions object returned from the service', function() {
            expect(scope.questionCtrl.questionSetQuestions).toEqual(questionSetQuestionsMock);
        });

    });

    describe('when startQuestionSet method is called, it', function() {
        beforeEach(function() {
            scope.questionCtrl.questionInterval = 0.1;
            scope.questionCtrl.repeatQS = false;
            scope.questionCtrl.shuffleQuestions = false;
        });
        it('should set the questionInterval property of the PracticeSessionService to the one provided', function() {
            expect(PracticeSessionService.questionInterval).not.toBeDefined();
            scope.questionCtrl.startQuestionSet();
            expect(PracticeSessionService.questionInterval).toEqual(scope.questionCtrl.questionInterval);
        });
        it('should set repeatQS property of the PracticeSessionService to the one provided', function() {
            expect(PracticeSessionService.repeatQS).not.toBeDefined();
            scope.questionCtrl.startQuestionSet();
            expect(PracticeSessionService.repeatQS).toEqual(scope.questionCtrl.repeatQS);
        });
        it('should set the shuffleQuestions property of the PracticeSessionService to the one provided', function() {
            expect(PracticeSessionService.shuffleQuestions).not.toBeDefined();
            scope.questionCtrl.startQuestionSet();
            expect(PracticeSessionService.shuffleQuestions).toEqual(scope.questionCtrl.shuffleQuestions);
        });
        it('should redirect to the practiceSession page by calling $state.go', function() {
            scope.questionCtrl.startQuestionSet();
            expect($state.go).toHaveBeenCalled();
        });

    });
    describe('when saveQuestion is called, it', function() {
        it('should call addQuestion method of the QuestionService', function() {
            var expectedQuestionsNo = scope.questionCtrl.questionSetQuestions.questions.length + 1;
            scope.questionCtrl.addQuestion = {
                $setPristine: function() {}
            };
            scope.questionCtrl.questionText = 'test';
            scope.questionCtrl.saveQuestion();
            scope.$digest();
            expect(addQuestionSpy).toHaveBeenCalled();
            expect(scope.questionCtrl.questionSetQuestions.questions.length).toEqual(expectedQuestionsNo);
        });

    });

    describe('when deleteQuestion is called, it', function() {
        it('should call deleteQuestion method of the QuestionService', function() {
            var question = questionSetQuestionsMock.questions[0];
            var expectedQuestionsNo = scope.questionCtrl.questionSetQuestions.questions.length - 1;
            scope.questionCtrl.deleteQuestion(question);

            scope.$digest();

            expect(deleteQuestionSpy).toHaveBeenCalled();
            expect(scope.questionCtrl.questionSetQuestions.questions.length).toEqual(expectedQuestionsNo);

        });
    });

});
