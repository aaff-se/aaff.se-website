const isHidden = (element) =>
	element.offsetParent === null;

const offset = (element) => {
	const rect = element.getBoundingClientRect();
	
	return {
		top: rect.top + window.pageYOffset,
		left: rect.left + window.pageXOffset,
	};
};

const inCenter = (element, container) => {
	if (isHidden(element)) {
		return false;
	}

	let top, left, centerTopBottom, centerLeftRight;

	if (typeof container === 'undefined' || container === window) {
		top = window.pageYOffset;
		left = window.pageXOffset;
		centerTopBottom = top + (document.documentElement.clientHeight / 2)
		centerLeftRight = left + (document.documentElement.clientWidth / 2)
	} else {
		const containerOffset = offset(container);
		top = containerOffset.top;
		left = containerOffset.left;
		centerTopBottom = top + (container.offsetHeight / 2)
		centerLeftRight = left + (container.offsetWidth / 2)
	}

	const elementOffset = offset(element);
  
	return (
		centerTopBottom < elementOffset.top + element.offsetHeight &&
		centerTopBottom > elementOffset.top &&
		centerLeftRight < elementOffset.left + element.offsetWidth &&
		centerLeftRight > elementOffset.left
	);
};

module.exports = inCenter;