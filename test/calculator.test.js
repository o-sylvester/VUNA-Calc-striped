const fs = require("fs");
const path = require("path");

const scriptCode = fs.readFileSync(
  path.resolve(__dirname, "../assets/js/script.js"),
  "utf8",
);

eval(scriptCode);

beforeEach(() => {
  document.body.innerHTML = `<input type="text" id="result" placeholder="0" readonly />`;
  currentExpression = "";
  LAST_RESULT = 0;
  updateResult();
});

describe("normalizeExpression", () => {
  test("converts sin to sinDeg", () => {
    expect(normalizeExpression("sin(30)")).toBe("sinDeg(30)");
  });

  test("converts cos to cosDeg", () => {
    expect(normalizeExpression("cos(60)")).toBe("cosDeg(60)");
  });

  test("converts tan to tanDeg", () => {
    expect(normalizeExpression("tan(45)")).toBe("tanDeg(45)");
  });

  test("converts asin to asinDeg", () => {
    expect(normalizeExpression("asin(0.5)")).toBe("asinDeg(0.5)");
  });

  test("converts acos to acosDeg", () => {
    expect(normalizeExpression("acos(0.5)")).toBe("acosDeg(0.5)");
  });

  test("converts atan to atanDeg", () => {
    expect(normalizeExpression("atan(1)")).toBe("atanDeg(1)");
  });

  test("does NOT convert asinh", () => {
    expect(normalizeExpression("asinh(1)")).toBe("asinh(1)");
  });

  test("does NOT convert sinh", () => {
    expect(normalizeExpression("sinh(1)")).toBe("sinh(1)");
  });

  test("converts e to Math.E", () => {
    expect(normalizeExpression("e")).toBe("Math.E");
  });

  test("converts pi to Math.PI", () => {
    expect(normalizeExpression("pi")).toBe("Math.PI");
  });

  test("converts pi inside expression", () => {
    expect(normalizeExpression("sin(pi/2)")).toBe("sinDeg(Math.PI/2)");
  });

  test("does NOT modify normal arithmetic", () => {
    expect(normalizeExpression("2+3*4")).toBe("2+3*4");
  });

  test("handles empty string", () => {
    expect(normalizeExpression("")).toBe("");
  });
});

describe("trig functions", () => {
  test("sinDeg(30) is approximately 0.5", () => {
    expect(sinDeg(30)).toBeCloseTo(0.5, 4);
  });

  test("cosDeg(60) is approximately 0.5", () => {
    expect(cosDeg(60)).toBeCloseTo(0.5, 4);
  });

  test("tanDeg(45) is approximately 1", () => {
    expect(tanDeg(45)).toBeCloseTo(1, 4);
  });

  test("asinDeg(0.5) is approximately 30", () => {
    expect(asinDeg(0.5)).toBeCloseTo(30, 4);
  });

  test("acosDeg(0.5) is approximately 60", () => {
    expect(acosDeg(0.5)).toBeCloseTo(60, 4);
  });

  test("atanDeg(1) is approximately 45", () => {
    expect(atanDeg(1)).toBeCloseTo(45, 4);
  });

  test("calculateExpression works with sin", () => {
    const result = calculateExpression("sin(30)");
    expect(result).toBeCloseTo(0.5, 4);
  });

  test("calculateExpression works with cos", () => {
    const result = calculateExpression("cos(60)");
    expect(result).toBeCloseTo(0.5, 4);
  });

  test("calculateExpression works with tan", () => {
    const result = calculateExpression("tan(45)");
    expect(result).toBeCloseTo(1, 4);
  });

  test("calculateExpression works with asin", () => {
    const result = calculateExpression("asin(0.5)");
    expect(result).toBeCloseTo(30, 4);
  });

  test("calculateExpression works with acos", () => {
    const result = calculateExpression("acos(0.5)");
    expect(result).toBeCloseTo(60, 4);
  });

  test("calculateExpression works with atan", () => {
    const result = calculateExpression("atan(1)");
    expect(result).toBeCloseTo(45, 4);
  });
});

