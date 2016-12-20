'use strict';

import React, {Component} from 'react';
import debounce from'lodash/debounce';

import window from 'adaptors/window';

import event from 'app/lib/event';
import SmoothScroll from 'app/lib/smoothscroll';

import ArchiveList from 'components/archive-list';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

class AboutContact extends Component {

	constructor(props) {
		super(props);
		this.state = props.state;
		this.state.introVisible = false;
		this.state.height = '100vh';
		this.allInternalLinks = {};
		this.handleResize = debounce(this.handleResize.bind(this), 200);
		this.addLinkListeners = this.addLinkListeners.bind(this);
		this.removeLinkListeners = this.removeLinkListeners.bind(this);
	}
	
	componentDidMount() {
		event.add(window, 'resize', this.handleResize);
		this.handleResize();
		this.addLinkListeners();
	}
	
	componentWillUnmount() {
		if (this.handleResize.cancel) {
			this.handleResize.cancel();
		}
		event.remove(window, 'resize', this.handleResize);
		this.removeLinkListeners();
	}
	
	addLinkListeners() {
		this.allInternalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
		var a,i;
		if(this.allInternalLinks.length)
			for(i=this.allInternalLinks.length; a=this.allInternalLinks[--i];){
				event.add(a, 'click', this.onClick);
			}
	}
	
	removeLinkListeners() {
		var a,i;
		if(this.allInternalLinks.length)
			for(i=this.allInternalLinks.length; a=this.allInternalLinks[--i];){
				event.remove(a, 'click', this.onClick);
			}
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
			width: windowWidth,
			introVisible: true
		});
	}
	
	onClick(e){
		e.preventDefault();
		const target = document.getElementById( e.currentTarget.getAttribute('href').replace('#','') );
		SmoothScroll(target);
	};

	render() {
		const { currentPage, dynamic, contact } = this.props;
		const state = this.state;
		const style = {
			minHeight: state.height
		};

		const introClass = (state.introVisible ? 'visible' : '');
		
		return <main id={"page-"+currentPage}>
			<section id="about_contact" className={introClass}>
				<div style={style} className="inner">
					<Group className="about">
						<Item className="text">
							<p dangerouslySetInnerHTML={{__html: dynamic.content}} />
						</Item>
						<Item className="text half">
							<p><a href={contact.phone_href}>{contact.phone_text}</a></p>
						</Item>
						<Item className="text half last">
							<p><a href={contact.email_href}>{contact.email_text}</a></p>
						</Item>
						<Item className="text half">
							<p><a target="_blank" href={contact.instagram}>instagram</a><br/><a target="_blank" href={contact.facebook}>facebook</a></p>
						</Item>
						<Item className="text half last">
							<p><a target="_blank" href={contact.linkedin}>linkedin</a><br/><a target="_blank" href={contact.twitter}>twitter</a><br/><a target="_blank" href={contact.github}>github</a></p>
						</Item>
					</Group>
					<div className="clear"></div>
				</div>
			</section>
			<ArchiveList archiveItems={dynamic.archive} />
		</main>
	}
	
}
AboutContact.defaultProps = {
	state: {}
};

export default AboutContact;