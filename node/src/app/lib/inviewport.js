const isHidden = (element) =>
	element.offsetParent === null;

const offset = (element) => {
	const rect = element.getBoundingClientRect();
	
	return {
		top: rect.top + window.pageYOffset,
		left: rect.left + window.pageXOffset,
	};
};

const inViewport = (element, container, threshold=0) => {
/*
	if (isHidden(element)) {
		return false;
	}
*/

	let top, left, bottom, right;

	if (typeof container === 'undefined' || container === window) {
		top = window.pageYOffset;
		left = window.pageXOffset;
		bottom = top + document.documentElement.clientHeight;
		right = left + document.documentElement.clientWidth;
	} else {
		const containerOffset = offset(container);
		top = containerOffset.top;
		left = containerOffset.left;
		bottom = top + container.offsetHeight;
		right = left + container.offsetWidth;
	}

	const elementOffset = offset(element);
  
	return (
		top < elementOffset.top + element.offsetHeight + threshold &&
		bottom > elementOffset.top - threshold &&
		left < elementOffset.left + element.offsetWidth + threshold &&
		right > elementOffset.left - threshold
	);
};

module.exports = inViewport;