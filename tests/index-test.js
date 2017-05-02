'use strict';

const path = require('path');

const babel = require('babel-core');
const CompactReexports = require('../lib');

QUnit.module('compact-reexports', function(hooks) {
  function transform(code, moduleOptions) {
    const options = {
      moduleId: 'bar',
      plugins: [
        ['transform-es2015-modules-amd', moduleOptions],
        [CompactReexports]
      ]
    };
    return babel.transform(code, options).code.trim();
  }

  QUnit.test('correctly transforms simple re-export', function(assert) {
    const result = transform('export { default } from "foo";');
    assert.equal(result, 'define.alias("foo", "bar");');
  });

  QUnit.test('correctly transforms simple re-export with loose', function(assert) {
    const result = transform('export { default } from "foo";', {
      loose: true
    });
    assert.equal(result, 'define.alias("foo", "bar");');
  });

  QUnit.test('correctly transforms simple re-export with strict', function(assert) {
    const result = transform('export { default } from "foo";', {
      strict: true
    });
    assert.equal(result, 'define.alias("foo", "bar");');
  });

  QUnit.test('correctly transforms simple re-export with noInterop', function(assert) {
    const result = transform('export { default } from "foo";', {
      noInterop: true
    });
    assert.equal(result, 'define.alias("foo", "bar");');
  });

  QUnit.test('correctly transforms re-export of module with more than one export', function(assert) {
    const result = transform('export { default, helper } from "foo";');
    assert.equal(result, 'define.alias("foo", "bar");');
  });

  QUnit.test('does not transform indirect re-export', function(assert) {
    const result = transform('import Foo from "foo"; export default Foo;');
    assert.equal(result.indexOf('define.alias'), -1);
  });

  QUnit.test('does not transform re-exports with other code', function(assert) {
    const result = transform('const a = "boo"; export { default } from "foo";');
    assert.equal(result.indexOf('define.alias'), -1);
  });
});