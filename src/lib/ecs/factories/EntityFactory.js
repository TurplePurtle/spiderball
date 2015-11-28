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
export function entityFactory(entityService) {

  /**
   * Class that wraps an entity key and provides a simplified interface to access the entity data
   *
   * @class Entity
   */
  class Entity {

    constructor(entityKey) {
      this.key = entityKey;
    }

    /**
     * Retrieves the entity's component data for the specified componentClass
     *
     * @method getComponent
     * @param componentClass
     * @return {componentClass}
     * @example
     *
     * ```javascript
     *   // get the player entity instance
     *   let playerEntity = new entityService.Entity(entityKey);
     *
     *   // get the players position
     *   let playerPosition = playerEntity.getComponent(Components.PositionComponent);
     * ```
     */
    getComponent(componentClass) {
      return entityService.getComponent(this.key, componentClass);
    }

    /**
     * Retrieves an array of an component data for the specified componentClass types
     *
     * @method getComponents
     * @param componentClasses Param list of component classes to retrieve
     * @return {Array} An array of the entity's component data which was specified in the componentClasses array.
     * @example
     *
     * ```javascript
     *   // get the player entity instance
     *   let playerEntity = new entityService.Entity(entityKey);
     *
     *   // get the players position and movement data
     *   let [playerPosition, playerMovement] = playerEntity.getComponents(Components.PositionComponent, Components.MovementComponent);
     * ```
     */
    getComponents(...componentClasses) {
      return entityService.getComponents(this.key, componentClasses);
    }

    /**
     * Checks if the entity has a Component Class
     * The component class must be registered before calling this method
     *
     * @method hasComponent
     * @param componentClass The class used to register the component
     * @return {Boolean}
     */
    hasComponent(componentClass) {
      return entityService.hasComponent(this.key, componentClass)
    }

    /**
     * Sets the component data for the specified componentClass
     *
     * @method setComponent
     * @param componentClass
     * @param newComponentModel
     * @return {Entity} Chains the current instance of {Entity}
     * @example
     *
     * ```javascript
     *   // get the player entity instance
     *   let playerEntity = new entityService.Entity(entityKey);
     *
     *   // add/update a component
     *   let playerPos = new Components.PositionComponent(0, 0);
     *   playerEntity.setComponent(Components.PositionComponent, playerPos);
     * ```
     */
    setComponent(componentClass, newComponentModel) {
      entityService.setComponent(this.key, componentClass, newComponentModel);
      return this;
    }

    /**
     * Deletes the component data associated with the current entity
     * @method deleteComponent
     * @param componentClass
     * @return {Boolean} true if successful, false if not
     * @example
     *
     * ```javascript
     *   // get the player entity instance
     *   let playerEntity = new entityService.Entity(entityKey);
     *
     *   // delete a component
     *   playerEntity.deleteComponent(Components.PositionComponent);
     * ```
     */
    deleteComponent(componentClass) {
      return entityService.deleteComponent(this.key, componentClass);
    }

  }

  return Entity;
}
