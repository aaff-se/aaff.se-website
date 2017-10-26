'use strict';

import React, {Component} from 'react';

import Image from 'components/image';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

class WorkRow extends Component {

	constructor(props) {
		super(props);
	}
	
	itemContent(data) {
		
		if(data.type == 'text') {
			return <Item className="text">
				{(data.text ? <p dangerouslySetInnerHTML={{__html: data.text}} /> : null)}
			</Item>;
		}
		
		if(data.type == 'image') {
			return <Item>
			
					{(data.image.main && !data.image.alternative ? <Image image={data.image.main} /> : null)}
	
					{(data.image.main && data.image.alternative ? <Image className="main" image={data.image.main} /> : null)}
					
					{(data.image.alternative ? <Image className="alternative" image={data.image.alternative} /> : null)}
				
			</Item>;
		}
	}
	
	render() {
		const { data } = this.props;
		const className = (data.full ? 'full':'');
		return <Section className={className}>
			{this.itemContent(data)}
		</Section>
	}
	
}
WorkRow.defaultProps = {
	data: {}
};

export default WorkRow;