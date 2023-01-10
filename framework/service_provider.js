module.exports = class ServiceProvider {
  static backlog = [];
  static activeSessionObjects = [];
  static activeScopedObjects = [];
  static activeSingletonObjects = [];

  static setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  static addSessionScoped(classToInstantiate, creationFunc) {
    classToInstantiate = classToInstantiate.toLowerCase();
    this.backlog[classToInstantiate] = {
      storage: this.activeSessionObjects,
      creationFunc: creationFunc,
    };
    this.needsSession = true;
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

  static addTransient(classToInstantiate, creationFunc) {
    classToInstantiate = classToInstantiate.toLowerCase();
    this.backlog[classToInstantiate] = {
      storage: this.backlog,
      creationFunc: creationFunc,
    };
  }

  static createPage(classToInstantiate, params) {
    classToInstantiate = classToInstantiate.toLowerCase();
    if (this.activeScopedObjects[classToInstantiate] === undefined) {
      this.activeScopedObjects[classToInstantiate] =
        this.backlog[classToInstantiate].creationFunc(params);
    }
    return this.activeScopedObjects[classToInstantiate];
  }

  static get(classToInstantiate) {
    classToInstantiate = classToInstantiate.toLowerCase();
    //SessionScoped
    if (
      this.backlog[classToInstantiate].storage === this.activeSessionObjects
    ) {
      if (
        this.backlog[classToInstantiate].storage[this.sessionId] === undefined
      ) {
        this.backlog[classToInstantiate].storage[this.sessionId] = [];
      }
      if (
        this.backlog[classToInstantiate].storage[this.sessionId][
          classToInstantiate
        ] === undefined
      ) {
        this.backlog[classToInstantiate].storage[this.sessionId][
          classToInstantiate
        ] = this.backlog[classToInstantiate].creationFunc();
      }
      return this.backlog[classToInstantiate].storage[this.sessionId][
        classToInstantiate
      ];
    }
    //Transient
    if (this.backlog[classToInstantiate].storage === this.backlog) {
      return this.backlog[classToInstantiate].creationFunc();
    }
    //Singleton and Scoped
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
    this.activeSessionObjects = [];
  }
};
