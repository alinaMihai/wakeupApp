describe('QuestionService', function() {
    var myQuestionService, httpBackend, mockData;

    // Use to provide any mocks needed
    function _provide(callback) {
        // Execute callback with $provide
        module(function($provide) {
            callback($provide);
        });
    }

    // Use to inject the code under test
    function _inject() {
        inject(function(_QuestionService_, $httpBackend, _QuestionSetQuestions_) {
            myQuestionService = _QuestionService_;
            httpBackend = $httpBackend;
            mockData = _QuestionSetQuestions_;
        });
    }

    // Call this before each test, except where you are testing for errors
    function _setup() {
        // Mock any expected data
        _provide(function(provide) {
            provide.value('logger', {
                success: function(message) {
                    console.log(message);
                }
            });
        });

        // Inject the code under test
        _inject();
    }
    beforeEach(function() {
        module('wakeupApp', 'wakeupApp.mocks');
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe('the service api, it', function() {
        beforeEach(function() {
            _setup();
        });

        it('should exist', function() {
            expect(!!myQuestionService).toBe(true);
        });
        it('should provide a boolean isUpdated property', function() {
            expect(typeof myQuestionService.isUpdated).toBe('boolean');
        });

        it('should provide a getQuestions method', function() {
            expect(typeof myQuestionService.getQuestions).toBe('function');
        });
        it('should provide a saveAnswer method', function() {
            expect(typeof myQuestionService.saveAnswer).toBe('function');
        });
        it('should provide a getQuestionById method', function() {
            expect(typeof myQuestionService.getQuestionById).toBe('function');
        });
        it('should provide an addQuestion method', function() {
            expect(typeof myQuestionService.addQuestion).toBe('function');
        });
        it('should provide a deleteQuestion method', function() {
            expect(typeof myQuestionService.deleteQuestion).toBe('function');
        });
        it('should provide an editQuestion method', function() {
            expect(typeof myQuestionService.editQuestion).toBe('function');
        });
        it('should provide a registerSession method', function() {
            expect(typeof myQuestionService.registerSession).toBe('function');
        });
        it('should provide a importQuestions method', function() {
            expect(typeof myQuestionService.importQuestions).toBe('function');
        });
        it('should provide a getQuestionSetData method', function() {
            expect(typeof myQuestionService.getQuestionSetData).toBe('function');
        });

    });
    describe('getQuestions method, it', function() {
        it('should make a $http get call and return mocked data', function() {
            var data;

            //given
            httpBackend.expectGET('/api/questionSet/1').respond(mockData.QuestionSet1);

            //when
            myQuestionService.getQuestions(1).then(function(response) {
                data = response;
            })
            httpBackend.flush();

            //then
            expect(data.questions).toEqual(mockData.QuestionSet1.questions);

        });
    });
    describe('getQuestionById method, it', function() {
        it('should make a $http get call and return mocked data', function() {
            var data;
            //given 
            httpBackend.expectGET('/api/questions/question/107').respond(mockData.QuestionSet1.questions[0]);
            //when
            myQuestionService.getQuestionById(107).then(function(response) {
                data = response;
            });
            httpBackend.flush();
            //then
            expect(data).toEqual(mockData.QuestionSet1.questions[0]);

        });
    });
    describe('saveAnswer method, it', function() {
        it('should make an $http post call and return the saved object', function() {
            var data;
            var answer = {
                question: 1,
                text: 'my answer',
                date: new Date().getTime()
            };
            //given
            httpBackend.expectPOST('/api/answers/', answer).respond(answer);
            //when
            myQuestionService.saveAnswer(answer).then(function(response) {
                data = answer;
            });
            httpBackend.flush();
            //then
            expect(data).toEqual(answer);
        });
    });

    describe('addQuestion method, it', function() {
        it('should make an $http post call and return the saved question', function() {
            var data;
            var question = {
                text: 'my question',
                questionSet: 1,
                date: new Date().getTime()
            };
            //given
            httpBackend.expectPOST('/api/questions/', question).respond(question);
            //when
            myQuestionService.addQuestion(question).then(function(response) {
                data = question;
            });
            httpBackend.flush();
            //then
            expect(data).toEqual(question);
        });
    });
    describe('deleteQuestion method, it', function() {
        it('should make an $http delete call and return no content', function() {
            var dQuestion = {
                _id: 1,
                text: 'my question',
                questionSet: 1,
                date: new Date().getTime()
            };
            var data;
            //given
            httpBackend.expectDELETE('/api/questions/1').respond();
            //when
            myQuestionService.deleteQuestion(dQuestion).then(function(response) {
                data = response;
            });
            httpBackend.flush();
            //then
            expect(data).toEqual();

        });
    });

    describe('editQuestion method, it', function() {
        it('should make an $http put request and return the updated question', function() {
            var updateQuestion = {
                _id: 1,
                text: 'my question updated',
                questionSet: 1,
            };
            var data;
            //given 
            httpBackend.expectPUT('/api/questions/1', updateQuestion).respond(updateQuestion);
            //when
            myQuestionService.editQuestion(updateQuestion).then(function(response) {
                data = response;
            });
            httpBackend.flush();
            //then
            expect(data).toEqual(updateQuestion);
        });
    });

    describe('registerSession method, it', function() {
        it('should make an $http put request', function() {
            var data;
            //given
            httpBackend.expectPUT('/api/questionSet/session/1').respond(mockData.questionSet1);
            //when
            myQuestionService.registerSession(1).then(function(response) {
                data = response;
            });
            httpBackend.flush();
            //then
            expect(data).toEqual(mockData.questionSet1);
        });
    });

});