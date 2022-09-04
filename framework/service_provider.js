module.exports = class ServiceProvider {

  static backlog = [];
  static activeObjects = [];
  static register(classToInstantiate, creationFunc) {
    classToInstantiate = classToInstantiate.toLowerCase();
    this.backlog[classToInstantiate] = creationFunc;
    this.activeObjects[classToInstantiate] = undefined;
  }

  static createPage(classToInstantiate, params) {
    classToInstantiate = classToInstantiate.toLowerCase();
    if (this.activeObjects[classToInstantiate] === undefined) {
      this.activeObjects[classToInstantiate] =
        this.backlog[classToInstantiate](params);
    }
    return this.activeObjects[classToInstantiate];
  }

  static create(classToInstantiate) {
    classToInstantiate = classToInstantiate.toLowerCase();
    if (this.activeObjects[classToInstantiate] === undefined) {
      this.activeObjects[classToInstantiate] =
        this.backlog[classToInstantiate]();
    }
    return this.activeObjects[classToInstantiate];
  }

  static clear() {
    this.activeObjects = [];
  }
};