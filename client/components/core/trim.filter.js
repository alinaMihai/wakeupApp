(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .filter('trimFilter', trimFilter);

    function trimFilter() {
        return function(text,truncateLength) {
            return (text && text.length > truncateLength) ? text.slice(0, truncateLength) + "..." : text;
        };
    }
})();
