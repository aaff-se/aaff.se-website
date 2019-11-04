'use strict';
import React, { useState, useEffect, useRef } from 'react';

import debounce from'lodash/debounce';
import throttle from'lodash/throttle';
import classnames from 'classnames';
import window from 'adaptors/window';

import isRetina from 'lib/isretina';
import inViewport from 'lib/inviewport';
import event from 'lib/event';


const Image = (props) => {

  const {image, className} = props;

  const localIsRetina = isRetina();
  const placeholderSrc = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 " + props.image.width + " "+ props.image.height +"'%2F%3E";

  const [currentWidth, setCurrentWidth] = useState(0);
  const [imageWidth, setImageWidth] = useState(null);
  const [inited, setInited] = useState(false);
  const [largestWindowWidth, setLargestWindowWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showInlined, setShowInlined] = useState(true);
  const [src, setSrc] = useState(placeholderSrc);
  const [visible, setVisible] = useState(false);

  const imgEl = useRef(null);

  const classes = classnames( 'image', {'loaded': loaded && visible, 'loaded': loaded && visible }, className);
  const styles = showInlined ? {backgroundColor: 'transparent', backgroundImage: 'url(' + image.inlined + ')' } : {};


    let imgLoadTimeout=null;
    let afterImgLoadTimeout=null;
    let imgObj = null;

  //run on mount/unmount
  useEffect(() => {

    if(!inited) {
      event.add(window, 'resize', debounceResize);
      event.add(window, 'scroll', throttleScroll);
      setInited(true);
    }

    return () => {
      if (debounceResize.cancel)
        debounceResize.cancel();
      if (throttleScroll.cancel)
        throttleScroll.cancel();
      event.remove(window, 'resize', debounceResize);
      event.remove(window, 'scroll', throttleScroll);
      if(imgObj) {
        imgObj.onload = null;
        imgObj.onerror = null;
        imgObj = null;
      }
      if(imgLoadTimeout)
        clearTimeout(imgLoadTimeout);
      if(afterImgLoadTimeout)
        clearTimeout(afterImgLoadTimeout);
    };

  },[]);

  //run on updates
  useEffect(() => {

    if(!imageWidth)
      handleResize();

    //is it hidden? then check if it is in view now
    if(!visible)
      handleScroll();

    //is it visible already? then see if it needs reloading
    if(visible)
      loadImage();

  },[visible,loaded,imageWidth]);

  const handleScroll = () => {
    if (inViewport(imgEl.current, undefined, 0)) {
      setVisible(true);

      //image have come in view, remove scroll listeners as we only need to check resizes from now on
      if (throttleScroll.cancel) {
        throttleScroll.cancel();
      }
      event.remove(window, 'scroll', throttleScroll);
    }

  }
  const throttleScroll = throttle(handleScroll, 200);

  const handleResize = () => {
    let windowWidth = document.documentElement.clientWidth;

    //only do calc if we haven't done it for this size already - or if we couldn't get any proper data
    if(largestWindowWidth < windowWidth || !imageWidth ) {

      setLargestWindowWidth(windowWidth);
      let size = getComputedStyle(imgEl.current).width;
      size = Math.round(size.replace('px',''));

      setImageWidth(size);
    }
  }
  const debounceResize = debounce(handleResize, 200);

  const loadImage = () => {
    let newSrc = false;
    let newWidth = false;
    //if the srcs exists, we have a width, and dont already use the biggest one:
    if(image.data.length && imageWidth && (image.data[(image.data.length-1)].width !== currentWidth) ) {

      let i = 0;
      let set = false;
      let multiple = 1;
      if(window.devicePixelRatio)
        multiple = window.devicePixelRatio
      else
        multiple = localIsRetina ? 2 : 1;

      while(i < image.data.length) {

        let thisImageData = image.data[i];

        if( (thisImageData.width / multiple) >= imageWidth && imageWidth > (currentWidth / multiple ) ) {

          newSrc = thisImageData.src;
          newWidth = thisImageData.width;
          set = true;
          break;
        }
        i++;
        thisImageData = null;
      }

      //we dont have an image big enough,
      if(!set && currentWidth === 0) {

        let lastImage = image.data[(image.data.length-1)];
        newSrc = lastImage.src;
        newWidth = lastImage.width;
      }
    }

    if(newSrc) {

      //newSrc = newSrc.replace('https://cms.aaff.se/wp-content','');
      imgObj = new window.Image();
      imgObj.onload = onImageLoad;
      imgObj.onerror = onImageError;
      imgObj.width = newWidth;
      imgObj.src = newSrc;

    }
  }

  const onImageLoad = () => {

    if(!loaded) {
      afterImgLoadTimeout=setTimeout(function(){
        setShowInlined(false);
      },200);
    }
    setSrc(imgObj.src);
    setCurrentWidth(imgObj.width);
    setLoaded(true);

    //the biggest image have been loaded, remove all listeners and cancel future functions
    if(imgObj)
      if(imgObj.src === image.data[(image.data.length-1)].src) {
        event.remove(window, 'resize', debounceResize);
        event.remove(window, 'scroll', throttleScroll);
        if (debounceResize.cancel)
          debounceResize.cancel();

        if (throttleScroll.cancel)
          throttleScroll.cancel();

      }

  }

  const onImageError = () => {
    //if we cant load it the first time, test it on a timeout, that we cancel if navigating away
    if(imgLoadTimeout)
      clearTimeout(imgLoadTimeout);
    imgLoadTimeout = setTimeout(loadImage, 1000);
  }

  const noscriptImageHTML = () => {
    if(!image.data.length) return {__html: ''};

    let middleImageI = Math.floor(image.data.length/2);
    if(middleImageI < 1) middleImageI = 1;

    const imageHtml = '<img class="noscript-img' + (className ? ' ' + className:'') + '" src="' + image.data[middleImageI].src + '" width="' + image.width + '" height="' + image.height + '" alt="' + (image.alt ? image.alt : '') + '" />';

    return {__html: imageHtml};
  }


  return (
    <div className={classes} style={styles}>
      <img ref={imgEl} src={src} width={image.width} height={image.height} alt={image.alt || ''} />
      <noscript dangerouslySetInnerHTML={noscriptImageHTML()} />
    </div>
  );
}

Image.defaultProps = {
  image: {}
};

export default Image;
