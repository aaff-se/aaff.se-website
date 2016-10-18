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
	}

	setTransitionClass(theClass="") {
		this.setState({
			transitionClass: theClass
		});
	}
	
	maybeSetBodyOverflowScroll() {
		if(document.documentElement.scrollHeight > document.documentElement.clientHeight) {
			document.getElementsByTagName("body")[0].style.overflowY = 'scroll';
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
	
	componentWillAppear(didAppearCallback) {
		didAppearCallback();
	}
	
	componentDidAppear() {
	}
	
	componentWillEnter(didEnterCallback) {
		this.setTransitionClass('hidden');
		
		setTimeout(this.setTransitionClass, 160);
		if(window.location.hash)
			setTimeout(this.scrollToAnchor, 290);
		setTimeout(didEnterCallback, 300);
	}
	
	componentDidEnter() {
		this.setTransitionClass('visible');
		document.getElementsByTagName("body")[0].style.overflowY = '';

	}
	
	componentWillLeave(didLeaveCallback) {
		this.setTransitionClass('fade-out visible');
		this.maybeSetBodyOverflowScroll();
		setTimeout(didLeaveCallback, 150);
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