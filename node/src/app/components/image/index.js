'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import debounce from'lodash/debounce';
import throttle from'lodash/throttle';
import classnames from 'classnames';

import isRetina from 'lib/isretina';
import inViewport from 'lib/inviewport';
import event from 'lib/event';

class Image extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			visible: false,
			imageWidth: null,
			currentWidth: 0,
			src: null
		};
		this.isRetina = isRetina();
		this.onImageLoad = this.onImageLoad.bind(this);
		this.largestWindowWidth = 0;
		this.handleResize = debounce(this.handleResize.bind(this), 200);
		this.handleResizeFunc = this.handleResizeFunc.bind(this);
		this.handleScroll = throttle(this.handleScroll.bind(this), 200);
		this.imgLoadTimeout=null;
		this.imgObj = null;
		this.placeholderSrc = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 " + props.image.width + " "+ props.image.height +"'%2F%3E";
		this.node = null;
		this.eventNode = null;
	}
	
	componentDidMount() {
		event.add(window, 'resize', this.handleResize);
		event.add(window, 'scroll', this.handleScroll);
		
		this.imgLoadTimeout=setTimeout(()=>{
			this.handleResizeFunc();
			console.log('timeoutFunc');
		},350);
	}
	
	componentWillUnmount() {
		if (this.handleResize.cancel) {
			this.handleResize.cancel();
		}
		if (this.handleScroll.cancel) {
			this.handleScroll.cancel();
		}
		event.remove(window, 'resize', this.handleResize);
		event.remove(window, 'scroll', this.handleScroll);

		if(this.imgObj) {
			this.imgObj.onload = null;
			delete this.imgObj;
		}
		if(this.imgLoadTimeout)
			clearTimeout(this.imgLoadTimeout);
	}

	handleScroll() {
		if(!this.node)
			this.node = ReactDOM.findDOMNode(this);
		if (inViewport(this.node, undefined, 0)) {
			this.setState({ visible: true });
			//image have come in view, remove scroll listeners as we only need to check resizes from now on
			if (this.handleScroll.cancel) {
				this.handleScroll.cancel();
			}
			event.remove(window, 'scroll', this.handleScroll);
			
			//have we loaded the image and stored all the vars yet? maybe not if we come from a transition
			if(!this.state.imageWidth) {
				this.handleResize();
				
			} else {
				this.loadImage();
			}
		}
	}
	handleResize(){
		this.handleResizeFunc();
	}
	handleResizeFunc() {
		let windowWidth = document.documentElement.clientWidth;

		//only do calc if we haven't done it for this size already - or if we couldn't get any proper data
		if(this.largestWindowWidth < windowWidth || !this.state.imageWidth ) {
			
			this.largestWindowWidth = windowWidth;
			
			let size = getComputedStyle(ReactDOM.findDOMNode(this)).width;
			size = Math.round(size.replace('px',''));
			
			this.setState({
				imageWidth: size
			});
			
			//is it visible already? then see if it needs reloading
			if(this.state.visible) {
				this.loadImage();
				return;
			}
				
		}
		
		if(this.state.visible && !this.state.loaded) {
			this.loadImage();
			return;
		}
		
		//is it hidden? then check if it is in view now
		if(!this.state.visible) {
			this.handleScroll();
		}
	}
	
	loadImage(){
		const {image} = this.props;
		const state = this.state;
		let newSrc = false;
		//if the srcs exists, we have a width, and dont already use the biggest one:
		if(image.data.length && state.imageWidth && (image.data[(image.data.length-1)].width !== state.currentWidth) ) {
			
			let i = 0;
			let set = false;
			let multiple = this.isRetina ? 2 : 1; 
			
			while(i < image.data.length) {
				
				let thisImageData = image.data[i];
				
				if( (thisImageData.width / multiple) >= state.imageWidth && state.imageWidth > state.currentWidth ) {
					
					this.setState({ 
						currentWidth: thisImageData.width
					 });
					 newSrc = thisImageData.src;
					 set = true;
					 break;
				}
				i++;
				thisImageData = null;
			}
			
			//we dont have an image big enough, 
			if(!set && state.currentWidth === 0) {
				
				let lastImage = image.data[(image.data.length-1)];
				this.setState({ 
					currentWidth: lastImage.width
				 });
				 newSrc = lastImage.src;
			}
		}
		
		if(newSrc) {
//			this.imgObj = new window.Image();
//			this.imgObj.onload = this.onImageLoad;
//			this.imgObj.onerror = this.onImageLoad;
//			this.imgObj.src = newSrc;



// try to handle the imgs straight in the browser with progressive jpgs instead 
			this.setState({ 
				src: newSrc,
				loaded: true
			});

			
			//the biggest image have been loaded, remove all listeners and cancel future functions
			if(newSrc === image.data[(image.data.length-1)].src) {
				event.remove(window, 'resize', this.handleResize);
				event.remove(window, 'scroll', this.handleScroll);
				if (this.handleResize.cancel) {
					this.handleResize.cancel();
				}
				if (this.handleScroll.cancel) {
					this.handleScroll.cancel();
				}
			}
		}	
	}
	
	onImageLoad() {
		this.setState({ 
			src: this.imgObj.src,
			loaded: true
		});
		delete this.imgObj;
	}
	
	noscriptImageHTML(){
		const {image, className} = this.props;
		if(!image.data.length) return {__html: ''};
		
		let middleImageI = Math.floor(image.data.length/2);
		if(middleImageI < 1) middleImageI = 1;
		
		const imageHtml = '<img class="noscript-img ' + className + '" src="' + image.data[middleImageI].src + '" width="' + image.width + '" height="' + image.height + '" alt="' + (image.alt ? image.alt : '') + '" />';
		
		return {__html: imageHtml};
	}
	
	render() {
		const {image, className} = this.props;
		const state = this.state;
		const classes = classnames( 'image', {'loaded': state.loaded && state.visible }, className);
		const src = (state.src ? state.src : this.placeholderSrc);
		//const src = (state.loaded && state.visible ? state.src : image.base64);
		//const styles = {backgroundColor: (image.color ? image.color : '#ffffff')};
		const styles = {backgroundImage: 'url(' + image.inlined + ')' };
		return <div className={classes} style={styles}>
			<img src={src} width={image.width} height={image.height} alt={image.alt || ''} />
			<noscript dangerouslySetInnerHTML={this.noscriptImageHTML()} />
		</div>
	}
}

Image.defaultProps = {
	image: {}
};

export default Image;