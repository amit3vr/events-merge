'use strict';

var merge   = require('..');
var chai    = require('chai');
var expect  = chai.expect;
var Emitter = require('events').EventEmitter;


describe('merge.to(base).emitters(...emitters)', function()
{
  it('should merge three EventEmitters onto the base emitter', function()
  {
    var counter = 0;
    var base = new Emitter();
    var emitters = [
      new Emitter(),
      new Emitter()
    ];

    base.on('inc', function()
    {
      counter++;
    });

    emitters[0].on('inc', function()
    {
      counter++;
    });

    emitters[1].once('dec', function()
    {
      counter--;
    });

    merge.to(base).emitters(emitters);

    base.emit('inc');
    expect(counter).to.equal(2);

    base.emit('inc');
    expect(counter).to.equal(4);

    base.emit('dec');
    expect(counter).to.equal(3);

    // 'dec' events is a 'once' event - so should
    // not work now.
    base.emit('dec');
    expect(counter).to.equal(3);
  });
});

describe('merge.overwrite.to(base).emitters(...emitters)', function()
{
  it('should merge three EventEmitters onto the base emitter, ' +
    'overwriting "old" handlers (from left to right).', function()
  {
    var counter = 0;
    var base = new Emitter();
    var emitters = [
      new Emitter(),
      new Emitter()
    ];

    base.on('inc', function()
    {
      counter++;
    });

    emitters[0].on('inc', function()
    {
      counter++;
    });

    emitters[1].on('dec', function()
    {
      counter--;
    });

    merge.overwrite.to(base).emitters(emitters);

    base.emit('inc');
    expect(counter).to.equal(1);

    base.emit('inc');
    expect(counter).to.equal(2);

    base.emit('dec');
    expect(counter).to.equal(1);
  });
});