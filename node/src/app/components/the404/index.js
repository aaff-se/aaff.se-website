'use strict';

import React, {useEffect, useState} from 'react';
import debounce from'lodash/debounce';

import window from 'adaptors/window';

import event from 'app/lib/event';

import Group from 'components/parts/group';
import Item from 'components/parts/item';

const The404 = (props) => {

  const [height, setHeight] = useState('100vh');
  const [width, setWidth] = useState('');

  useEffect(() => {
    event.add(window, 'resize', debounceResize);
    handleResize();
    return ()=>{
      if (debounceResize.cancel)
        debounceResize.cancel();
      event.remove(window, 'resize', debounceResize);
    };
  },[]);

  const handleResize = () => {
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    let percent = (windowHeight / height);

    //if address-bar in mobile is toggled we don't want to resize the intro box
    if(width === windowWidth && (percent < 1.3333 && percent > 0.75) ) return;

    setWidth(windowWidth);
    setHeight(windowHeight);
  }
  const debounceResize = debounce(handleResize, 20);


  const { currentPage, statusCode } = props;
  const style = { minHeight: height };


  return(
    <main id={"page-"+currentPage}>
      <canvas id="bg-canvas"></canvas>
      <section>
        <div style={style} className="inner">
          <Group>
            <Item className="text">
              <p>404</p>
              <p>page not found</p>
            </Item>
          </Group>
          <div className="clear"></div>
        </div>
      </section>
    </main>
  )
}
The404.defaultProps = {
  state: {}
};

export default The404;
