'use strict';

import React, {Component} from 'react';

class SVG extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		const { className, role, title, spritemapID, style, id } = this.props;
		return <svg id={id || ''} 
			className={className || ''}
			role={role || 'img'}
			title={title}
			dangerouslySetInnerHTML={{
			__html: `<title>${title}</title><use xlink:href='/spritemap.svg#${spritemapID}'/>`
			}}
			style={style}
		/>;
	}
	
};
SVG.defaultProps = {};

export default SVG;



