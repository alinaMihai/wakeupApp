/**
 * Populate DB with default data on user sign up
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Question = require('../api/question/question.model');
var QuestionController = require('../api/question/question.controller');
var QuestionSet = require('../api/questionSet/questionSet.model');
var DefaultQuestionSet = require('../api/questionSet/defaultQuestionSet.model');
var QuestionSetController = require('../api/questionSet/questionSet.controller');
var Topic = require('../api/topic/topic.model');
var TopicController = require('../api/topic/topic.controller');

var questionSetId;

var defaultQuestionSet = {
    "name": "The Work of Byron Katie",
    "createDate": "2015-11-03T06:53:00.516Z",
    "practiceTimes": 0,
    "impact": 0,
    "isDefault": true
};
var defaultQuestions = [{
    "text": "Is it true?",
    "date": "2015-11-03T06:54:13.072Z",
    "answers": []
}, {
    "text": "Can you absolutely know that it's true?",
    "date": "2015-11-03T06:54:27.108Z",
    "answers": []
}, {
    "text": "How do you react, what happens, when you believe that thought?",
    "date": "2015-11-03T06:54:42.209Z",
    "answers": []
}, {
    "text": "Who would you be without the thought?",
    "date": "2015-11-03T06:54:55.102Z",
    "answers": []
}];

var defaultTopic = {
    "title": "Do The Work",
    "description": "The Work is a simple yet powerful process of inquiry that teaches you to identify and question the thoughts that cause all the suffering in the world. It’s a way to understand what’s hurting you, and to address the cause of your problems with clarity. In its most basic form, The Work consists of fours questions and the turnarounds.\nThe Work is meditation. It’s about opening to your heart, not about trying to change your thoughts. Ask the questions, then go inside and wait for the deeper answers to surface.",
    "createDate": "2015-11-03T06:56:51.024Z",
    "quoteList": [],
    'isDefault': true
};


createQuestionSet(defaultQuestionSet);

function createQuestionSet(defaultQuestionSet) {
    QuestionSet.findOne({}, {}, {
        sort: {
            '_id': 'descending'
        }
    }, function(err, questionSet) {

        var latestQuestionSetId = questionSet ? questionSet._id : 0; // in the db is one based
        var questionSetId = latestQuestionSetId + 1;

        defaultQuestionSet._id = questionSetId;

        QuestionSet.create(defaultQuestionSet, function(err, questionSet) {
            if (err) {
                console.log(err);
            }
            console.log(questionSet._id);
            addQuestions(defaultQuestions, questionSet._id);
            defaultTopic.questionSetList = [questionSet._id];
            createTopic(defaultTopic);
        });
    });
}


function addQuestions(defaultQuestions, questionSetId) {
    defaultQuestions = defaultQuestions.map(function(question) {
        question.questionSet = questionSetId;
        return question;
    });
    createQuestion(defaultQuestions[0]).then(function() {
        createQuestion(defaultQuestions[1]).then(function() {
            createQuestion(defaultQuestions[2]).then(function() {
                createQuestion(defaultQuestions[3]);
            });
        });
    })
}

function createQuestion(questionObj) {

    return Question.findOne({}, {}, {
        sort: {
            '_id': 'descending'
        }
    }, function(err, question) {
        var latestQuestionId = question ? question._id : 0; // in the db is one based
        var questionId = latestQuestionId + 1;

        questionObj._id = questionId;
        console.log('createQuestion, questionId', questionObj._id, questionObj.questionSet);
        return Question.create(questionObj, function(err, question) {
            if (err) {
                console.log(err);
            }
            QuestionSet.update({
                _id: questionObj.questionSet
            }, {
                $addToSet: {
                    questions: questionObj._id
                }
            }).exec();;
        });

    });

}

function createTopic(topicObj) {

    Topic.findOne({}, {}, {
        sort: {
            '_id': 'descending'
        }
    }, function(err, topic) {

        var latestTopicId = topic ? topic._id : 0;
        var topicId = latestTopicId + 1;
        topicObj._id = topicId;

        Topic.create(topicObj, function(err, topic) {
            if (err) {
                console.log(err);
            }

        });
    });
}


/*DefaultQuestionSet.create({
    QuestionSetId: 13,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});
DefaultQuestionSet.create({
    QuestionSetId: 14,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});
DefaultQuestionSet.create({
    QuestionSetId: 15,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});
DefaultQuestionSet.create({
    QuestionSetId: 16,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});
DefaultQuestionSet.create({
    QuestionSetId: 17,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});
DefaultQuestionSet.create({
    QuestionSetId: 18,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});
DefaultQuestionSet.create({
    QuestionSetId: 19,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});
DefaultQuestionSet.create({
    QuestionSetId: 20,
    user: 'alina.mihai90@gmail.com',
    isDeleted: true
}, function(err, obj) {

});*/