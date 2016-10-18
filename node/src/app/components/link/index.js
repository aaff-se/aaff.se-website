'use strict';

import React, {Component} from 'react';
import classnames from 'classnames';

import Flux from 'app/flux';

class Link extends Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	
	onClick(event) {
		
		//we cant use our cool navigation - just reload as usual
		if((" " + document.documentElement.className + " " ).indexOf( " no-history " ) > -1){
			 return;
		}
		
		//the user wants to open in new window, tab, or whatever, oblidge
		if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){
			 return;
		}
		
		event.preventDefault();
		this.props.onClick && this.props.onClick();
		Flux.navigate(this.props.href);
	}
	
	render() {
		const { id, href, className, title, children } = this.props;
		return <a href={href} id={id || ''} className={className || ''} title={title || ''} onClick={this.onClick}>{children}</a>;
	}
	
}
Link.defaultProps = {};

export default Link;