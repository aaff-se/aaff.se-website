'use strict';

import React, {Component} from 'react';
import classnames from 'classnames';
import window from 'adaptors/window';

class PageContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {transitionClass: 'visible'};
		this.setTransitionClassVisible = this.setTransitionClassVisible.bind(this);
		this.setTransitionClass = this.setTransitionClass.bind(this);
		this.clearTimeouts = this.clearTimeouts.bind(this);
		this.timeouts = [];
		
		this.fadeTime = 300;
	}

	setTransitionClass(theClass="") {
		this.setState({
			transitionClass: theClass
		});
	}
	
	maybeSetBodyOverflowScroll() {
		if(document.documentElement.scrollHeight > document.documentElement.clientHeight) {
			document.body.style.overflowY = 'scroll';
		}
	}
	
	setTransitionClassVisible() {
		this.setState({
			transitionClass: 'visible'
		});
	}
	
	scrollToAnchor(){
		const obj = document.getElementById( window.location.hash.replace('#','') );
		if(!obj) return;
		window.scrollTo(obj.offsetLeft, obj.offsetTop);

	}
	
	clearTimeouts() {
		let i=0;
		while (i < this.timeouts.length) {
			clearTimeout(this.timeouts[i]);
			i++;
		}
	}
	componentWillAppear(didAppearCallback) {
		didAppearCallback();
	}
	
	componentDidAppear() {
	}
	
	componentWillEnter(didEnterCallback) {
		
		this.setTransitionClass('hidden');
		
		this.timeouts[this.timeouts.length] = setTimeout(this.setTransitionClass, this.fadeTime);
		
		if(window.location.hash)
			this.timeouts[this.timeouts.length] = setTimeout(this.scrollToAnchor, (this.fadeTime * 1.5));
			
		this.timeouts[this.timeouts.length] = setTimeout(didEnterCallback, (this.fadeTime * 2));
	}
	
	componentDidEnter() {
		this.setTransitionClass('visible');
		document.body.style.overflowY = '';

	}
	
	componentWillLeave(didLeaveCallback) {
		this.setTransitionClass('fade-out visible');
		this.maybeSetBodyOverflowScroll();
		this.clearTimeouts();
		setTimeout(didLeaveCallback, this.fadeTime);
	}
	
	componentDidLeave() {
		window.scrollTo(0, 0);
	}
	
	render() {
		const { children, className } = this.props;
		return <div className={classnames("page-container", className, this.state.transitionClass)}>{children}</div>;
	}
}

PageContainer.defaultProps = {};

export default PageContainer;