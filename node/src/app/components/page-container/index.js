'use strict';

import React from 'react';
import classnames from 'classnames';

const PageContainer = (props) => {

  const { children, className } = props;

  return (
    <div className={classnames("page-container", className)}>
      {children}
    </div>
  );
}

PageContainer.defaultProps = {};

export default PageContainer;
