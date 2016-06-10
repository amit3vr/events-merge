'use strict';

class Merge
{
  constructor(opts)
  {
    this.defaults = opts || {};
  }

  set(key, value)
  {
    this.defaults[key] = value;
    return this;
  }

  flag(key, value)
  {
    this._flags = this._flags || {};

    if(arguments.length == 2)
      this._flags[key] = value;

    return this._flags[key] || this.defaults[key];
  }

  reset()
  {
    delete this._flags;
  }

  get overwrite()
  {
    this.flag('overwrite', true);
    return this;
  }

  static eventNamesOf(emitter)
  {
    if(typeof emitter.eventNames == 'function')
      return emitter.eventNames();

    if(typeof emitter._events == 'object')
      return Object.keys(emitter._events);

    return [];
  }

  base(emitter)
  {
    this.flag('baseEmitter', emitter);
    return this;
  }

  to(emitter)
  {
    return this.base(emitter);
  }

  merge(emitters)
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
  }

  emitters(emitters)
  {
    return this.merge(emitters);
  }
}

module.exports = new Merge();