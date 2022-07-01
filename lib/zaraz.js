const debug = require('debug')('zaraz');

module.exports = zaraz;

/* global requestIdleCallback */

const queues = {
  timer: undefined,
  index: 0,
  current: [],
  later: []
};

const Item = {
  init(fn, params) {
    this._fn = fn;
    this._params = params;
    return this;
  },

  run() {
    // bail if nothing to run
    if (!this._fn) { return; }

    const fn = this._fn;
    this.clear();
    fn(...this._params);
  },

  clear() {
    this._fn = undefined;
  }
};

function zaraz(fn, ...params) {
  const item = Object.create(Item).init(fn, params);
  const q = queues.index > 0 ? queues.later : queues.current;
  q.push(item);

  kick();
  return item;
}

zaraz.MAX_DELAY = 500;    // how long we are willing to wait for idle
zaraz.ACTIVE = 100;       // how long before we yield after processing items
zaraz.MAX_ITEMS = 1000;   // how many items we can process in a single step

function execute(idle) {
  const start = Date.now();
  const max = Math.min(queues.current.length, queues.index + zaraz.MAX_ITEMS);
  queues.timer = undefined;

  while(queues.index < max) {
    queues.current[queues.index++].run();
    if ((!idle.didTimeout && idle.timeRemaining() > 0) || Date.now() - start > zaraz.ACTIVE) {
      debug('remaining %d, later %d', queues.current.length - queues.index, queues.later.length);
      break;
    }
  }

  if (queues.index === queues.current.length) {
    debug('promote later');
    queues.current = queues.later;
    queues.later = [];
    queues.index = 0;
  }

  kick();
}

function kick() {
  if (!queues.timer && queues.current.length > 0) {
    // things to do and no timer
    queues.timer = requestIdleCallback(execute, { timeout: zaraz.MAX_DELAY });
  }
}
