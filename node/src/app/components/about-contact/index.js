'use strict';

import React, {useState,useEffect} from 'react';
import debounce from'lodash/debounce';

import window from 'adaptors/window';

import event from 'app/lib/event';
import SmoothScroll from 'app/lib/smoothscroll';

import ArchiveList from 'components/archive-list';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

const AboutContact = (props) => {

  const { currentPage, dynamic, contact } = props;

  const [introVisible, setIntroVisible] = useState(false);
  const [height, setHeight] = useState('100vh');
  const [width, setWidth] = useState('0');

  const style = { minHeight: height };
  const introClass = (introVisible ? 'visible' : '');

    let allInternalLinks = {};

  useEffect(() => {

    event.add(window, 'resize', handleResize);
    handleResize();
    addLinkListeners();

    return () => {
      if (handleResize.cancel)
        handleResize.cancel();
      event.remove(window, 'resize', handleResize);
      removeLinkListeners();
    };

  },[]);

  const addLinkListeners = () => {
    allInternalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    var a,i;
    if(allInternalLinks.length)
      for(i=allInternalLinks.length; a=allInternalLinks[--i];){
        event.add(a, 'click', onClick);
      }
  }

  const removeLinkListeners = () => {
    var a,i;
    if(allInternalLinks.length)
      for(i=allInternalLinks.length; a=allInternalLinks[--i];){
        event.remove(a, 'click', onClick);
      }
  }

  const handleResize = () => {
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    let percent = (windowHeight / height);

    //if address-bar in mobile is toggled we don't want to resize the intro box
    if(width === windowWidth && (percent < 1.3333 && percent > 0.75) )
      return;

    setHeight(windowHeight);
    setWidth(windowWidth);
    if(!introVisible)
      setIntroVisible(true);
  }
  const debounceResize = debounce(handleResize, 200);

  const onClick = (e) =>{
    e.preventDefault();
    const target = document.getElementById( e.currentTarget.getAttribute('href').replace('#','') );
    SmoothScroll(target);
  };


  return (
    <main id={"page-"+currentPage}>
      <section id="about_contact" className={introClass}>
        <div style={style} className="inner">
          <Group className="about">
            <Item className="text">
              <p dangerouslySetInnerHTML={{__html: dynamic.content}} />
            </Item>
            <Item className="text half">
              <p><a href={contact.phone_href}>{contact.phone_text}</a></p>
            </Item>
            <Item className="text half last">
              <p><a href={contact.email_href}>{contact.email_text}</a></p>
            </Item>
            <Item className="text half">
              <p><a target="_blank" href={contact.instagram}>instagram</a><br/><a target="_blank" href={contact.facebook}>facebook</a></p>
            </Item>
            <Item className="text half last">
              <p><a target="_blank" href={contact.linkedin}>linkedin</a><br/><a target="_blank" href={contact.twitter}>twitter</a><br/><a target="_blank" href={contact.github}>github</a></p>
            </Item>
          </Group>
          <div className="clear"></div>
        </div>
      </section>
      <ArchiveList archiveItems={dynamic.archive} />
    </main>
  )

}
AboutContact.defaultProps = {
  state: {}
};

export default AboutContact;
