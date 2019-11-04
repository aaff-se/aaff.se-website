import "@babel/polyfill";

import {EventEmitter} from 'events';


const CursorHelper = Object.assign(
	EventEmitter.prototype,
	{
		setCursor(value) {
			CursorHelper.emit('changeCursor', value);
		}
	}
);

export default CursorHelper;
