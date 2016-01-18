(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .filter('linkSource', linkSource);

    function linkSource() {
        return function(text) {
            return (text && text.indexOf("http")===0) ? "<a href='"+text+"' target='_blank'>"+text + "</a>" : text;
        };
    }
})();
