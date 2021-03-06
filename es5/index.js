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
};

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

Merge.prototype.__defineGetter__('overwrite', function()
{
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

Merge.prototype.merge =
Merge.prototype.emitters = function(emitters)
{
  var noop = function() {};
  var self = this || { flag: noop, reset: noop };
  if(!Array.isArray(emitters))
    emitters = Array.from(arguments);
  var baseEmitter = self.flag('baseEmitter') || emitters.shift();
  var overwrite = self.flag('overwrite');
  self.reset();

  return emitters.reduce(function(base, emitter)
  {
    for(var event of Merge.eventNamesOf(emitter))
    {
      if(overwrite)
        base.removeAllListeners(event);

      for(var fn of emitter.listeners(event))
      {
        if(!base.getMaxListeners
          || base.listeners(event).length < base.getMaxListeners())
        {
          base.addListener(event, fn);
        }
      }
    }
    return base;
  }, baseEmitter);
};

module.exports = new Merge;