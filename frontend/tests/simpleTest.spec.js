// Вместо этого:
// import assert from 'assert';

// Используйте это:
const assert = require('assert');

describe('Test Suite', function() {
  it('should pass a simple test', function() {
    assert.strictEqual(1, 1);
  });
});