var test = require('tape');
var randomIntArray = require('./random-int-array.js');

test("randomIntArray", function(t) {
    t.throws(randomIntArray, "Throws with no args");
    t.throws(randomIntArray.bind(null, 5), "Throws when arg is not an object");
    t.throws(randomIntArray.bind(null, {}), "Throws when empty object is supplied");
    t.throws(randomIntArray.bind(null, { max: 6 }), "Throws when no count is supplied");
    t.throws(randomIntArray.bind(null, { count: 6 }), "Throws when no max is supplied");
    t.throws(randomIntArray.bind(null, { count: 6, min: 5, max: 4 }), "Throws when min is greater than max");
    t.throws(randomIntArray.bind(null, { count: 6, min: 5, max: 5 }), "Throws when min is equal to max");
    t.ok(Array.isArray(randomIntArray({count: 3, max: 10})), "Returns array");
    t.equal(randomIntArray({count: 5, max: 10}).length, 5, "Non-unique array length matches count.");
    t.equal(randomIntArray({count: 5, max: 10, unique: true}).length, 5, "Unique array length matches count.");
    t.equal(randomIntArray({count: 10, max: 5, unique: true}).length, 5, "Unique array length matches max if lower than count.");
    t.ok(elementsAreUnique(randomIntArray({count: 3, max: 3, unique: true})), "Elements are unique");
    
    t.end();
});

function elementsAreUnique(arr) {
    for (var i = 0; i < arr.length; i++) {
        var val = arr[i];
        arr[i] = -1;
        if (arr.indexOf(val) > -1)
            return false;
    }
    return true;
}
