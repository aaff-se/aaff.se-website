import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import SVG from 'components/svg';
import Link from 'components/link';

class Logo extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		ReactDOM.findDOMNode(this).className = 'loaded';
	}
		
	render() {
		const {style} = this.props;
		return <div style={style || {}} id="logo">
			<Link href="/">
				<SVG id="logo" title="logo" spritemapID="logo" />
			</Link>
		</div>
	}
}
Logo.defaultProps = {};

export default Logo;