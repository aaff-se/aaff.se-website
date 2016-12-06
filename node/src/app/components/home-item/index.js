'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import throttle from'lodash/throttle';
import debounce from'lodash/debounce';

import window from 'adaptors/window';

import event from 'app/lib/event';
import inCenter from 'app/lib/incenter';
import inFull from 'app/lib/infull';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';
import Image from 'components/image';

class HomeItem extends Component {

	constructor(props) {
		super(props);
		this.state = props.state;
		this.state.sectionStyle = { };
		
		this.node = null;
		
		this.handleScroll = throttle(this.handleScroll.bind(this), 200);
		this.handleResize = debounce(this.handleResize.bind(this), 200);
	}
	
	componentDidMount() {
		event.add(window, 'scroll', this.handleScroll);
		event.add(window, 'resize', this.handleResize);
		setTimeout(this.handleScroll, 250);

	}
	
	componentWillUnmount() {
		if (this.handleScroll.cancel) {
			this.handleScroll.cancel();
		}
		if (this.handleResize.cancel) {
			this.handleResize.cancel();
		}
		event.remove(window, 'scroll', this.handleScroll);
		event.remove(window, 'resize', this.handleResize);
	}

	handleScroll() {
		
		//check if this section is centered
		const {isCurrent}  = this.state;
		
		if(!this.node)
			this.node = ReactDOM.findDOMNode(this);
			
		if(inCenter(this.node) || inFull(this.node)) {
			if(!isCurrent){
				this.setState({isCurrent: true});
			}
		} else {
			if(isCurrent){
				this.setState({isCurrent: false});
			}
		}
	}
	
	handleResize() {
		
		//run the scroll-check on resize as well
		this.handleScroll();
	}
	
	render() {
		const { data,className } = this.props;
		const {sectionStyle, isCurrent}  = this.state;
		const classNames = classnames( className, {'current': isCurrent });
		
		return <Section className={classNames}>
			
			<Group href={data.link} title={data.client + ' - ' + data.type}>
				<Item className="image-wrapper">
				
					{(data.image.main && !data.image.alternative ? <Image image={data.image.main} /> : null)}
	
					{(data.image.main && data.image.alternative ? <Image className="main" image={data.image.main} /> : null)}
					
					{(data.image.alternative ? <Image className="alternative" image={data.image.alternative} /> : null)}
				</Item>
			
				<Item className="title">
					<h2>{data.client}</h2><h3>{data.type}</h3>
				</Item>
			</Group>
			
		</Section>;
	}
	
}
HomeItem.propTypes = { data: React.PropTypes.object };
HomeItem.defaultProps = { 
	data: {},
	className: {},
	state: {}

};

export default HomeItem;

