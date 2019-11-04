'use strict';

import React from 'react';
import classnames from 'classnames';
import Link from 'components/link';
import ExtLink from 'components/extlink';

const Group = (props) => {

  const { children, id, className, href=null, title, target } = props;
  const classes = classnames('group', className);

  if(href && target === "_blank") {
    return <ExtLink addToCursor={props.addToCursor} updateCursorState={props.updateCursorState} id={id || ''} className={classes} href={href} title={title || ""} target={target}>{children}</ExtLink>
  } else if(href) {
    return <Link addToCursor={props.addToCursor} updateCursorState={props.updateCursorState} id={id || ''} className={classes} href={href} title={title || ""}>{children}</Link>
  } else {
    return <div id={id || ''} className={classes}>{children}</div>
  }

}
Group.defaultProps = {
  updateCursorState: ()=>{},
  addToCursor:false
};

export default Group;
