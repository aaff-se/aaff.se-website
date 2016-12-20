import React, {Component} from 'react';
import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

class Footer extends Component {
	
	constructor(props) {
		super(props);
		this.data = props.data;
	}

	render() {

		const data = this.data;
		const {style} = this.props;
		return <footer>
			<Section>
				<Item className="text info">
					<p>
						<a href={data.phone_href}>{data.phone_text}</a><br/>
					</p>
				</Item>
				<Item className="text info last">
					<p>
						<a href={data.email_href}>{data.email_text}</a>
					</p>
				</Item>
			</Section>
		</footer>;
	}
}
Footer.defaultProps = {
	data : {
		'phone_text': '',
		'phone_href': '',
		'email_text': '',
		'email_href': '',
	}
};

export default Footer;
