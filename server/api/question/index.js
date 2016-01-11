(function() {
    'use strict';

    var express = require('express');
    var controller = require('./question.controller');
    var auth = require('../../auth/auth.service');


    var router = express.Router();

    router.get('/:questionSetId', auth.isAuthenticated(), controller.index);
    // router.get('/answers/:questionId', auth.isAuthenticated(), controller.getAnswerList);
    router.get('/question/:id', auth.isAuthenticated(), controller.show);
    router.post('/', auth.isAuthenticated(), controller.create);
    router.post('/importQuestions/:questionSet',auth.isAuthenticated(),controller.importQuestions);
    router.put('/:id', auth.isAuthenticated(), controller.update);
    router.patch('/:id', auth.isAuthenticated(), controller.update);
    router.delete('/:id', auth.isAuthenticated(), controller.destroy);

    module.exports = router;
})();