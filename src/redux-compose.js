'use strict';

import warningInDev from './utils/warning.js'

export const ROUTE_DOWN = "REFLUCT_REROUTE";

export function routeDown(action, property) {
	return {
		type: ROUTE_DOWN,
		path: property,
		nestedAction: action
	}
}

function defaultRerouter(state = {}, action, routes) {
	if(action.type === ROUTE_DOWN) {
		var { path, nestedAction } = action;
		return [state, { [path]: nestedAction }];
	}
	return [state, Object.assign({}, ...routes.map(r => ({ [r]: action }) ))];
}

function getOrUndefined(obj, key) {
	return obj == null ? undefined : obj[key];
}

export default function reroutingCombiner(reducers, rerouter = defaultRerouter) {
	const reducerKeys = Object.keys(reducers);

	var finalReducers = {}
	for(let key of reducerKeys) {
		const reducer = reducers[key];

		if (process.env.NODE_ENV !== 'production' && reducer === undefined) {
			warningInDev(`No reducer for key "${key}"`);
		}

		if(typeof reducer === 'function') {
			finalReducers[key] = reducer;
		}
	}
	const finalReducerKeys = Object.keys(finalReducers);
	Object.freeze(finalReducerKeys);

	return function reduce(state, action) {
		// Could return either [modifiedState, reroutings] or just reroutings
		var [reducedState, reroutings] = rerouter(state, action, finalReducerKeys);
		// TODO: expect(reducedState !== undefined)

		var reroutedState = {}
		var reroutedKeys = Object.keys(reroutings);
		for(var key of reroutedKeys) {
			var reroutedAction = reroutings[key];
			var reducer = finalReducers[key];
			if(reducer === undefined) {
				throw new Error(`Rerouting for "${key}" has no reducer`);
			}
			var oldSubState = getOrUndefined(state, key);
			var newSubState = reducer(oldSubState, reroutedAction);
			// TODO: expect(newSubState !== undefined)

			if(newSubState !== reducedState[key]) {
				reroutedState[key] = newSubState;
			}
		}

		var reducedKeys = Object.keys(reroutedState);
		if(state === reducedState && reducedKeys.length === 0) {
			return state;
		}
		return Object.assign({}, reducedState, reroutedState);
	}
}

