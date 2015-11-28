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
export class NewEntityIdIterator {

  constructor(startingId) {
    this.nextId = startingId;
  }

  next() {
    return {
      value: this.nextId++,
      done: false
    };
  }

  [Symbol.iterator] () {
    return this;
  }

}
