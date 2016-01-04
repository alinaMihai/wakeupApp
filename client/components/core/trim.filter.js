(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .filter('trimFilter', trimFilter);

    function trimFilter() {
        return function(text) {
            return (text && text.length > 250) ? text.slice(0, 250) + "..." : text;
        };
    }
})();
