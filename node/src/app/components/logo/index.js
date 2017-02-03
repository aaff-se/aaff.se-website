import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import debounce from'lodash/debounce';
import throttle from'lodash/throttle';

import event from 'lib/event';

import SVG from 'components/svg';
import Link from 'components/link';

class Logo extends Component {
	
	constructor(props) {
		super(props);
		this.state = props.state;
		this.prevProps = this.props;
		this.startSpinner = this.startSpinner.bind(this);
		this.spinnerFunc = this.spinnerFunc.bind(this);
		this.finalSpin = true;
		this.spinInterval = null;
	}
	
	componentDidMount() {
		this.setState({
			loaded:true
		});
	}
	componentWillUnmount() {
		if(this.spinInterval) {
			clearInterval(this.spinInterval);
			this.spinInterval = null;
		}
	}
	
	componentWillReceiveProps(newProps){
		if(!newProps.dynamic) {
			this.startSpinner();
			
		} else if(this.prevProps.dynamic != newProps.dynamic) {
			this.startSpinner();
			this.finalSpin = true;
		}
		
		this.prevProps = newProps;
	}
	startSpinner() {
		if(this.spinInterval)
			return;
		this.finalSpin = false;
		this.setState({
			animating:true
		});
		this.spinInterval = setInterval(this.spinnerFunc,450);
		console.log('start spin');
	}
	spinnerFunc(){
		if(this.finalSpin) {
			clearInterval(this.spinInterval);
			this.spinInterval = null;
			this.setState({
				animating:false
			});
			console.log('final spin');
			
		} else {
			
			this.setState({
				animating:!this.state.animating
			});
		}
		
	}
	render() {
		const {loaded, style,animating} = this.state;
		const classes = classnames( {'loaded': loaded });
		const wrapperClasses = classnames( 'inner-wrapper', {'animating': animating });
		return <div className={classes} id="logo" >
			<div style={style} className={wrapperClasses}>
				<Link href="/">
					<SVG id="logo" title="logo" spritemapID="logo" />
				</Link>
			</div>
		</div>
	}
}
Logo.defaultProps = {
	state: {
		loaded:false,
		style:{},
		animating: false
	}
};

export default Logo;