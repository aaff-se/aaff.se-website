'use strict';

import React, {useState, useEffect, useRef} from 'react';
import classnames from 'classnames';

import throttle from'lodash/throttle';
import debounce from'lodash/debounce';

import window from 'adaptors/window';

import event from 'app/lib/event';
import inCenter from 'app/lib/incenter';
import inFull from 'app/lib/infull';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';
import Image from 'components/image';

const HomeItem = (props) => {

  const { data, className } = props;

  const [current, setCurrent] = useState(false);

  //item reference needs to be sent down to a real dom obj, hence the "reference={itemEl}" on "Section"
  const itemEl = useRef(null);

  useEffect(() => {
    event.add(window, 'scroll', throttleScroll);
    event.add(window, 'resize', debounceResize);
    setTimeout(handleScroll, 150);

    return () => {
      if (throttleScroll.cancel)
        throttleScroll.cancel();
      if (debounceResize.cancel)
        debounceResize.cancel();
      event.remove(window, 'scroll', throttleScroll);
      event.remove(window, 'resize', debounceResize);

    };
  },[]);


  const handleScroll = () => {

    //check if this section is centered

    if( inFull(itemEl.current) || inCenter(itemEl.current) )
      setCurrent(true);
    else
      setCurrent(false);

  }
  const throttleScroll = throttle(handleScroll, 200);

  const handleResize = () => {

    //run the scroll-check on resize as well
    handleScroll();
  }
  const debounceResize = debounce(handleResize, 200);

  const classNames = classnames( className, {'current': current });

  return(
    <Section reference={itemEl} className={classNames}>

      <Group addToCursor={'cursor-project'} href={data.link} title={data.client + ' - ' + data.type}>

        <Item className="title">
          <h2>{data.client}</h2><h3>{data.type}</h3>
        </Item>

        <Item className="image-wrapper">

          {(data.image.main && !data.image.alternative ? <Image image={data.image.main} /> : null)}

          {(data.image.main && data.image.alternative ? <Image className="main" image={data.image.main} /> : null)}

          {(data.image.alternative ? <Image className="alternative" image={data.image.alternative} /> : null)}
        </Item>

      </Group>

    </Section>
  );

}
HomeItem.defaultProps = {
  data: {},
  className: {},
  state: {},
  updateCursorState: ()=>{}

};

export default HomeItem;
