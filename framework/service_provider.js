module.exports = class ServiceProvider {
  static backlog = [];
  static activeTransientObjects = [];
  static activeScopedObjects = [];
  static activeSingletonObjects = [];

  static addTransient(classToInstantiate, creationFunc) {
    classToInstantiate = classToInstantiate.toLowerCase();
    this.backlog[classToInstantiate] = {
      storage: this.activeTransientObjects,
      creationFunc: creationFunc,
    };
    this.activeTransientObjects[classToInstantiate] = undefined;
  }

  static addScoped(classToInstantiate, creationFunc) {
    classToInstantiate = classToInstantiate.toLowerCase();
    this.backlog[classToInstantiate] = {
      storage: this.activeScopedObjects,
      creationFunc: creationFunc,
    };
    this.activeScopedObjects[classToInstantiate] = undefined;
  }

  static addSingleton(classToInstantiate, creationFunc) {
    classToInstantiate = classToInstantiate.toLowerCase();
    this.backlog[classToInstantiate] = {
      storage: this.activeSingletonObjects,
      creationFunc: creationFunc,
    };
    this.activeSingletonObjects[classToInstantiate] = undefined;
  }

  static createPage(classToInstantiate, params) {
    classToInstantiate = classToInstantiate.toLowerCase();
    if (this.activeTransientObjects[classToInstantiate] === undefined) {
      this.activeTransientObjects[classToInstantiate] =
        this.backlog[classToInstantiate].creationFunc(params);
    }
    return this.activeTransientObjects[classToInstantiate];
  }

  static get(classToInstantiate) {
    classToInstantiate = classToInstantiate.toLowerCase();
    if (
      this.backlog[classToInstantiate].storage[classToInstantiate] === undefined
    ) {
      this.backlog[classToInstantiate].storage[classToInstantiate] =
        this.backlog[classToInstantiate].creationFunc();
    }
    return this.backlog[classToInstantiate].storage[classToInstantiate];
  }

  static clearScoped() {
    this.activeScopedObjects = [];
  }

  static clearTransient() {
    this.activeTransientObjects = [];
  }
};
