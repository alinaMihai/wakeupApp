(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .controller('QuoteDetailCtrl', QuoteDetailCtrl);

    QuoteDetailCtrl.$inject = ['QuoteService', '$stateParams', 'topic', 'usSpinnerService', '$state'];

    /* @ngInject */
    function QuoteDetailCtrl(QuoteService, $stateParams, topic, usSpinnerService, $state) {
        var vm = this;
        vm.quote = {};
        vm.topic = topic;
        vm.comments = [];
        vm.addComment=addComment;
        vm.deleteComment=deleteComment;
        vm.cleanAddCommentForm=cleanAddCommentForm;
        activate();

        ////////////////

        function activate() {

            QuoteService.getQuote($stateParams.quoteId).then(function(quote) {
                vm.quote = quote;
                usSpinnerService.stop('spinner-1');
            }, function(err) {
                if (typeof err === "string" && err.toLocaleLowerCase().replace(" ", '') === "notfound") {
                    $state.go('pageNotFound');
                } else {
                    $state.go('login');
                }
                usSpinnerService.stop('spinner-1');
            });

            QuoteService.getComments($stateParams.quoteId).then(function(comments) {
                vm.comments = comments||[];
            });

        }
        function cleanAddCommentForm(){
            vm.comment=undefined;
            vm.showAddComment=false;
        }

        function addComment() {
            var today = new Date().getTime();
            var commentObj = {};
            commentObj.createDate = today;
            commentObj.text = vm.comment;
            QuoteService.addComment(vm.quote._id, vm.topic.isDefault, commentObj).then(function(comment) {
                vm.comments.push(comment);
                cleanAddCommentForm();
            });
        }

        function deleteComment(commentId){
            QuoteService.deleteComment(vm.quote._id,commentId).then(function(){
                var indexComment=_.findIndex(vm.comments,{_id:commentId});
                vm.comments.splice(indexComment,1);
            });
        }
    }
})();
