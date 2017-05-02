'use strict';

const path = require('path');

const babel = require('babel-core');
const CompactReexports = require('../lib');

QUnit.module('compact-reexports', function(hooks) {
  function transform(code, _options) {
    const options = Object.assign({
      plugins: [
        'transform-es2015-modules-amd',
        [CompactReexports]
      ]
    }, _options);
    return babel.transform(code, options).code.trim();
  }

  // TODO: Check loose option
  // TODO: Check strict option
  // TODO: Check noInterop option

  QUnit.test('correctly transforms simple re-export', function(assert) {
    const result = transform('export { default } from "foo";', {
      moduleId: "bar",
    });
    assert.equal(result, 'define.alias("foo", "bar");');
  });

  QUnit.test('correctly transforms re-export of module with more than one export', function(assert) {
    const result = transform('export { default, helper } from "foo";', {
      moduleId: "baz"
    });
    assert.equal(result, 'define.alias("foo", "baz");');
  });

  QUnit.test('does not transform indirect re-export', function(assert) {
    const result = transform('import Foo from "foo"; export default Foo;', {
      moduleId: "boo"
    });
    assert.equal(result.indexOf('define.alias'), -1);
  });

  QUnit.test('does not transform re-exports with other code', function(assert) {
    const result = transform('const a = "boo"; export { default } from "foo";', {
      moduleId: "bah"
    });
    assert.equal(result.indexOf('define.alias'), -1);
  });
});