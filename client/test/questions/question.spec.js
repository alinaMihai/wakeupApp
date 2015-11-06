describe('QuestionCtrl as questionCtrl', function() {
    var questionCtrl, scope, cached, $q, questionSetQuestionsMock, $timeout;
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
                addQuestion: function() {},
                deleteQuestion: function() {},
                editQuestion: function() {}
            });
            $provide.value('logger', {
                success: function(message) {
                    console.log(message);
                }
            })
        });

        inject(function($controller, $rootScope, _cached_, _$q_, QuestionSetQuestions, $stateParams, _$timeout_, QuestionService, logger, $uibModal) {
            scope = $rootScope.$new();
            cached = _cached_;
            $timeout = _$timeout_;
            questionSetQuestionsMock = QuestionSetQuestions.QuestionSet1;
            $q = _$q_;

            spyOn(cached, "getQuestions").and.callFake(fakeCallback);
            saveAnswerSpy = spyOn(QuestionService, 'saveAnswer').and.callFake(fakeCallback);
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
                '$uibModal': $uibModal

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
        it('should define a currentQuestion property used to hold the current question in the session', function() {
            expect(scope.questionCtrl.currentQuestion).toBe(null);
        });
        it('should expose a startQuestionSet method', function() {
            expect(typeof scope.questionCtrl.startQuestionSet).toBe('function');
        });
        it('should expose an endQuestionSet', function() {
            expect(typeof scope.questionCtrl.endQuestionSet).toBe('function');
        });
        it('should expose a processQuestion method used during a session to advance to next question', function() {
            expect(typeof scope.questionCtrl.processQuestion).toBe('function');
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

        it('should set the questionSetSession property of the questionService to true', function() {
            expect(scope.questionCtrl.questionService.questionSetSession).not.toBeDefined();
            scope.questionCtrl.startQuestionSet();
            expect(scope.questionCtrl.questionService.questionSetSession).toBe(true);
        });
        it('should set currentQuestionIndex property of the questionService to 0', function() {
            expect(scope.questionCtrl.questionService.currentQuestionIndex).not.toBeDefined();
            scope.questionCtrl.startQuestionSet();
            expect(scope.questionCtrl.questionService.currentQuestionIndex).toEqual(0);

        });
        it('should set the currentQuestion property of the controller to the first question in the set', function() {
            var expectedQuestion = questionSetQuestionsMock.questions[0];
            expect(scope.questionCtrl.currentQuestion).toBe(null);
            scope.questionCtrl.startQuestionSet();
            expect(scope.questionCtrl.currentQuestion).toEqual(expectedQuestion);
        });

    });

    describe('when endQuestionSet method is called, it', function() {
        it('should set the questionSetSession property of the questionService to false', function() {
            scope.questionCtrl.startQuestionSet();
            expect(scope.questionCtrl.questionService.questionSetSession).toBe(true);
            scope.questionCtrl.endQuestionSet();
            expect(scope.questionCtrl.questionService.questionSetSession).toBe(false);
        });
        it('should reset the repeatQS property of the questionService to false', function() {
            scope.questionCtrl.startQuestionSet();
            scope.questionCtrl.endQuestionSet();
            expect(scope.questionCtrl.questionService.repeatQS).toBe(false);
        });
        it('should reset the currentQuestionIndex of the QuestionService to undefined', function() {
            scope.questionCtrl.startQuestionSet();
            expect(scope.questionCtrl.questionService.currentQuestionIndex).toBeDefined();
            scope.questionCtrl.endQuestionSet();
            expect(scope.questionCtrl.questionService.currentQuestionIndex).not.toBeDefined();
        });
        it('should reset the questionInterval of the controller to undefined', function() {
            scope.questionCtrl.questionInterval = 0.5;
            scope.questionCtrl.startQuestionSet();
            expect(scope.questionCtrl.questionInterval).toBeDefined();
            scope.questionCtrl.endQuestionSet();
            expect(scope.questionCtrl.questionInterval).not.toBeDefined();
        });
    });

    describe('when processQuestion method is called, it', function() {
        it('should increment currentQuestionIndex and change currentQuestion from the first to the second question', function() {
            var expectedQuestion = questionSetQuestionsMock.questions[1];
            scope.questionCtrl.startQuestionSet();
            expect(scope.questionCtrl.questionService.currentQuestionIndex).toEqual(0);
            expect(scope.questionCtrl.currentQuestion).toEqual(questionSetQuestionsMock.questions[0]);
            scope.questionCtrl.processQuestion();
            $timeout.flush();
            expect(scope.questionCtrl.questionService.currentQuestionIndex).toEqual(1);
            expect(scope.questionCtrl.currentQuestion).toEqual(expectedQuestion);
        });

        it('should make a call to the saveAnswer method of the QuestionService', function() {
            scope.questionCtrl.startQuestionSet();
            scope.questionCtrl.currentAnswer = "test";
            scope.questionCtrl.processQuestion();
            $timeout.flush();
            expect(saveAnswerSpy).toHaveBeenCalled();
        });

        describe('when the last question is passed, it', function() {
            it('should end the question set', function() {
                scope.questionCtrl.startQuestionSet();
                expect(scope.questionCtrl.questionService.questionSetSession).toEqual(true);
                scope.questionCtrl.processQuestion();

                scope.questionCtrl.questionService.currentQuestionIndex = questionSetQuestionsMock.questions.length - 1;
                scope.questionCtrl.processQuestion();

                $timeout.flush();
                expect(scope.questionCtrl.questionService.questionSetSession).toEqual(false);
            });
        });
        describe('when the last question is passed and the repeatQS is set, it', function() {

            it('should start the question set from index zero again', function() {
                scope.questionCtrl.startQuestionSet();
                scope.questionCtrl.processQuestion();

                scope.questionCtrl.questionService.currentQuestionIndex = questionSetQuestionsMock.questions.length - 1;
                scope.questionCtrl.questionService.repeatQS = true;
                scope.questionCtrl.processQuestion();

                $timeout.flush();

                expect(scope.questionCtrl.questionService.currentQuestionIndex).toEqual(0);

            });

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