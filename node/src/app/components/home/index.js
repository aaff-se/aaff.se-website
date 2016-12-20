'use strict';

import React, {Component} from 'react';

import HomeItem from 'components/home-item';

class Home extends Component {

	constructor(props) {
		super(props);
		this.state = props.state;
	}
	
	render() {
		const { currentPage, dynamic } = this.props;
		const contentLength = dynamic.content.length;
		return <main id={"page-"+currentPage}>
			{dynamic.content.map((homeItem, index) => { 
				return <HomeItem key={`home-item-${index}`} data={homeItem} className={(contentLength == (index+1) ? 'last':'')} />; 
			})}
		</main>;
			
	}
	
}
Home.defaultProps = {
	state: {}
};

export default Home;