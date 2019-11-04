//import env from 'adaptors/env';
import window from 'adaptors/window';

export default function () {
	window.env.verbose && console.log.apply(console, arguments);
}
