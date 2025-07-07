const { test, describe } = require("node:test"); // What does the describe function do?
// The describe function is used to group related tests together in Node.js testing framework
// It allows you to organize tests into logical collections, making it easier to manage and understand the tests and their relationships.
// Describe blocks are necessary when we want to run some shared setup or teardown operations for a group of tests.
const assert = require("node:assert");
const average = require("../utils/for_testing").average;

describe("average", () => {
  test("of one value is the value itself", () => {
    assert.strictEqual(average([1]), 1);
  });

  test("of many is calculated right", () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5);
  });

  test("of empty array is zero", () => {
    assert.strictEqual(average([]), 0);
  });
});
