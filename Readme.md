[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# zaraz

Cheap way to introduce short async delay.

## Install

```sh
$ npm install --save zaraz
```

## Usage

```js
const zaraz = require('zaraz');

function sum(a, b) {
  console.log(a + b);
}

zaraz(sum, 5, 7); // will display 13 after a short delay
zaraz(sum, 10, 10); // will displey 20 after it displays 13

```


## API

### `zaraz(fn, ...args)`

  schedule `fn` to be called in near future - `args` will be passed to `fn`

### `zaraz.DELAY`

  minumum delay before task is processed - 10 millis by default

### `zaraz.ACTIVE`

  maximum time spent processing taks queue before yielding - 100 millis by default

### `zaraz.MAX_ITEMS`

  maximum number of task processed before yielding - 1000 by default

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/zaraz
[npm-url]: https://npmjs.org/package/zaraz

[build-url]: https://github.com/pirxpilot/zaraz/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/zaraz/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/zaraz
[deps-url]: https://libraries.io/npm/zaraz

