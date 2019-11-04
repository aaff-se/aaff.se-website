'use strict';

import React, {useState,useEffect} from 'react';
import throttle from 'lodash/throttle';
import classnames from 'classnames';

import event from 'lib/event';

import Link from 'components/link';

const Header = (props) => {

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

  const classes = classnames( 'text', {'hidden': !visible});

  return(
  <header className={classes}>
    <h1><Link href="/">AAFF</Link></h1>
    <p><Link href="/about-contact/">about / contact</Link></p>
  </header>
  );
}

export default Header;
