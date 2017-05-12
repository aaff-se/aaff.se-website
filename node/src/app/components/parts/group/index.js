'use strict';

import React, {Component} from 'react';
import classnames from 'classnames';
import Link from 'components/link';
import ExtLink from 'components/extlink';

class Group extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		const { children, id, className, href=null, title, target } = this.props;
		const classes = classnames('group', className);
		
		if(href && target === "_blank") {
			return <ExtLink id={id || ''} className={classes} href={href} title={title || ""} target={target}>{children}</ExtLink>
		} else if(href) {
			return <Link id={id || ''} className={classes} href={href} title={title || ""}>{children}</Link>
		} else {
			return <div id={id || ''} className={classes}>{children}</div>
		}
	}
	
}
Group.defaultProps = {};

export default Group;