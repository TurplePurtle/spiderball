
class ComponentMap {
  constructor() {
    this.entities = [];
    this.byId = {};
  }

  getComponent(entity) {
    return this.byId[entity.id];
  }

  setComponent(entity, component) {
    if (!this.byId[entity.id]) {
      this.entities.push(entity);
    }
    this.byId[entity.id] = component;
  }

  deleteComponent(entity) {
    delete this.byId[entity.id];
    const arr = this.entities;
    let ind = -1;
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === entity) {
        ind = i;
        break;
      }
    }
    if (ind === -1) return;
    // swap remove
    if (ind + 1 === arr.length) {
      arr.pop()
    } else {
      arr[ind] = arr.pop();
    }
  }
}

class Entity {
  constructor(id, entityService) {
    this.id = id;
    this.entityService = entityService;
  }

  getComponent(componentClass) {
    return this.entityService.getComponent(this, componentClass);
  }

  setComponent(componentClass, component) {
    this.entityService.setComponent(this, componentClass, component);
  }

  deleteComponent(componentClass) {
    return this.entityService.deleteComponent(this, componentClass);
  }

  destroy() {
    this.entityService.deleteEntity(this);
  }
}

export
class EntityService {
  constructor() {
    this.entityCounter = 0;
    this.componentMaps = {};
  }

  registerComponent(componentClass) {
    const componentName = componentClass.name;
    if (!this.componentMaps[componentName]) {
      this.componentMaps[componentName] = new ComponentMap;
    }
  }

  createEntity() {
    this.entityCounter += 1;
    return new Entity(this.entityCounter, this);
  }

  deleteEntity(entity) {
    for (let componentName in this.componentMaps) {
      const map = this.componentMaps[componentName];
      if (map.getComponent(entity)) {
        map.deleteComponent(entity);
      }
    }
  }

  getComponentMap(componentClass) {
    return this.componentMaps[componentClass.name].entities;
  }

  getComponent(entity, componentClass) {
    return this.componentMaps[componentClass.name].getComponent(entity);
  }

  setComponent(entity, componentClass, component) {
    const componentName = componentClass.name;
    this.componentMaps[componentName].setComponent(entity, component);
  }

  deleteComponent(entity, componentClass) {
    const componentName = componentClass.name;
    this.componentMaps[componentName].deleteComponent(entity);
  }
}
