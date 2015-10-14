'use strict';

var s4a = require('../dist/s4a.js');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit
 
 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */
exports['s4a-test'] = {
    setUp: function (done) {
        // setup here
        done();
    },
    'no args': function (test) {
        test.expect(1);
        test.equal(s4a.version, '0.1.0', 'Should be 0.1.0');
        test.done();
    }
};
