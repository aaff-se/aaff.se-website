'use strict';

import React, {Component} from 'react';

import ArchiveItem from 'components/archive-item';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

class ArchiveList extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		const { archiveItems } = this.props;
		return <Section id="archive">
			<Group>
				<Item className="text no-margin-bottom">
					<p>Project Archive:</p>
				</Item>
				<Item className="line text no-margin-top">
					<p className="line" aria-hidden="true">----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
				</Item>
			</Group>
			
			
			{archiveItems.map(archiveItem => { 
				return <ArchiveItem key={`archive-item-${archiveItem.id}`} data={archiveItem} />; 
			})}
		</Section>;
	}
	
}
ArchiveList.propTypes = { archiveItems: React.PropTypes.array };
ArchiveList.defaultProps = { archiveItems: [] };

export default ArchiveList;