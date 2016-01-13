(function() {
    'use strict';

    var express = require('express');
    var controller = require('./questionSet.controller');
    var auth = require('../../auth/auth.service');

    var router = express.Router();

    router.get('/', auth.isAuthenticated(), controller.index);
    router.get('/sessionAnswers/:questionSet', auth.isAuthenticated(), controller.getRecentQuestionSetSession);
    router.get('/:id', auth.isAuthenticated(), controller.getQuestionList);
    router.get('/:questionSetId', auth.isAuthenticated(), controller.show);
    router.post('/', auth.isAuthenticated(), controller.create);
    router.put('/:id', auth.isAuthenticated(), controller.update);
    router.put('/session/:id', auth.isAuthenticated(), controller.registerSession);
    //router.patch('/:id', auth.isAuthenticated(), controller.update);

    router.delete('/:id', auth.isAuthenticated(), controller.destroy);

    module.exports = router;
})();