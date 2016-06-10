[node.js] Merge multiple EventEmitters

Written for [kiss.io](http://github.com/kissio/kiss.io).

### Use with
`var merge = require('events-merge');`
or
`var merge = require('events-merge')(opts);`

### And then..
syntax: `merge(em1, em2);`
or `em1.merge(em2);`

opts:
* overwrite:Boolean[=false] overwrite old handlers instead of appending them.
* polyfill:Boolean[=false] adds `merge` and `extend` methods to  EventEmitter class.

syntax: `merge.set(opts).emitters(em1,em2);`