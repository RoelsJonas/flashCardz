# random-int-array

Returns an array of random integers, with the option of having them be unique.

## Node.js Installation

```
$ npm install random-int-array
```
Or, simply include random-int-array.js in your web app.

## Usage

```javascript
var randomIntArray = require('random-int-array');

var myRandomIntArray = randomIntArray(options);
```

`options` is an object that should contain the following members:
* `count` - the number of integers in the array
* `min` - the inclusive lower bound for each random integer (defaults to 0 if not supplied)
* `max` - the exclusive upper bound for each random integer
* `unique` - set to true to ensure that all integers in the array are unique - `count` will shrink to the `min` and `max` range if it is greater (defaults to false if not supplied)

### Examples

```javascript
var randomIntArray = require('random-int-array');

randomIntArray({ count: 10, max: 100 });
// Returns an array of 10 integers between 0 and 99

randomIntArray({ count: 3, min: 3, max: 11 });
// Returns an array of 3 integers between 3 and 10.

randomIntArray({ count: 10, max: 101, unique: true });
// Returns an array of 10 integers between 0 and 100, with no duplicates.
```

## Performance Note

When uniqueness is required, one of two different algorithms is selected. Each algorithm performs badly depending on the values supplied for `count` and the range between `min` and `max`. After a bit of testing, I found that I should switch functions when the `count` is about 16% of the `max`-`min` range, so that the best-performing algorithm is used.
