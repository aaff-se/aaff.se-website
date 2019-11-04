'use strict';

import React, {Component} from 'react';
import classnames from 'classnames';

import CursorHelper from 'app/lib/cursor-helper';

import Flux from 'app/flux';

const Link = (props) => {

  const { id, href, className, title, children, onClick, addToCursor } = props;

  const handleMouseEnter = () => {
    CursorHelper.setCursor( addToCursor + ' link' );
  };

  const handleMouseLeave = () => {
    CursorHelper.setCursor('');
  };

  const handleOnClick = (event) =>  {

    //we cant use our cool navigation - just reload as usual
    if((" " + document.documentElement.className + " " ).indexOf( " no-history " ) > -1)
      return;

    //the user wants to open in new window, tab, or whatever, oblidge
    if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;

    event.preventDefault();
    onClick && onClick();
    Flux.navigate(href);
  }


  return (
    <a onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} href={href} id={id || ''} className={className || ''} title={title || ''} onClick={handleOnClick}>{children}</a>
  );

}
Link.defaultProps = {
  addToCursor:''
};

export default Link;
