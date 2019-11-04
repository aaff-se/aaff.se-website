'use strict';

import React from 'react';
import classnames from 'classnames';

const Item = (props) => {

  const { children, id, className, style, html } = props;
  const classes = classnames('item', className);

  return <div style={style || {} } id={id || ''} className={classes}>{children}</div>


}
Item.defaultProps = {};

export default Item;
