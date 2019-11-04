'use strict';

import React from 'react';
import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

const Footer = (props) =>{
  const {contact, meta} = props;

  const linelength = (string) => {
    if(!string) return '';
    let returnStr = '';
    let length = string.length;
    while (length--)
      returnStr += '-';
    return returnStr;
  }

  return (
    <footer>
      <Section>
        <Item className="text title">
          <p>{meta.title}<br/>{linelength(meta.title)}</p>
        </Item>
        <Item className="text info">
          <p>
            <a href={contact.phone_href}>{contact.phone_text}</a><br/>
            <a href={contact.email_href}>{contact.email_text}</a>
          </p>
        </Item>
      </Section>
    </footer>
  );
};

Footer.defaultProps = {
  contact:{},
  meta:{},
};

export default Footer;
