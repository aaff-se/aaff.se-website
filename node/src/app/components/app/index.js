'use strict'

import 'adaptors/svg4everybody';
import React, {useState,useEffect} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Meta from "react-helmet";
import classnames from 'classnames';

import get from 'lodash/get';
import find from 'lodash/find';
import includes from 'lodash/includes';

import window from 'adaptors/window';

import Store from 'app/flux/store';
import Nulls from 'app/flux/nulls';

import Header from 'components/header';
import Footer from 'components/footer';
import Logo from 'components/logo';

import PageContainer from 'components/page-container';

import MainTitle from 'components/main-title';

import The404 from 'components/the404';
import Home from 'components/home';
import AboutContact from 'components/about-contact';
import Work from 'components/work';

import Cursor from 'components/cursor';
import CursorHelper from 'app/lib/cursor-helper';


const App = (props) => {
  const [state, setState] = useState(props.state);

  const onChangeStore = (newState) => {
    //wont update without the state set as a new spreaded object for some reason.. anyone know why?
    setState({...newState});
  };

  useEffect(() => {
    Store.on('change', onChangeStore);
    return () => {
      Store.removeListener('change', onChangeStore);
    };
  },[]);

  useEffect(() => {
    if(state.statusCode === 404)
      document.body.className = 'loaded the404';
    else if(state.currentPage === 'about-contact')
      document.body.className = 'loaded inv';
    else
      document.body.className = 'loaded';
    CursorHelper.setCursor('');
  },[state.statusCode, state.currentPage]);



  const onExited = () => {
    window.scrollTo(0, 0);
  };

  const getPage = (pageId) => {
    const { dynamic: dynamicData} = state;
    const timeoutTime = {enter: 150, exit: 0,};

    if(!dynamicData)
      return null;
   else
      switch(pageId) {
        case 'home':
          return (
            <CSSTransition
              timeout={timeoutTime}
              classNames="transition"
              key={"page-transition-"+ dynamicData.slug}
              onExited={onExited}
              {...state}
            >
              <PageContainer
                {...state}
                className={"page-" + dynamicData.slug}
                key={"page-"+dynamicData.slug}
              >
                <Home {...state} />
                <Footer {...state} />
              </PageContainer>
            </CSSTransition>
          );
        case 'about-contact':
          return (
            <CSSTransition
              timeout={timeoutTime}
              classNames="transition"
              key={"page-transition-"+ dynamicData.slug}
              onExited={onExited}
            >
              <PageContainer
                {...state}
                className={"page-" + dynamicData.slug}
                key={"page-"+dynamicData.slug}
              >
                <AboutContact {...state}  />
                <Footer {...state} />
              </PageContainer>
            </CSSTransition>
          );
        case 'work':
          return (
            <CSSTransition
              timeout={timeoutTime}
              classNames="transition"
              key={"page-transition-"+ dynamicData.slug}
              onExited={onExited}
            >
              <PageContainer
                {...state}
                className={"page-" + dynamicData.slug}
                key={"page-"+dynamicData.slug}
              >
                <Work {...state} />
                <Footer {...state} />
              </PageContainer>
            </CSSTransition>
          );
      }
  };

  const getMainTitle = () => {
    const { dynamic: dynamicData} = state;
    const timeoutTime = {enter: 150, exit: 150,};
    if(!dynamicData)
      return null;
    else if(!dynamicData.maintitle)
      return;
    else
      return (
        <CSSTransition
          timeout={timeoutTime}
          classNames="transition"
          key={"menu-transition-"+ dynamicData.slug}
          onExited={onExited}
        >
          <MainTitle {...state} key={"page-title-"+dynamicData.slug} />
        </CSSTransition>
      );
  };

  const appClasses = classnames('app', { 'app-404' : (state.statusCode === 404) });

  return (

    state.statusCode === 404 ? (

      <>
        <Meta
          title={'404 - Anton Andersson Form & Funktioner'}
          meta={[
            {
              name: "description",
              content:'404: page not found'
            }, {
              property: "og:type",
              content: 'website'
            }, {
              property: "og:site_name",
              content: 'Anton Andersson Form & Funktioner'
            }, {
              property: "og:title",
              content: '404 - Anton Andersson Form & Funktioner'
            }, {
              property: "og:description",
              content: '404: page not found'
            }, {
              property: "og:image",
              content:  'https://www.aaff.se/images/aaff-meta-bw.jpg'
            }
          ]}
        />

        <Cursor />

        <Header />

        <PageContainer {...state} key="page-notfound" className="page-notfound">

          <The404 {...state} />

          <Footer {...state} />

        </PageContainer>

        <Logo {...state} />

      </>

    ) : (

      <>
        <Meta
          title={get(state, 'dynamic.meta.title') || get(state, 'meta.title') || ''}
          meta={[
            {
              name: "description",
              content: get(state, 'dynamic.meta.desc') || get(state, 'meta.desc') || ''
            }, {
              property: "og:description",
              content: get(state, 'dynamic.meta.desc') || get(state, 'meta.desc') || ''
            }, {
              name: "author",
              content: get(state, 'meta.title') || ''
            }, {
              property: "og:image",
              content: get(state, 'dynamic.meta.image') || get(state, 'meta.image') || ''
            }, {
              property: "og:title",
              content: get(state, 'dynamic.meta.title') || get(state, 'meta.title') || ''
            }, {
              property: "og:type",
              content: 'website'
            }, {
              name: "twitter:card",
              content:get(state, 'dynamic.meta.twittercard') || get(state, 'meta.twittercard') || ''
            }, {
              name: "twitter:description",
              content: get(state, 'dynamic.meta.desc') || get(state, 'meta.desc') || ''
            }, {
              name: "twitter:image",
              content: get(state, 'dynamic.meta.image') || get(state, 'meta.image') || ''
            }, {
              name: "twitter:title",
              content: get(state, 'dynamic.meta.title') || get(state, 'meta.title') || ''
            }
          ]}
        />

        <Cursor />

        <Header />

        <TransitionGroup component={null} key={"title-transition"}>
          {getMainTitle()}
        </TransitionGroup>

        <TransitionGroup component={null} key={"page-transition"}>
          {getPage(state.currentPage)}
        </TransitionGroup>

        <Logo {...state} />

      </>

    )

  );
}
App.defaultProps = {
};

export default App;