describe("calculateExpression", () => {
  test("adds two numbers", () => {
    expect(calculateExpression("2+3")).toBe(5);
  });

  test("subtracts two numbers", () => {
    expect(calculateExpression("10-4")).toBe(6);
  });

  test("multiplies two numbers", () => {
    expect(calculateExpression("3*7")).toBe(21);
  });

  test("divides two numbers", () => {
    expect(calculateExpression("20/4")).toBe(5);
  });

  test("respects order of operations", () => {
    expect(calculateExpression("2+3*4")).toBe(14);
  });

  test("handles parentheses", () => {
    expect(calculateExpression("(2+3)*4")).toBe(20);
  });

  test("handles decimal numbers", () => {
    expect(calculateExpression("3.5+2.1")).toBeCloseTo(5.6);
  });

  test("handles exponentiation", () => {
    expect(calculateExpression("2**3")).toBe(8);
  });

  test("replaces ans with last calculated result", () => {
    currentExpression = "2+3";
    calculateResult();
    currentExpression = "ans+5";
    calculateResult();
    expect(document.getElementById("result").value).toBe("10");
  });

  test("does not store Error as LAST_RESULT", () => {
    LAST_RESULT = "Error";
    const result = calculateExpression("ans");
    expect(result).toBe("Error");
  });

  test("returns Error for invalid expression", () => {
    expect(calculateExpression("invalid")).toBe("Error");
  });

  test("returns Error for division by zero", () => {
    expect(calculateExpression("1/0")).toBe("Error");
  });

  test("uses Math.E and Math.PI via normalize", () => {
    const result = calculateExpression("pi*2");
    expect(result).toBeCloseTo(6.283185, 4);
  });

  test("handles negative numbers", () => {
    expect(calculateExpression("-5+3")).toBe(-2);
  });

  test("returns Error for unsafe characters", () => {
    expect(calculateExpression("2+3; alert(1)")).toBe("Error");
  });
});

describe("percentToResult", () => {
  test("converts standalone number to percentage", () => {
    appendToResult(200);
    percentToResult();
    expect(currentExpression).toBe("2");
  });

  test("computes percentage of a base with addition", () => {
    appendToResult(200);
    operatorToResult("+");
    appendToResult(10);
    percentToResult();
    expect(currentExpression).toBe("200+20");
  });

  test("computes percentage of a base with multiplication", () => {
    appendToResult(200);
    operatorToResult("*");
    appendToResult(10);
    percentToResult();
    expect(currentExpression).toBe("200*20");
  });

  test("does not add trailing operator after percent", () => {
    appendToResult(50);
    percentToResult();
    expect(currentExpression).toBe("0.5");
    expect(currentExpression.endsWith("*")).toBe(false);
  });
});

describe("calculateResult", () => {
  test("does not store Error as LAST_RESULT on failed evaluation", () => {
    currentExpression = "invalid";
    calculateResult();
    expect(LAST_RESULT).not.toBe("Error");
    expect(LAST_RESULT).toBe(0);
  });

  test("stores valid result as LAST_RESULT", () => {
    currentExpression = "5+5";
    calculateResult();
    expect(LAST_RESULT).toBe("10");
  });
});

describe("appendToResult", () => {
  test("appends number to currentExpression", () => {
    appendToResult(5);
    expect(currentExpression).toBe("5");
  });

  test("appends multiple digits", () => {
    appendToResult(1);
    appendToResult(2);
    appendToResult(3);
    expect(currentExpression).toBe("123");
  });

  test("appends decimal point", () => {
    appendToResult(3);
    appendToResult(".");
    appendToResult(14);
    expect(currentExpression).toBe("3.14");
  });

  test("updates the result display", () => {
    appendToResult(42);
    expect(document.getElementById("result").value).toBe("42");
  });
});

describe("clearResult", () => {
  test("clears currentExpression", () => {
    appendToResult(123);
    expect(currentExpression).toBe("123");
    clearResult();
    expect(currentExpression).toBe("");
  });

  test("resets display to 0", () => {
    appendToResult(99);
    clearResult();
    expect(document.getElementById("result").value).toBe("0");
  });
});

describe("backspace", () => {
  test("removes last character", () => {
    appendToResult(123);
    backspace();
    expect(currentExpression).toBe("12");
  });

  test("handles empty expression", () => {
    backspace();
    expect(currentExpression).toBe("");
  });
});

describe("operatorToResult", () => {
  test("appends plus operator", () => {
    appendToResult(5);
    operatorToResult("+");
    expect(currentExpression).toBe("5+");
  });

  test("appends minus operator", () => {
    appendToResult(10);
    operatorToResult("-");
    expect(currentExpression).toBe("10-");
  });

  test("appends multiply operator", () => {
    operatorToResult("*");
    expect(currentExpression).toBe("*");
  });

  test("appends divide operator", () => {
    operatorToResult("/");
    expect(currentExpression).toBe("/");
  });

  test("converts caret to double asterisk", () => {
    operatorToResult("^");
    expect(currentExpression).toBe("**");
  });
});

describe("bracketToResult", () => {
  test("appends opening bracket", () => {
    bracketToResult("(");
    expect(currentExpression).toBe("(");
  });

  test("appends closing bracket", () => {
    appendToResult(5);
    operatorToResult("*");
    appendToResult(3);
    bracketToResult(")");
    expect(currentExpression).toBe("5*3)");
  });
});
