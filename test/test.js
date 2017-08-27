var assert = require('assert');

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
	it('should affect the correct route', function() {
		var initialState = {x: 0, y: 0};
		var result = app(initialState, routeDown(add(1), 'x'));
		assert.equal(result.x, 1);
		assert.equal(result.y, 0);

	});
});

