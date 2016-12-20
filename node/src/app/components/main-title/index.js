'use strict';

import React, {Component} from 'react';

import throttle from'lodash/throttle';
import classnames from 'classnames';

import event from 'app/lib/event';

class MainTitle extends Component {

	constructor(props) {
		super(props);

		this.state = {
			visible: true,
			prevScroll: 0,
			transitionClass: 'visible'
		};
		this.handleScroll = throttle(this.handleScroll.bind(this), 200);

		this.setTransitionClassVisible = this.setTransitionClassVisible.bind(this);
		this.setTransitionClassHidden = this.setTransitionClassHidden.bind(this);
		this.setTransitionClassFadeout = this.setTransitionClassFadeout.bind(this);
		this.setTransitionClass = this.setTransitionClass.bind(this);
		
		this.clearTimeouts = this.clearTimeouts.bind(this);
		
		this.timeouts = [];
	}

	setTransitionClass(theClass="") {
		this.setState({
			transitionClass: theClass
		});
	}
	
	setTransitionClassVisible() {
		this.setState({
			transitionClass: 'visible'
		});
	}
	setTransitionClassHidden() {
		this.setState({
			transitionClass: 'hidden'
		});
	}
	setTransitionClassFadeout() {
		this.setState({
			transitionClass: 'fade-out visible'
		});
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
		
		this.setTransitionClassHidden();
		didEnterCallback();
		
	}


	//we run all the timeouts in this function, to make sure we can remove all the timeouts if a link is clicked
	componentDidEnter() {
		
		this.timeouts[this.timeouts.length] = setTimeout(this.setTransitionClass, 150);
		
		this.timeouts[this.timeouts.length] = setTimeout(this.setTransitionClassVisible, 200);
		
	}
	
	componentWillLeave(didLeaveCallback) {
		//just remove it
		this.clearTimeouts();
		this.setTransitionClassFadeout();
		setTimeout(didLeaveCallback, 150);
	}
	
	componentDidLeave() {
		//gone!
		this.setTransitionClassHidden();
	}

	componentDidMount() {
		event.add(window, 'scroll', this.handleScroll);
	}
	
	componentWillUnmount() {
		if (this.handleScroll.cancel) {
			this.handleScroll.cancel();
		}
		event.remove(window, 'scroll', this.handleScroll);
	}
	
	handleScroll() {
		const { prevScroll } = this.state; 
		const thisScroll = window.pageYOffset;
		let visible = true;
		let windowWidth = document.documentElement.clientWidth;
		let windowHeight = document.documentElement.clientHeight;

		if(thisScroll >= prevScroll && thisScroll > 32 ) {
			//now check for window size
			if(windowWidth >= 768 || ( windowWidth > windowHeight && windowWidth > 470 ) )
				visible = false;
		} 
		
		this.setState({
			visible: visible,
			prevScroll: (thisScroll < 0 ? 0 : thisScroll)
		});
	}

	
	render() {
		
		const state = this.state;
		const classes = classnames( 'main-title', state.transitionClass, {'fade-out': !state.visible} )
		
		const { dynamic } = this.props;
		return <div className={classes}>
			{(dynamic.maintitle ? <h2>{dynamic.maintitle}</h2> : null)}
			{(dynamic.subtitle ? <h3>{dynamic.subtitle}</h3> : null)}
		</div>;
	}
	
}
MainTitle.defaultProps = {
	state: {}
};

export default MainTitle;