# babel-plugin-compact-reexports

[![Build Status](https://travis-ci.org/ember-engines/babel-plugin-compact-reexports.svg?branch=master)](https://travis-ci.org/ember-engines/babel-plugin-compact-reexports)

Allows ES modules which just re-export contents of other modules to be more compact; saving you bytes over the wire.

_Original discussion: [ember-engines/ember-engines#265](https://github.com/ember-engines/ember-engines/issues/265)_

## What It Does

Given a re-export module:

```js
// my-module.js
export { default } from 'their-module';
```

When using AMD, this would normally compile to something like:

```js
define('my-module', ['exports', 'their-module'], function (exports, _theirModule) {
  'use strict';

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _theirModule['default'];
    }
  });
});
```

Which is pretty verbose for a simple re-export. This plugin will rewrite the above to the following (assuming you're using an AMD loader that supports the `alias` API):

```js
define.alias('their-module', 'my-module');
```
