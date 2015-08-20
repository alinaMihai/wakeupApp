(function() {
    'use strict';

    var express = require('express');
    var controller = require('./question.controller');
    var auth = require('../../auth/auth.service');


    var router = express.Router();

    router.get('/:questionSetId', auth.isAuthenticated(), controller.index);
    router.get('/answers/:questionId', auth.isAuthenticated(), controller.getAnswerList);
    /*router.get('/:id', controller.show);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.destroy);*/

    module.exports = router;
})();