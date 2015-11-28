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
 * ###An entity component system library for JavaScript
 *
 * @module ecsjs
 * @main ecsjs
 */
import * as functionPolyfill from './polyfills/function.js';
import {EntityService} from './services/EntityService.js';

// exports to es6
export const ecs = {
	EntityService
};

if (typeof window !== "undefined") {
	// exports to window
	window.ecs = ecs;
}else if (typeof module !== "undefined" && module !== null) {
	// exports to nodejs
	module.exports = ecs;
} else {
	let indirectEval = (0, eval),
		globalThisArg = indirectEval('this');

	globalThisArg.ecs = ecs;
}
