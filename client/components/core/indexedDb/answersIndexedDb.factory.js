(function() {
    'use strict';

    angular
        .module('wakeupApp')
        .factory('AnswersFactory', AnswersFactory);

    AnswersFactory.$inject = ['$window', '$q', 'logger'];

    /* @ngInject */
    function AnswersFactory($window, $q, logger) {
        var indexedDB = $window.indexedDB || $window.mozIndexedDB || $window.webkitIndexedDB || $window.msIndexedDB;

        if (!indexedDB) {
            alert("Your Browser does not support IndexedDB");
        }
        var db = null;
        var lastIndex = 0;
        var service = {
            openIndexedDb: openIndexedDb,
            saveAnswer: saveAnswer,
            getAnswers: getAnswers,
            updateAnswer: updateAnswer,
            deleteAnswer: deleteAnswer,
            deleteAllAnswers: deleteAllAnswers
        };
        return service;

        ////////////////

        function openIndexedDb() {
            var deferred = $q.defer();
            var version = 2;
            var request = indexedDB.open("answersData", version);

            request.onupgradeneeded = function(e) {
                db = e.target.result;

                e.target.transaction.onerror = indexedDB.onerror;

                if (db.objectStoreNames.contains("answers")) {
                    db.deleteObjectStore("answers");
                }

                var store = db.createObjectStore("answers", {
                    keyPath: "_id"
                });
                store.createIndex('question', 'questionId', {
                    unique: false
                });
            };

            request.onsuccess = function(e) {
                db = e.target.result;
                deferred.resolve();
            };

            request.onerror = function() {
                deferred.reject();
            };
            return deferred.promise;
        }

        function saveAnswer(answer) {
            var deferred = $q.defer();

            if (db === null) {
                deferred.reject("IndexDB is not opened yet!");
            } else {
                getLastIndex().then(function(lastIndex) {
                    var trans = db.transaction(['answers'], 'readwrite');
                    var store = trans.objectStore('answers');
                    if (!lastIndex || lastIndex === 0) {
                        lastIndex = 800; //add 500 so that there is no _id conflict with the old mongodb stored answers
                    }
                    answer._id = ++lastIndex;
                    answer.local = true;
                    var request = store.put(answer);

                    request.onsuccess = function(e) {
                        logger.success("Answer successfully saved", answer, "Success");
                        deferred.resolve(answer);
                    };
                    request.onerror = function(e) {
                        logger.error("Answer could not be successfully saved", e.value, "Error");
                    };
                });

            }
            return deferred.promise;
        }

        function updateAnswer(answer) {
            var deferred = $q.defer();
            if (db === null) {
                deferred.reject("IndexedDB is not opened yet!");
            } else {
                var trans = db.transaction(['answers'], 'readwrite');
                var store = trans.objectStore('answers');
                var request = store.put(answer);
                request.onsuccess = function(e) {
                    logger.success('Answer successfully updated', answer, "Success");
                    deferred.resolve(answer);
                };
                request.onerror = function(e) {
                    logger.error("Answer could not be successfully saved", e.value, "Error");
                };
            }
            return deferred.promise;
        }

        function getAnswers(questionId) {
            var deferred = $q.defer();
            if (db === null) {
                deferred.reject('IndexDB is not opened yet');
            } else {
                var trans = db.transaction(['answers'], 'readonly');
                var store = trans.objectStore('answers');
                var index = store.index('question');
                var answers = [];
                // Select only those records where question=questionId
                var request = index.openCursor(IDBKeyRange.only(questionId));
                request.onsuccess = function(e) {
                    var result = e.target.result;
                    if (result === null || result === undefined) {
                        deferred.resolve(answers);
                    } else {
                        answers.push(result.value);
                        result.continue();
                    }
                };
                request.onerror = function(e) {
                    deferred.reject();
                }

            }
            return deferred.promise;
        }

        function deleteAnswer(answerId) {
            var deferred = $q.defer();
            if (db === null) {
                deferred.reject("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction(['answers'], 'readwrite');
                var store = trans.objectStore('answers');
                var request = store.delete(answerId);
                request.onsuccess = function(e) {
                    deferred.resolve();
                    logger.success("Answer successfully deleted", null, "Success");
                };
                request.onerror = function(e) {
                    logger.error("Answer could not be successfully deleted", e.value, "Error");
                    deferred.reject(e.value);
                }

            }
            return deferred.promise;
        }

        function deleteAllAnswers(questionId, userId) {
            var deferred = $q.defer();
            if (db === null) {
                deferred.reject('IndexDB is not opened yet');
            } else {
                var trans = db.transaction(['answers'], 'readwrite');
                var store = trans.objectStore('answers');
                var index = store.index('question');

                // Select only those records where question=questionId
                var request = index.openCursor(IDBKeyRange.only(questionId));
                request.onsuccess = function(e) {
                    var result = e.target.result;
                    if (result === null || result === undefined) {
                        deferred.resolve();
                    } else {
                        if (result.value.userId === userId) {
                            store.delete(result.value._id);
                        }
                        result.continue();
                    }
                };
                request.onerror = function(e) {
                    deferred.reject();
                }

            }
            return deferred.promise;
        }

        function getLastIndex() {
            var deferred = $q.defer();
            if (db === null) {
                deferred.reject('IndexDB is not opened yet');
            } else {
                var trans = db.transaction(['answers'], 'readonly');
                var store = trans.objectStore('answers');
                var openCursorRequest = store.openCursor(null, 'prev');
                openCursorRequest.onsuccess = function(event) {
                    if (event.target.result) {
                        deferred.resolve(event.target.result.value._id); //the object with max revision
                    } else {
                        deferred.resolve(0);
                    }
                };
                openCursorRequest.onerror = function(e) {
                    deferred.reject();
                }
            }
            return deferred.promise;
        }
    }
})();