'use strict';

import React, {Component} from 'react';

import classnames from 'classnames';

import Group from 'components/parts/group';
import Item from 'components/parts/item';

class ArchiveItem extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		const { data } = this.props;
		const titleClass = classnames({ 'linked' : (data.link && !data.link_dead) }, { 'deadlink' : (data.link_dead) });
		
		return <Group href={(data.link && !data.link_dead ? data.link : null)} target="_blank" title={data.title} >
		
			<Item className="title text">
				<h3 className={titleClass}>{data.title}</h3>
				{(data.agency ? <p className="agency">Agency: {data.agency}</p> : null)}
			</Item>
			
			<Item className="info text">
				<p dangerouslySetInnerHTML={{ __html: data.info }} />
				<p>/ {data.year}</p>
			</Item>
			
			<Item className="line text">
				<p className="line" aria-hidden="true">----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
			</Item>
				
		</Group>;
	}
	
}
ArchiveItem.propTypes = { data: React.PropTypes.object };
ArchiveItem.defaultProps = { data: {} };

export default ArchiveItem;