(function() {


    angular.module('wakeupApp.mocks').value('QuestionSetQuestions', {
        'QuestionSet1': {
            "_id": 22,
            "name": "The Work of Byron Katie",
            "createDate": "2015-11-03T06:53:00.516Z",
            "practiceTimes": 0,
            "impact": 0,
            "isDefault": true,
            "questions": [{
                "_id": 106,
                "text": "Is it true?",
                "date": "2015-11-03T06:54:13.072Z",
                "questionSet": 22,
                "__v": 0,
                "answers": []
            }, {
                "_id": 107,
                "text": "Can you absolutely know that it's true?",
                "date": "2015-11-03T06:54:27.108Z",
                "questionSet": 22,
                "__v": 0,
                "answers": []
            }, {
                "_id": 108,
                "text": "How do you react, what happens, when you believe that thought?",
                "date": "2015-11-03T06:54:42.209Z",
                "questionSet": 22,
                "__v": 0,
                "answers": []
            }, {
                "_id": 109,
                "text": "Who would you be without the thought?",
                "date": "2015-11-03T06:54:55.102Z",
                "questionSet": 22,
                "__v": 0,
                "answers": []
            }]
        }
    });

})();