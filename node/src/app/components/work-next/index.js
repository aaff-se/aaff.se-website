'use strict';

import React, {Component} from 'react';

import Image from 'components/image';

import Section from 'components/parts/section';
import Item from 'components/parts/item';
import Link from 'components/link';

class WorkNext extends Component {

	constructor(props) {
		super(props);
	}

	prevPostHtml(){
		const { prevpost } = this.props;
		if(!prevpost) return null;
		return <Item className="prev-link">
				<p>
					<Link title={prevpost.title} href={prevpost.link}>{prevpost.text}</Link>
				</p>
			</Item>
	}
	nextPostHtml(){
		const { nextpost } = this.props;
		return <Item className="next-link">
				<p>
					<Link title={nextpost.title} href={nextpost.link}>{nextpost.text}</Link>
				</p>
			</Item>
	}
	
	render() {
		return <Section className="next-prev-nav">
			{this.nextPostHtml()}
			{this.prevPostHtml()}
		</Section>
	}
	
}
WorkNext.defaultProps = {
	prevpost: false,
	nextpost: {
		link: '/about-contact/#archive',
		title: 'Project Archive',
		text: 'Project Archive'
	}
};

export default WorkNext;