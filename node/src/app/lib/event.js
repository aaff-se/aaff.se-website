function add(element, eventName, fn) {
		if (element.addEventListener)
			element.addEventListener(eventName, fn, false);
		else if (element.attachEvent)
			element.attachEvent('on' + eventName, fn);
	}
	
function remove(element, eventName, fn) {
		if (element.removeEventListener)
			element.removeEventListener(eventName, fn, false);
		else if (element.detachEvent)
			element.detachEvent('on' + eventName, fn);
	}

export default {
	add: add,
	remove: remove
};