const test = require("node:test");
const assert = require("node:assert/strict");

const {
  evaluateExpression,
  evaluateInput,
} = require("../calculator/JS/calculation.js");

test("respects operator precedence", () => {
  assert.equal(evaluateExpression("1+2*3"), 7);
  assert.equal(evaluateExpression("10-4/2"), 8);
  assert.equal(evaluateExpression("2+3*4-5"), 9);
});

test("supports decimals and unary signs", () => {
  assert.equal(evaluateExpression("1.5+2.5"), 4);
  assert.equal(evaluateExpression(".5*4"), 2);
  assert.equal(evaluateExpression("12."), 12);
  assert.equal(evaluateExpression("-5+2"), -3);
  assert.equal(evaluateExpression("2*-3"), -6);
  assert.equal(evaluateExpression("--2"), 2);
});

test("supports grouped and nested parentheses", () => {
  assert.equal(evaluateExpression("(1+2)*3"), 9);
  assert.equal(evaluateExpression("-(2+3)"), -5);
  assert.equal(evaluateExpression("((2))"), 2);
  assert.equal(evaluateExpression("(2+3)*(4-1)"), 15);
});

test("treats percent as division by 100", () => {
  assert.equal(evaluateInput("50%"), 0.5);
  assert.equal(evaluateInput("200*10%"), 20);
  assert.equal(evaluateInput("1+50%"), 1.5);
});

test("rejects malformed expressions", () => {
  assert.throws(() => evaluateExpression("1+"));
  assert.throws(() => evaluateExpression("(1+2"));
  assert.throws(() => evaluateExpression("1+2)"));
  assert.throws(() => evaluateExpression("1.2.3"));
  assert.throws(() => evaluateExpression("2(3)"));
  assert.throws(() => evaluateExpression(""));
});
