(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .filter('quotesSigns', quotesSigns);

    function quotesSigns() {
        return function(text) {
            return (text && !text.contains('"')) ? '"'+text+'"':text;
        };
    }
})();
