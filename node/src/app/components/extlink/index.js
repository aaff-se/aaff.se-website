'use strict';

import React, {Component} from 'react';
import Track from 'adaptors/track';
import log from 'app/lib/log';

import classnames from 'classnames';

class ExtLink extends Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	
	onClick(event) {
		log(this.props.href);
		Track('set', 'eventCategory', 'Outbound Link');
		Track('set', 'eventAction', 'click');
		Track('set', 'eventLabel', this.props.href);
		Track('send', 'event');
	}
	
	render() {
		const { id, href, className, title, children } = this.props;
		return <a href={href} id={id || ''} className={className || ''} title={title || ''} onClick={this.onClick}>{children}</a>;
	}
	
}
ExtLink.defaultProps = {};

export default ExtLink;