
var refluct = require('refluct');

var combiner = refluct.default;
var routeDown = refluct.routeDown;

function reduceX(state = 5, action) {
	if(action.type == 'ADD') {
		return state + action.amount;
	}
	return state;
}

function reduceY(state = 5, action) {
	if(action.type == 'ADD') {
		return state + 2 * action.amount;
	}
	return state;
}

function add(amnt) {
	return { type: 'ADD', amount: amnt };
}

var reduceStore = combiner({ x: reduceX, y: reduceY });

var state = {x: 5, y: 6};

console.log(state);
state = reduceStore(state, routeDown(add(1), 'x'));
console.log(state);
state = reduceStore(state, routeDown(add(2), 'y'));
console.log(state);

