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

export class KeysIterator {

  constructor(keysValuesArray) {
    this.iteratedNextIndex = 0;
    this.iteratedObject = keysValuesArray;
  }

  next() {
    let keyValueIndex = this.iteratedNextIndex,
      length = this.iteratedObject.length,
      key,
      done;

    key = this.iteratedObject[keyValueIndex];
    for (; (key === undefined || key === null) && ((keyValueIndex += 2) < length);)
      key = this.iteratedObject[keyValueIndex];

    done = (keyValueIndex >= length);
    this.iteratedNextIndex = keyValueIndex + 2;

    return {
      value: key,
      done: done
    };
  }

  [Symbol.iterator] () {
    return this;
  };

}

export class EntriesIterator {

  constructor(keysValuesArray) {
    this.iteratedNextIndex = 0;
    this.iteratedObject = keysValuesArray;
  }

  next() {
    let keyIterResult = this.nextKey_(),
      done = keyIterResult.done,
      value;

    if (done === false)
      value = [
        // key
        keyIterResult.value,
        // value
        this.iteratedObject[this.iteratedNextIndex - 1]
      ];

    return {
      value: value,
      done: done
    };
  }

  [Symbol.iterator] () {
    return this;
  };

}

EntriesIterator.prototype.nextKey_ = KeysIterator.prototype.next;

export class ValuesIterator {

  constructor(keysValuesArray) {
    this.iteratedNextIndex = 0;
    this.iteratedObject = keysValuesArray;
  }

  next() {
    let keyIterResult = this.nextKey_(),
      done = keyIterResult.done,
      value;

    if (done === false)
      value = this.iteratedObject[this.iteratedNextIndex - 1];

    return {
      value: value,
      done: done
    };
  }

  [Symbol.iterator] () {
    return this;
  };

}

ValuesIterator.prototype.nextKey_ = KeysIterator.prototype.next;
