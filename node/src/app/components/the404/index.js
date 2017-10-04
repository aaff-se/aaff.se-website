'use strict';

import React, {Component} from 'react';
import debounce from'lodash/debounce';

import window from 'adaptors/window';

import event from 'app/lib/event';

import Group from 'components/parts/group';
import Item from 'components/parts/item';

class The404 extends Component {
	
	constructor(props) {
		super(props);
		this.state = props.state;
		this.state.height = '100vh';
		this.handleResize = debounce(this.handleResize.bind(this), 20);
	}
	
	componentDidMount() {
		event.add(window, 'resize', this.handleResize);
		this.handleResize();
	}
	
	componentWillUnmount() {
		if (this.handleResize.cancel) {
			this.handleResize.cancel();
		}
		event.remove(window, 'resize', this.handleResize);
	}
	
	handleResize() {
		const {height, width} = this.state;
		const windowWidth = document.documentElement.clientWidth;
		const windowHeight = document.documentElement.clientHeight;
		let percent = (windowHeight / height);
		
		//if address-bar in mobile is toggled we don't want to resize the intro box
		if(width === windowWidth && (percent < 1.3333 && percent > 0.75) ) return;
		
		this.setState({
			height: windowHeight, 
			width: windowWidth
		});
	}
	
	
	render() {
		const { currentPage, statusCode } = this.props;
		const state = this.state;
		const style = {
			minHeight: state.height
		};
		
		return <main id={"page-"+currentPage}>
			<canvas id="bg-canvas"></canvas> 
			<section>
				<div style={style} className="inner">
					<Group>
						<Item className="text">
							<p>404</p>
							<p>page not found</p>
						</Item>
					</Group>
					<div className="clear"></div>
				</div>
			</section>
		</main>
	}

}
The404.defaultProps = {
	state: {}
};

export default The404;