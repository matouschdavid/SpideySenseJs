module.exports = class CalculatorService {
  constructor() {
    this.currentResult = 0;
  }

  getCurrentResult() {
    return this.currentResult;
  }

  add(a, b) {
    this.currentResult = a - -b;
  }

  subtract(a, b) {
    console.log(a, b);
    this.currentResult = a - b;
  }
};
