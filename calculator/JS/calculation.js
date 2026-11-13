/* exported calculateResult */
let currentNumbers = "";

const numbersDisplay = document.getElementById("numbers");
const resultDisplay = document.getElementById("result");

// Safely evaluate a calculator expression without eval/Function.
// Supports numbers, decimals, unary +/-, parentheses, and + - * /.
function evaluateExpression(expression) {
  const tokens = expression.match(/\d+\.?\d*|\.\d+|[()+\-*/]/g) || [];

  if (tokens.join("") !== expression) {
    throw new Error("Invalid expression");
  }

  let index = 0;

  function peek() {
    return tokens[index];
  }

  function parseNumber() {
    const token = peek();

    if (token === undefined) {
      throw new Error("Unexpected end of expression");
    }

    const value = Number(token);

    if (Number.isNaN(value)) {
      throw new Error("Expected a number");
    }

    index += 1;
    return value;
  }

  function parsePrimary() {
    if (peek() === "(") {
      index += 1;
      const value = parseExpression();

      if (peek() !== ")") {
        throw new Error("Missing closing parenthesis");
      }

      index += 1;
      return value;
    }

    return parseNumber();
  }

  function parseUnary() {
    const token = peek();

    if (token === "+") {
      index += 1;
      return parseUnary();
    }

    if (token === "-") {
      index += 1;
      return -parseUnary();
    }

    return parsePrimary();
  }

  function parseTerm() {
    let value = parseUnary();

    while (peek() === "*" || peek() === "/") {
      const operator = tokens[index];
      index += 1;
      const right = parseUnary();
      value = operator === "*" ? value * right : value / right;
    }

    return value;
  }

  function parseExpression() {
    let value = parseTerm();

    while (peek() === "+" || peek() === "-") {
      const operator = tokens[index];
      index += 1;
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }

    return value;
  }

  const result = parseExpression();

  if (index !== tokens.length) {
    throw new Error("Unexpected token");
  }

  return result;
}

function calculateResult(isFinalCommit = false) {
  if (!currentNumbers) {
    resultDisplay.textContent = "";
    return;
  }

  try {
    let formattedExpr = currentNumbers.replace(/%/g, "/100");

    const evaluated = evaluateExpression(formattedExpr);

    if (
      evaluated !== undefined &&
      !isNaN(evaluated) &&
      evaluated !== Infinity
    ) {
      if (isFinalCommit) {
        currentNumbers = String(evaluated);
        numbersDisplay.textContent = currentNumbers;
        resultDisplay.textContent = "";
      } else {
        resultDisplay.textContent = evaluated;
      }
    }
  } catch (error) {
    resultDisplay.textContent = "";
  }
}
