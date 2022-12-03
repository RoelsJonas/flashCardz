# mongoose-query-random

Pull out random documents from a collection using Mongoose.

## Node.js Installation

```
$ npm install mongoose-query-random
```

## Usage

```javascript
require('mongoose-query-random');

query.random(count, unique, callback);
```
To return documents no more than once, set `unique` to `true`.

### Examples

```javascript
require('mongoose-query-random');

Cat.find().random(5, true, function(err, cats) {
    if (err) throw err;
    console.log(cats);
});

Users.find().where('name').equals('Anna').random(1, false, function(err, annas) {
    if (err) throw err;
    console.log(annas);
});
```

## Performance Note

This module performs as well as `mongodb`'s `cursor.skip()`, multiplied by the specified `count` (it needs to `skip` for *each document* it pulls out). So very large queries with a large count might take a while to execute.
