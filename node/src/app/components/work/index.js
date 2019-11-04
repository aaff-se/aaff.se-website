'use strict';

import React from 'react';

import WorkRow from 'components/work-row';
import WorkNext from 'components/work-next';

const Work = (props) => {
  const { currentPage, dynamic } = props;

  return (
    <main id={"page-"+currentPage}>
      {dynamic.content.map((workRow, index) => {
        return <WorkRow key={`row-${index}`} data={workRow} />;
      })}
      <WorkNext prevpost={dynamic.prevpost} nextpost={dynamic.nextpost} />
    </main>
  );
}
Work.defaultProps = {
};

export default Work;
