'use strict';

import React from 'react';
import Track from 'adaptors/track';
import log from 'app/lib/log';

const ExtLink = (props) => {

  const { id, href, className, title, children } = props;

  const trackOutboundLinks = (event) => {
    log(props.href);
    Track('set', 'eventCategory', 'Outbound Link');
    Track('set', 'eventAction', 'click');
    Track('set', 'eventLabel', props.href);
    Track('send', 'event');
  }


  return (
    <a href={href} id={id || ''} className={className || ''} title={title || ''} onClick={trackOutboundLinks}>{children}</a>
  );

}
ExtLink.defaultProps = {};

export default ExtLink;
