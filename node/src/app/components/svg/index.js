'use strict';

import React from 'react';

const SVG = (props) => {

  const { className, role, title, spritemapID, style, id } = props;

  return (
   <svg id={id || ''}
      className={className || ''}
      role={role || 'img'}
      title={title}
      dangerouslySetInnerHTML={{
      __html: `<title>${title}</title><use xlink:href='/spritemap.svg#${spritemapID}'/>`
      }}
      style={style}
    />
  );
};

SVG.defaultProps = {};

export default SVG;



