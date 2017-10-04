'use strict';

import React, {Component} from 'react';
import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

class Footer extends Component {
	
	constructor(props) {
		super(props);
	}
	
	linelength(string){
		if(!string) return '';
		let returnStr = '';
		let length = string.length;
		while (length--)
			returnStr += '-';
		return returnStr;
	}
	
	render() {

		const {contact, meta} = this.props;
		return <footer>
			<Section>
				<Item className="text title">
					<p>{meta.title}<br/>{this.linelength(meta.title)}</p>
				</Item>
				<Item className="text info">
					<p>
						<a href={contact.phone_href}>{contact.phone_text}</a><br/>
						<a href={contact.email_href}>{contact.email_text}</a>
					</p>
				</Item>
			</Section>
		</footer>;
	}
}
Footer.defaultProps = {
	meta: {},
	contact: {}
};

export default Footer;
