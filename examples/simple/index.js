
var reduxCompose = require('redux-compose');

var combiner = reduxCompose.default;
var routeDown = reduxCompose.routeDown;

function reduce(state = 5, action) {
	if(action.type == 'ADD') {
		return state + action.amount;
	}
	return state;
}

function add(amnt) {
	return { type: 'ADD', amount: amnt };
}

var reduceStore = combiner({ x: reduce, y: reduce });

var state = {x: 5, y: 6};

console.log(state);
state = reduceStore(state, routeDown(add(1), 'x'));
console.log(state);
state = reduceStore(state, routeDown(add(2), 'y'));
console.log(state);

