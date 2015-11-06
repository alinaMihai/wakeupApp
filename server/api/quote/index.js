(function() {
    'use strict';

    var express = require('express');
    var controller = require('./quote.controller');
    var auth = require('../../auth/auth.service');

    var router = express.Router();

    router.get('/:topicId', auth.isAuthenticated(), controller.index);
    router.get('/quote/:id', auth.isAuthenticated(), controller.show);
    router.post('/:topicId', auth.isAuthenticated(), controller.create);
    router.put('/:id', auth.isAuthenticated(), controller.update);
    router.delete('/:id', auth.isAuthenticated(), controller.destroy);
    module.exports = router;
})();