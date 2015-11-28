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
import {KeyMap} from "../repositories/KeyMap.js";
import {EntitiesIterator} from '../iterators/EntitiesIterator.js'

export function componentMapFactory(EntityClass) {

  /**
   * @class ComponentMap
   */
  class ComponentMap extends KeyMap {

    constructor() {
      super();
    }

    /**
     * Iterates each entity key and returns it as an Entity instance
     *
     * @method entities
     * @return An iterator which iterates over {Entity} types
     *
     * @example
     *
     * ```javascript
     *   // get the car component map
     *   let carComponentMap = entityService.getComponentMap(Components.CarComponent);
     *
     *   // iterate over each car entity
     *   for (let carEntity of carComponentMap) { // alternatively: carComponentMap.entities()
     *     // get the current car position
     *     let pos = carEntity.getComponent(Components.PositionComponent);
     *     // update the car position
     *     pos.x += 10;
     *   }
     * ```
     */
    entities() {
      return new EntitiesIterator(this.keysValues, EntityClass);
    }

    /**
     * Returns the first entity in the map
     *
     * @method firstEntity
     * @return The first entity in the map
     * @example
     *
     * ```javascript
     *  // get the player map
     *  let playerComponentMap = entityService.getComponentMap(Components.PlayerComponent);
     *
     *  // get the first player
     *  let playerEntity = playerComponentMap.firstEntity();
     *
     *  // get the players position
     *  let playerPos = playerEntity.getComponent(Components.PositionComponent);
     *
     *  // update the players position
     *  playerPos.x += 100;
     * ```
     */
    firstEntity() {
      if (this.size === 0)
        throw new ReferenceError("Cannot retrieve the first entity from an empty map");

      let nextEntityIter = this.entities(),
        nextEntityResult = nextEntityIter.next();

      return nextEntityResult.value;
    }

    /**
     * Iterates each entity passing each instance to a callbackFn you provide
     *
     * @param callbackFn
     *   @param {Entity} callbackFn.entity the entity instance
     *   @param {ComponentMap} callbackFn.componentMap the current map forEach Entity is being called on
     *
     * @example
     *
     * ```javascript
     *  // get the player map
     *  let playerComponentMap = entityService.getComponentMap(Components.PlayerComponent);
     *
     *  // loop the player entities
     *  playerComponentMap.forEachEntity((playerEntity) => {
     *    // get the players position
     *    let playerPos = playerEntity.getComponent(Components.PositionComponent);
     *
     *    // update the players position
     *    playerPos.x += 100;
     *  }
     * ```
     */
    forEachEntity(callbackFn) {
      let nextResult,
        nextEntityIter = this.entities();

      for (; !(nextResult = nextEntityIter.next()).done;)
        callbackFn(nextResult.value, this);
    }

    // default iterator
    [Symbol.iterator]() {
      return new EntitiesIterator(this.keysValues, EntityClass);
    }
  }

  return ComponentMap;
}
