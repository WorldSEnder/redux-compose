var assert = require('assert');

var createStore = require('redux').createStore;

var compose = require('../lib/redux-compose.js').default;
var routeDown = require('../lib/redux-compose.js').routeDown;

function reduce(state = 0, action) {
	if(action.type === 'ADD') {
		return state + action.amount;
	}
	return state;
}
function add(amnt = 1) {
	return { type: 'ADD', amount: amnt }
}

var app = compose({ x: reduce, y: reduce });

describe('redux-compose', function() {
	it('should initialize the store', function() {
		let store = createStore(app);
		const result = store.getState();
		
		assert.equal(result.x, 0);
		assert.equal(result.y, 0);
	});
	it('should affect the correct route', function() {
		let store = createStore(app);
		store.dispatch(routeDown(add(1), 'x'));
		var result = store.getState();

		assert.equal(result.x, 1);
		assert.equal(result.y, 0);

	});
	it('should distribute non-route-down actions', function() {
		let store = createStore(app);
		store.dispatch(add(1));
		var result = store.getState();

		assert.equal(result.x, 1);
		assert.equal(result.y, 1);
	});
});

