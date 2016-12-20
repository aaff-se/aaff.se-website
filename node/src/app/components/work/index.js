'use strict';

import React, {Component} from 'react';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';
import WorkRow from 'components/work-row';
import WorkNext from 'components/work-next';

class Work extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		const { currentPage, dynamic } = this.props;
		let i = 0;
		return <main id={"page-"+currentPage}>
			{dynamic.content.map(workRow => {
				i++;
				return <WorkRow key={`row-${i}`} data={workRow} />;
			})}
			<WorkNext prevpost={dynamic.prevpost} nextpost={dynamic.nextpost} />
		</main>
	}
	
}
Work.defaultProps = {
};

export default Work;