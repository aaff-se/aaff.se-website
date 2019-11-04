'use strict';

import React, {useState,useEffect} from 'react';

import throttle from'lodash/throttle';
import window from 'adaptors/window';
import log from 'app/lib/log';
import classnames from 'classnames';
import includes from 'lodash/includes';

import event from 'lib/event';
import CursorHelper from 'app/lib/cursor-helper';

const Cursor = (props) =>  {

  const [visible, setVisible] = useState(false);
  const [styles, setStyles] = useState({});
  const [hover, setHover] = useState('');
  const [cursor, setCursor] = useState('');

  useEffect( () => {
    event.add(document, 'mousemove', throttleCursorMove);
    event.add(document, 'mouseout', handleCursorOut);
    CursorHelper.on('changeCursor', updateCursorState);
    setVisible(true);
    return () => {
      if (throttleCursorMove.cancel)
        throttleCursorMove.cancel();
      event.remove(document, 'mousemove', throttleCursorMove);
      event.remove(document, 'mouseout', handleCursorOut);
      CursorHelper.removeListener('changeCursor', updateCursorState);
    };
  },[]);


  const updateCursorState = (newCursor) => {
    setCursor(newCursor);
  }

  const fixupMouse = ( event ) => {
    const e = event || window.event;
    return {
      event: e,
      target: e.target ? e.target : e.srcElement,
      which: e.which ? e.which :
        e.button === 1 ? 1 :
        e.button === 2 ? 3 :
        e.button === 4 ? 2 : 1,
      x: e.x ? e.x : e.clientX,
      y: e.y ? e.y : e.clientY
    };
  }

  const handleCursorOut = (event) => {
    const e = event || window.event;
    if (e.toElement == null && e.relatedTarget == null) {
      setVisible(false);
    }
  }

  const handleCursorMove = (event) => {
    const e = fixupMouse(event);

    const styles = {
      transform: 'matrix(1, 0, 0, 1, ' + e.x + ', ' + e.y + ')'

    }
    setStyles(styles);
    setVisible(true);
  }
  const throttleCursorMove = throttle(handleCursorMove, 5);

  const classes = classnames('cursor', cursor, {'visible': visible} );


  return (
    <div style={styles} className={classes}><span className="cursor-project">View Project</span></div>
  );

}
Cursor.defaultProps = {};

export default Cursor;
