'use strict';

function Merge(opts)
{
  if(!this)
    return new Merge(opts);

  this.defaults = opts || {};
}

Merge.eventNamesOf = function(emitter)
{
  if(typeof emitter.eventNames == 'function')
    return emitter.eventNames();

  if(typeof emitter._events == 'object')
    return Object.keys(emitter._events);

  return [];
}

Merge.prototype.set = function(key, value)
{
  this.defaults[key] = value;
  return this;
};

Merge.prototype.flag = function(key, value)
{
  this._flags = this._flags || {};

  if(arguments.length == 2)
    this._flags[key] = value;

  return this._flags[key] || this.defaults[key];
};

Merge.prototype.__defineGetter__('overwrite', function(){
  this.flag('overwrite', true);
  return this;
});

Merge.prototype.reset = function()
{
  delete this._flags;
};

Merge.prototype.to =
Merge.prototype.base = function(headEmitter)
{
  this.flag('baseEmitter', headEmitter);
  return this;
};

Merge.prototype.do =
Merge.prototype.merge =
Merge.prototype.emitters = function(emitters)
{
  if(!Array.isArray(emitters))
    emitters = Array.prototype.slice.call(arguments);
  var baseEmitter = this.flag('baseEmitter') || emitters.shift();
  var overwrite = this.flag('overwrite');
  this.reset();

  return emitters.reduce(function(base, emitter)
  {
    for(var event of Merge.eventNamesOf(emitter))
    {
      if(overwrite)
        base.removeAllListeners(event);

      for(var fn of emitter.listeners(event))
      {
        if(base.listenerCount(event) < base.getMaxListeners())
          base.addListener(event, fn);
      }
    }
    return base;
  }, baseEmitter);
};

module.exports = new Merge;