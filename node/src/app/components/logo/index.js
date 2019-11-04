'use strict';

import React, {useState, useEffect} from 'react';

import SVG from 'components/svg';
import Link from 'components/link';

const Logo = (props) => {

  const [loaded, setLoaded] = useState(false);

	useEffect(()=>{
		setLoaded(true);
	},[]);


	return (
    <div className={(loaded ? 'loaded':'')} id="logo">
			<div className="inner-wrapper">
				<Link href="/">
					<SVG id="logo" title="logo" spritemapID="logo" />
				</Link>
			</div>
		</div>
	);
}
Logo.defaultProps = {
	dynamic: false
}
export default Logo;
