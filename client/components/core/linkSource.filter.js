(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .filter('linkSource', linkSource);

    function linkSource() {
        return function(text) {
            return (text && text.contains("http")) ? "<a href='"+text+"'>"+text + "</a>" : text;
        };
    }
})();
