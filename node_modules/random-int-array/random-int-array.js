function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getNonUniqueInts(count, min, max) {
    var ret = [];

    for (var i = 0; i < count; i++) {
        ret.push(randomInt(min, max));
    }

    return ret;
}

function crudelyGetURIs(count, min, max) {
    var ret = [];

    while (count > 0) {
        var rnd = randomInt(min, max);
        if (ret.indexOf(rnd) == -1) {
            ret.push(rnd);
            count--;
        }
    }

    return ret;
}

function getURIsFromPool(count, min, max) {
    var pool = [];
    for (var i = min; i < max; i++) {
        pool.push(i)
    }
    var poolSize = max - min;

    var ret = [];

    for (var i = 0; i < count; i++) {
        var index = randomInt(0, poolSize);
        ret.push(pool[index]);
        pool.splice(index, 1);
        poolSize--;
    }

    return ret;
}

function randomIntArray(options) {
    // This decides the ratio of the count to the min/max range that marks the point at which we use a different function for better performance.
    var magicRatio = 0.16;

    // SETUP
    var eg = "\nExample:\trandomIntArray({ count: 10, min: 30, max: 100, unique: true });\n";
    if (typeof(options) !== 'object')
        throw new Error("You must supply an object with 'count', 'max' (exclusive), 'min' (default: 0, inclusive), 'unique' (default: false) members." + eg);
    var count = parseInt(options.count);
    if (isNaN(count))
        throw new Error("You must supply a count (int)." + eg);
    var max = parseInt(options.max);
    if (isNaN(max) || max < 1)
        throw new Error("You must supply a max (int) greater than zero." + eg);
    var min = parseInt(options.min);
    if (isNaN(min))
        min = 0;
    if (min >= max)
        throw new Error("Your min is greater than or equal to your max!");
    var unique = options.unique;
    if (typeof(unique) === 'undefined')
        unique = false;

    if (!unique)
        return getNonUniqueInts(count, min, max);

    if (count > max - min)
        count = max - min;
    if (count / (max - min) > magicRatio)
        return getURIsFromPool(count, min, max);

    return crudelyGetURIs(count, min, max);
}

module.exports = randomIntArray;
