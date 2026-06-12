var LAST_RESULT = 0;
var currentExpression = "";

function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

function sinDeg(deg) { return Math.sin(deg * Math.PI / 180); }
function cosDeg(deg) { return Math.cos(deg * Math.PI / 180); }
function tanDeg(deg) { return Math.tan(deg * Math.PI / 180); }
function asinDeg(val) { return Math.asin(val) * 180 / Math.PI; }
function acosDeg(val) { return Math.acos(val) * 180 / Math.PI; }
function atanDeg(val) { return Math.atan(val) * 180 / Math.PI; }

function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}

function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

const SAFE_EXPR_RE = /^[\d+\-*/()%\s.,a-zA-Z]+$/;

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;
    currentExpression = (num / 100).toString();
  } else {
    const baseExpr = match[1];
    const op = match[2];
    const percentNum = parseFloat(match[3]);

    if (isNaN(percentNum)) return;

    let baseValue;

    try {
      baseValue = eval(baseExpr);
    } catch (e) {
      baseValue = parseFloat(baseExpr);
    }

    if (isNaN(baseValue)) return;

    const percentValue = (baseValue * percentNum) / 100;
    currentExpression = baseExpr + op + percentValue;
  }

  updateResult();
}

function calculateExpression(expression) {
  try {
    let normalizedExpression = normalizeExpression(expression);

    if (!SAFE_EXPR_RE.test(normalizedExpression)) {
      return "Error";
    }

    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    if (normalizedExpression.includes("Error")) {
      return "Error";
    }

    let result = eval(normalizedExpression);

    if (isNaN(result) || !isFinite(result)) {
      return "Error";
    }

    return result;
  } catch (e) {
    return "Error";
  }
}

function calculateResult() {
  if (!currentExpression) return;
  const display = document.getElementById("result");
  let result = calculateExpression(currentExpression);
  result = String(result);

  if (result !== "Error") {
    LAST_RESULT = result;
  }

  display.value = result;
  currentExpression = result;
  updateResult();
}

function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}
