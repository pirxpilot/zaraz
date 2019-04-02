const debug = require('debug')('zaraz');

module.exports = zaraz;

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

zaraz.DELAY = 10;         // default delay
zaraz.ACTIVE = 100;       // how long before we yield after processing items
zaraz.MAX_ITEMS = 1000;   // how many items we can process in a single step

function execute() {
  const start = Date.now();
  const max = Math.min(queues.current.length, queues.index + zaraz.MAX_ITEMS);

  debug('queues before', queues.current.length - queues.index, queues.later.length);

  while(queues.index < max) {
    queues.current[queues.index++].run();
    if (Date.now() - start > zaraz.ACTIVE) {
      debug('breaking...');
      break;
    }
  }

  debug('queues after', queues.current.length - queues.index, queues.later.length);

  if (queues.index === queues.current.length) {
    queues.current = queues.later;
    queues.later = [];
    queues.index = 0;
  }

  kick();
}

function kick() {
  const empty = queues.current.length === 0;
  if (empty && queues.timer) {
    // no timer needed since there is nothing more to do
    clearInterval(queues.timer);
    queues.timer = undefined;
    return;
  }
  if (!empty && !queues.timer) {
    // things to do and no timer
    queues.timer = setInterval(execute, zaraz.DELAY);
  }
}
