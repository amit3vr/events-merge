# events-merge `v1.1.1`
[![Travis](https://img.shields.io/travis/amit3vr/events-merge.svg)](https://travis-ci.org/amit3vr/events-merge)
[![npm](https://img.shields.io/npm/dt/events-merge.svg?maxAge=2592000)](https://www.npmjs.com/package/events-merge)

A small utility for merging two+ `EventEmitter`s together.

## Installing
`$ npm install --save events-merge`

## Testing
`$ cd events-merge`  
`$ npm install --only=dev`  
`$ npm test`

## Getting Started
```javascript
var merge   = require('events-merge');
var Emitter = require('events').EventEmitter;

var counter = 0;
var base = new Emitter();
var emitters = [
  new Emitter(),
  new Emitter()
];

base.on('inc', () => { counter++ });
emitters[0].on('inc', () => { counter++ });
emitters[1].on('dec', () => { counter-- });

merge.to(base).emitters(emitters);

base.emit('inc'); // counter == 2
base.emit('inc'); // counter == 4
base.emit('dec'); // counter == 3
```

or simply

```javascript
var merge = require('events-merge').merge;

// code code code...

merge(base, emitter1, emitter2, ...); // base is now merged with the given emitters.
```


#### Using the es5 flavor
**`merge` uses the es6 syntax by default**.
If your node.js version does not support es6 syntax, you can overcome this problem by requiring `events-merge/es5` lib instead.  
> ```javascript
> var merge = require('events-merge/es5');
> ```

## API
#### merge.set(key:String, value) : self
Sets a default option for the `events-merge` module.  
> ```javascript
> merge.set('overwrite', true);
> ```

#### merge.base(emitter:Emitter) : self
Sets a base emitter to merge other emitters to.  
> ```javascript
> merge.base(emitter).emitters(emitter1, emitter2, ...);
> ```

#### merge.to(emitter:Emitter) : self
Alias to `merge.base`.  
> ```javascript
> merge.to(emitter).merge(emitter1, emitter2, ...);
> ```

#### merge.merge(...emitters:Emitter) : Emitter
#### merge.merge(emitters:Array<Emitter>) : Emitter
Merge the given `emitters` (by array or by seperated param) to the base emitter. If not base emitter given, uses the first emitter in the given `emitters` list.  
> ```javascript
> var merge = require('events-merge').merge;
> merge(base, emitter1, emitter2, ...); // base is now merged with the given emitters.
> ```

#### merge.emitters(...emitters:Emitter) : Emitter
#### merge.emitters(emitters:Array<Emitter>) : Emitter
Alias for `merge.merge`.

#### [getter] merge.overwrite
Sets the `overwrite` flag to `true`.
> ```javascript
> merge.overwrite.to(base).merge(emitter1, emitter2, ...);
> ```

#### [static] merge.eventNamesOf(emitter:Emitter) : Array<String>
A helper method that returns list of event names that a given `emitter` holds.
> ```javascript
> emitter.on('ev1', someMethod);
> emitter.on('ev2', anotherMethod);
>
> console.log(merge.eventNamesOf(emitter)); // prints ['ev1', 'ev2'].
> ```

## LICENSE
[MIT](https://github.com/amit3vr/events-merge/blob/master/LICENSE)

---

> Yo! Follow me on GitHub [@amit3vr](https://github.com/amit3vr). You might find my shit useful someday.