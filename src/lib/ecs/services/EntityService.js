/*
 ecsjs is an entity component system library for JavaScript
 Copyright (C) 2014 Peter Flannery

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @module ecsjs
 */
import {entityFactory} from '../factories/EntityFactory.js'
import {componentMapFactory} from '../factories/ComponentMapFactory.js'
import {KeyMap} from '../repositories/KeyMap.js'
import {NewEntityIdIterator} from '../iterators/NewEntityIdIterator.js'

/**
 * Class for working with Components and Entities.
 *
 * @class EntityService
 */
export class EntityService {

  static serialize(entityService) {
    return JSON.stringify(entityService);
  }

  static createFromJSON(serializedJSON) {
    let deserializedEs = JSON.parse(serializedJSON),
      {componentMaps, entityKeyIter_} = deserializedEs;

    entityKeyIter_.__proto__ = NewEntityIdIterator.prototype;
    deserializedEs.__proto__ = EntityService.prototype;
    componentMaps.__proto__ = KeyMap.prototype;
    deserializedEs.Entity = entityFactory(deserializedEs);
    deserializedEs.ComponentMap = componentMapFactory(deserializedEs.Entity);

    var ComponentMapPrototype = deserializedEs.ComponentMap.prototype;
    let map, nextResult, iterator = componentMaps.values();
    for(; !(nextResult=iterator.next()).done;) {
      map = nextResult.value;
      map.__proto__ = ComponentMapPrototype;
    }

    return deserializedEs;
  }

  constructor() {
    // entity key's
    this.entityKeyIter_ = new NewEntityIdIterator(1);

    // get the entity class
    this.Entity = entityFactory(this);

    // get the component map class
    this.ComponentMap = componentMapFactory(this.Entity);

    // component class maps
    this.componentMaps = new KeyMap();
  }

  /**
   * Registers a Component class and allocates a Map for storing it's entity data
   * All component classes are stored in a map using it's name as the key.
   *
   * @method registerComponent
   * @param componentClass The class to register
   * @return {EntityService} Chains the current instance of {EntityService}
   * @example
   *
   * ```javascript
   *   class MyComponent {
   *     constructor(aField) {
   *       this.aField = aField;
   *     }
   *   }
   *
   *   entityService.registerComponent(MyComponent);
   * ```
   */
  registerComponent(componentClass) {
    let componentName = componentClass.name;
    if (componentName === undefined)
      throw new ReferenceError("The component class name is not defined.");

    // entities map
    let entities = new this.ComponentMap();

    // add the componentClass to the components store
    this.componentMaps.set(componentName, entities);

    // chain
    return this;
  }

  /**
   * Gets the next unique entity key. Entity keys are only unique per {EntityService} instance
   *
   * @method nextEntityKey
   * @return {number}
   */
  nextEntityKey() {
    return this.entityKeyIter_.next().value;
  }

  /**
   * Simplified way of creating a new entity
   *
   * @method createEntity
   * @return {Entity} a wrapper class for simpler access to common entity methods
   * @example
   *
   * ```javascript
   *   let entity = entityService.createEntity();
   *   entity.setComponent(Components.PositionComponent, new Components.PositionComponent(1,1,1));
   * ```
   */
  createEntity() {
    return new this.Entity(this.nextEntityKey());
  }

  /**
   * Removes an entity from all component stores
   *
   * @method deleteEntity
   * @param entityKey
   * @return {Boolean} true if successful, false if not
   * @example
   *
   * ```javascript
   *   entityService.deleteEntity(entity.key);
   * ```
   */
  deleteEntity(entityKey) {
    let deleted = 0;

    this.componentMaps.forEach(
      (store) => {
        if (store.has(entityKey))
          if (store.delete(entityKey) === true)
            deleted++;
      }
    );

    return deleted > 0;
  }

  /**
   * Retrieves a component map by it's registered class
   *
   * @method getComponentMap
   * @param componentClass The class used to register the component
   * @return {Map} A map containing all entity data for the component class
   */
  getComponentMap(componentClass) {
    return this.componentMaps.get(componentClass.name);
  }

  /**
   * Retrieves an entity's component data by it's key
   *
   * @method getComponent
   * @param entityKey
   * @param componentClass
   * @return {*}
   * @example
   *
   * ```javascript
   *   // get a component
   *   let positionData = entityService.getComponent(entityKey, Components.PositionComponent);
   * ```
   */
  getComponent(entityKey, componentClass) {
    // get the component store
    let store = this.componentMaps.get(componentClass.name);

    // if we have a store then return the component at the entityKey provided
    if (store)
      return store.get(entityKey);

    // else; component not found
  }

  /**
   * Retrieves an array of entity component data models
   *
   * @method getComponents
   * @param entityKey The entity key
   * @param componentClasses An {Array} of component classes to retrieve
   * @return {Array} An array of the entity's component data which was specified in the componentClasses array.
   * @example
   * ```javascript
   *   // get an array of component data models
   *   let [positionData, movementData] = entityService.getComponent(entityKey, [Components.PositionComponent, Components.MovementComponent]);
   * ```
   */
  getComponents(entityKey, componentClasses) {
    let ccIndex = 0,
      componentEntities,
      results = [];

    for (; ccIndex < componentClasses.length; ccIndex++) {
      componentEntities = this.componentMaps.get(componentClasses[ccIndex].name);
      results.push(componentEntities.get(entityKey));
    }

    return results;
  }

  /**
   * Checks if the entity has a Component Class
   * The component class must be registered before calling this method
   *
   * @method hasComponent
   * @param entityKey The entity key
   * @param componentClass The class used to register the component
   * @return {Boolean}
   */
  hasComponent(entityKey, componentClass) {
    return this.componentMaps.get(componentClass.name)
      .has(entityKey);
  }

  /**
   * Sets the component data for the specified entityKey and componentClass
   *
   * @method setComponent
   * @param entityKey
   * @param componentClass
   * @param componentModel
   * @return {EntityService} Chains the current instance of {EntityService}
   * @example
   *
   * ```javascript
   *   // add/update a component to an entity
   *   let playerPos = new Components.PositionComponent(0, 0);
   *   entityService.setComponent(entityKey, Components.PositionComponent, playerPos);
   * ```
   */
  setComponent(entityKey, componentClass, componentModel) {
    // get the component store
    let store = this.componentMaps.get(componentClass.name);

    // ensure the store is defined
    if (store === undefined)
      throw new ReferenceError("Component map does not exist.");

    // set the entity on the component store
    store.set(entityKey, componentModel);

    // chain
    return this;
  }

  /**
   * Deletes the component data associated with the entity
   * @method deleteComponent
   * @param entityKey
   * @param componentClass
   * @return {Boolean} true if successful, false if not
   * @example
   *
   * ```javascript
   *   // delete a component from an entity
   *   entityService.deleteComponent(entityKey, Components.PositionComponent);
   * ```
   */
  deleteComponent(entityKey, componentClass) {
    // get the component store
    let store = this.componentMaps.get(componentClass.name);

    // ensure the store is defined
    if (store === undefined)
      throw new ReferenceError("Component map does not exist.");

    return store.delete(entityKey);
  }

}
