module.exports = class ValueService {
  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }
};
