'use strict';

import React, {Component} from 'react';
import classnames from 'classnames';

class Item extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		const { children, id, className, style, html } = this.props;
		const classes = classnames('item', className);
			return <div style={style || {} } id={id || ''} className={classes}>{children}</div>
	}
	
}
Item.defaultProps = {};

export default Item;