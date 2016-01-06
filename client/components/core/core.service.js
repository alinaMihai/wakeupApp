(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('CoreService', CoreService);

    CoreService.$inject = [];

    /* @ngInject */
    function CoreService() {
        this.isDelete = false;
        this.groupArrayObjectsByDate=groupArrayObjectsByDate;

        
        function groupArrayObjectsByDate(theArray) {
            var grouped_objects = theArray.map(function(item) {
                var theDay = timeConverter(item.date);
                item.theDay = theDay;
                return item;

            });
            return grouped_objects;
        }

        function timeConverter(UNIX_timestamp) {
            if(!UNIX_timestamp){
            	return 'Not Available';
            }
            var a = new Date(UNIX_timestamp);
            
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();

            var time = date + ' ' + month + ' ' + year;
            return time;
        }

    }
})();