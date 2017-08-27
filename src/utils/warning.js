'use strict';

export default function warningInDev(message) {
	if (process.env.NODE_ENV === 'production') {
		return;
	}
	if (console !== undefined && typeof console.error === 'function') {
		console.error(message);
	}
	try {
		/* Pure convenience for users with break-on-error */
		throw new Error(message);
	}
	catch (e) { ; }
}
