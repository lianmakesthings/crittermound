class Trait {
  static MAX_VALUE = 999999;
  constructor(name, value) {
    this.name = name;
    this.base = value;
  }

  get value() {
    return this.base;
  }
}

export default Trait;
