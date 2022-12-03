var randomIntArray = require('random-int-array');

require('mongoose').Query.prototype.random = function(count, unique, callback) {
    var query = this;

    return query.count(function(err, max) {
        if (err) callback(err);
        var docNumbers = randomIntArray({ count: count, max: max, unique: unique });
        var docs = [];
        var promises = docNumbers.map(function(n, index) {
            return new Promise(function(resolve, reject) {
                query.model.find(query._conditions).skip(n).limit(-1).exec(function(err, doc) {
                    if (err) return reject(err);
                    docs[index] = doc[0];   
                    resolve();
                });
            });
        });

        Promise.all(promises).then(function() {
            callback(null, docs);
        }).catch(function(err) { callback(err); });
    });
}
