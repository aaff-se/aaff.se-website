'use strict';

import React from 'react';

const Section = (props) => {

  const { children, id, className, style, reference } = props;

  return (
     <section ref={reference} style={style} id={id || ''} className={className}>
      <div className="inner">
        {children}
        <div className="clear"></div>
      </div>
    </section>
  );
}
Section.defaultProps = {};

export default Section;
