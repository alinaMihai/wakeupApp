(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .service('CoreService', CoreService);

    CoreService.$inject = ['$uibModal'];

    /* @ngInject */
    function CoreService($uibModal) {
        this.isDelete = false;
        this.groupArrayObjectsByDate = groupArrayObjectsByDate;
        this.timeConverter = timeConverter;
        this.detectIE=detectIE;
        this.openModal = openModal;
        this.addQsToTopic = addQsToTopic;
        this.removeQsFromTopic = removeQsFromTopic;


        function groupArrayObjectsByDate(theArray) {
            var grouped_objects = theArray.map(function(item) {
                var theDay = timeConverter(item.date);
                item.theDay = theDay;
                return item;

            });
            return grouped_objects;
        }

        function timeConverter(UNIX_timestamp) {
            if (!UNIX_timestamp) {
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

        function openModal(dataObj, template, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: template,
                size: 'lg',
                controller: 'ModalInstanceCtrl as modalCtrl',
                resolve: {
                    data: function() {
                        return dataObj;
                    }
                }
            });
            modalInstance.result.then(callback, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }

        //utility functions topics

        function addQsToTopic(data) {
            return function(event, qs) {
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                var questionSetId = parseInt(qs);
                var isPresent = data.questionSetList.indexOf(questionSetId);
                if (isPresent === -1) {
                    data.questionSetList.push(questionSetId);
                }
            }

        }

        function removeQsFromTopic(data) {
            return function(qsId) {
                var questionSetId = parseInt(qsId);
                var index = data.questionSetList.indexOf(questionSetId);
                data.questionSetList.splice(index, 1);
            }
        }

        function detectIE() {
            var ua = window.navigator.userAgent;

            // Test values; Uncomment to check result …

            // IE 10
            // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

            // IE 11
            // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

            // IE 12 / Spartan
            // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

            // Edge (IE 12+)
            // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }
/*
            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }*/

            // other browser
            return false;
        }
    }
})();
