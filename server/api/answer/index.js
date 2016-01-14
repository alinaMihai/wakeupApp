(function() {
    'use strict';

    var express = require('express');
    var controller = require('./answer.controller');
    var auth = require('../../auth/auth.service');

    var router = express.Router();

    router.get('/:questionId', auth.isAuthenticated(), controller.index);

   /* router.get('/:id', controller.show);*/
    router.post('/', auth.isAuthenticated(), controller.create);
    router.put('/:id',auth.isAuthenticated(), controller.update);
    router.patch('/:id',auth.isAuthenticated(), controller.update);
    router.delete('/:id',auth.isAuthenticated(), controller.destroy);
    router.delete('/deleteAllAnswers/:questionId',auth.isAuthenticated(),controller.deleteAllAnswers);

    module.exports = router;
})();