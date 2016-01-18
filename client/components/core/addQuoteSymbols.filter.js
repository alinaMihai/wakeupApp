(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .filter('quotesSigns', quotesSigns);

    function quotesSigns() {
        return function(text) {
            return (text && !(text.indexOf('"')===0 || text.indexOf("'")===0)) ? '"'+text.replace(/"/mg," ' ")+'"':text;
        };
    }
})();
