'use strict';

import React, {Component} from 'react';

class Section extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		const { children, id, className, style } = this.props;
		
		return <section style={style} id={id || ''} className={className}>
			<div className="inner">
				{children}
				<div className="clear"></div>
			</div>
		</section>
	}
	
}
Section.defaultProps = {};

export default Section;