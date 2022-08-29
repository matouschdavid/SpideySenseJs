module.exports = class ServiceProvider {
  static instance = new ServiceProvider();

  constructor() {}

  backlog = [];
  activeObjects = [];
  register(classToInstantiate, creationFunc) {
    this.backlog[classToInstantiate] = creationFunc;
    this.activeObjects[classToInstantiate] = undefined;
  }

  createInstance(classToInstantiate, queryParams) {
    classToInstantiate = classToInstantiate.toLowerCase();
    if (this.activeObjects[classToInstantiate] === undefined) {
      this.activeObjects[classToInstantiate] =
        this.backlog[classToInstantiate](queryParams);
    }
    return this.activeObjects[classToInstantiate];
  }
};
