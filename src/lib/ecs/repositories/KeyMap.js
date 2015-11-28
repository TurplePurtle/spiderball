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
import {KeysIterator, EntriesIterator, ValuesIterator} from '../iterators/KeyMapIterators.js';

let queryifySync;
if (typeof queryify !== typeof undefined)
  queryifySync = queryify.sync;

export class KeyMap {

  static create(keysValues, keysIndices, valueCount) {
    let retKeyMap = new KeyMap();
    retKeyMap.keysValues = keysValues;
    retKeyMap.keysIndices_ = keysIndices;
    retKeyMap.valueCount_ = valueCount;
    return retKeyMap;
  }

  static createFromIterator(entriesIterator) {
    let retKeyMap = new KeyMap(),
      keysIndices_ = retKeyMap.keysIndices_,
      keysValues = retKeyMap.keysValues,
      counter = 0,
      key,
      value,
      nextResult;

    let iterator = entriesIterator[Symbol.iterator]();
    for(; !(nextResult=iterator.next()).done;) {
      key = nextResult.value[0];
      value = nextResult.value[1];
      keysIndices_[key] = counter;
      keysValues.push(key);
      keysValues.push(value);
      counter += 2;
    }

    retKeyMap.valueCount_ = counter / 2;
    return retKeyMap;
  }

  static createFromArray(keysValuesArray) {
    return KeyMap.createFromIterator(new EntriesIterator(keysValuesArray));
  }

  static createFromJSON(serializedJSON) {
    let deserializedMap = JSON.parse(serializedJSON);
    deserializedMap.__proto__ = KeyMap.prototype;
    return deserializedMap;
  }

  constructor() {
    this.clear();
  }

  clear() {
    this.keysIndices_ = {};
    this.keysValues = [];
    this.valueCount_ = 0;
  }

  get size() {
    return this.valueCount_;
  }

  get(key) {
    let keyIndex = this.keysIndices_[key];
    return this.keysValues[keyIndex + 1];
  }

  set(key, value) {
    let keyIndex = this.keysIndices_[key];
    if (keyIndex === undefined) {
      keyIndex = this.keysValues.length;
      this.keysIndices_[key] = keyIndex;
      this.keysValues.push(key);
      this.keysValues.push(value);
      this.valueCount_++;
    } else {
      this.keysValues[keyIndex + 1] = value;
    }
  }

  delete(key) {
    let keyIndex = this.keysIndices_[key];
    if (keyIndex === undefined)
      return false;

    this.keysValues[keyIndex++] = undefined;
    this.keysValues[keyIndex] = undefined;
    this.keysIndices_[key] = undefined;

    this.valueCount_--;

    return true;
  }

  has(key) {
    return this.keysIndices_[key] !== undefined;
  }

  forEach(callbackFn) {
    let keyValueIndex = 0,
      key,
      value;

    for (; keyValueIndex < this.keysValues.length; keyValueIndex += 2) {
      key = this.keysValues[keyValueIndex];
      if (key === undefined || key === null)
        continue;

      value = this.keysValues[keyValueIndex + 1];
      callbackFn(value, key, this);
    }
  }

  keys() {
    return new KeysIterator(this.keysValues);
  }

  entries() {
    return new EntriesIterator(this.keysValues);
  }

  values() {
    return new ValuesIterator(this.keysValues);
  }

  // default iterator
  [Symbol.iterator] () {
    return new ValuesIterator(this.keysValues);
  }

  queryValues(query) {
    return queryifySync.filter(this, query);
  }

}
