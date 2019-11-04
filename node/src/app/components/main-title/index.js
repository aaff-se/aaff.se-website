'use strict';

import React, {useState,useEffect} from 'react';

import throttle from'lodash/throttle';
import classnames from 'classnames';

import event from 'app/lib/event';

const MainTitle = (props) => {

  const { dynamic } = props;

  const [visible, setVisible] = useState(true);
  const [prevScroll, setPrevScroll] = useState(0);
  const [scroll, setScroll] = useState(0);

  useEffect( () => {
    event.add(window, 'scroll', throttleScroll);
    return ()=>{
      if (throttleScroll.cancel)
        throttleScroll.cancel();
      event.remove(window, 'scroll', throttleScroll);
    }
  },[]);

  useEffect( () => {
    let visible = true;
    if(scroll >= prevScroll && scroll > 32 ) {
      visible = false;
    }
    setVisible(visible);
    setPrevScroll(scroll);
  },[scroll]);

  const handleScroll = () => {
    setScroll( window.pageYOffset );
  }
  const throttleScroll = throttle(handleScroll, 20);

  const classes = classnames( 'main-title', {'transition-exit': !visible} )


  return (
    <div className={classes}>
      {(dynamic.maintitle ? <h2>{dynamic.maintitle}</h2> : null)}
      {(dynamic.subtitle ? <h3>{dynamic.subtitle}</h3> : null)}
    </div>
  );

}
MainTitle.defaultProps = {
  state: {}
};

export default MainTitle;
