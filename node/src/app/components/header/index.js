import React, {Component} from 'react';
import throttle from 'lodash/throttle';
import classnames from 'classnames';

import event from 'lib/event';

import Link from 'components/link';

class Header extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
			prevScroll: 0
		};
		this.handleScroll = throttle(this.handleScroll.bind(this), 20);
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
		
		if(thisScroll >= prevScroll && thisScroll > 32 ) {
			visible = false;
		} 
		
		this.setState({
			visible: visible,
			prevScroll: (thisScroll < 0 ? 0 : thisScroll)
		});
	}

	render() {

		const state = this.state;
		const classes = classnames( 'text', {'hidden': !state.visible} );
		
		return <header className={classes}>
			<h1><Link href="/">AAFF</Link></h1>
			<p><Link href="/about-contact/">about / contact</Link></p>
		</header>;
	}
}

export default Header;
