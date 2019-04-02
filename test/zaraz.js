const test = require('tape');
const zaraz = require('../');

test('must call callback with params', function(t) {

  t.plan(2);
  zaraz(function(a, b) {
    t.equal(a, 5);
    t.equal(b, -3);
  }, 5, -3);
});

test('must call callbacks in order', function(t) {
  let r = '';
  function fn(p) {
    r += p;
  }

  t.plan(1);

  zaraz(fn, 'A');
  zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function() {
    t.equal(r, 'ABC');
  });
});

test('must allow to clear a callback', function(t) {
  let r = '';
  function fn(p) {
    r += p;
  }

  t.plan(1);

  zaraz(fn, 'A');
  const b = zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function() {
    t.equal(r, 'AC');
  });
  b.clear();
});

test('must allow for running a callback manually', function(t) {
  let r = '';
  function fn(p) {
    r += p;
  }

  t.plan(1);

  zaraz(fn, 'A');
  const b = zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function() {
    t.equal(r, 'BAC');
  });
  b.run();
});

test('must pospone callbacks scheduled during callback', function(t) {
  let r = '';
  function fn(p) {
    r += p;
  }

  t.plan(2);

  zaraz(fn, 'A');
  zaraz(function() {
    fn('B');
    zaraz(fn, 'D');
    zaraz(function() {
      t.equal(r, 'ABCD');
    });
  });
  zaraz(fn, 'C');
  zaraz(function() {
    t.equal(r, 'ABC');
  });
});

test('must respect MAX_ITEMS', function(t) {
  let r = '';
  function fn(p) {
    r += p;
  }

  t.plan(1);

  zaraz.MAX_ITEMS = 2;
  zaraz(fn, 'A');
  zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function() {
    t.equal(r, 'ABC');
  });
});
