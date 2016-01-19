(function() {
    'use strict';

    var express = require('express');
    var controller = require('./quote.controller');
    var auth = require('../../auth/auth.service');

    var router = express.Router();

    router.get('/allQuestions',auth.isAuthenticated(),controller.getAllQuestions);
    router.get('/userQuotes',auth.isAuthenticated(),controller.getUserQuotes);
    router.get('/suggestions', auth.isAuthenticated(), controller.getSuggestions);
    router.get('/comments/:id', auth.isAuthenticated(), controller.getComments);
    router.get('/:topicId', auth.isAuthenticated(), controller.index);
    router.get('/quote/:id', auth.isAuthenticated(), controller.show);
    router.post('/:topicId', auth.isAuthenticated(), controller.create);
    router.post('/importQuotes/:topic/', auth.isAuthenticated(), controller.importQuotes);
    router.put('/:id', auth.isAuthenticated(), controller.update);
    router.put('/addComment/:id/:isDefault', auth.isAuthenticated(), controller.addComment);
    router.delete('/:id', auth.isAuthenticated(), controller.destroy);
    router.delete('/deleteComment/:quoteId/:commentId',auth.isAuthenticated(),controller.deleteComment);

    module.exports = router;
})();