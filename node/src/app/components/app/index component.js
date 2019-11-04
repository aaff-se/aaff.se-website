'use strict'

import 'adaptors/svg4everybody';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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


class App extends Component {

  constructor(props) {
    super(props);
    this.state = props.state;
    this.state.hover = false;
    this.onChangeStore = this.onChangeStore.bind(this);
  }

  componentDidMount() {
    Store.on('change', this.onChangeStore);
  }

  componentWillUnmount() {
    Store.removeListener('change', this.onChangeStore);
  }

  onChangeStore(state) {
    this.setState(state);
    //also set body classes here, we shouldn't really - but let's do it anyway!
    if(state.statusCode === 404) {
      document.body.className = 'loaded the404';
    } else if(state.currentPage === 'about-contact') {
      document.body.className = 'loaded inv';
    } else {
      document.body.className = 'loaded';
    }
    CursorHelper.setCursor('');
  }

  onExited(){
    setTimeout(function(){window.scrollTo(0, 0)},150);
  };

  getPage(pageId) {
    const { dynamic: dynamicData} = this.state;
    let page;
    const timeoutTime = {enter: 300, exit: 450,};

    if(!dynamicData) {

      page = null;
    } else {
      switch(pageId) {
        case 'home':
          page =
            <CSSTransition
              timeout={timeoutTime}
              classNames="transition"
              key={"page-transition-"+ dynamicData.slug}
              onExited={this.onExited}
              {...this.state}
            >
              <PageContainer
                {...this.state}
                className={"page-" + dynamicData.slug}
                key={"page-"+dynamicData.slug}
              >
                <Home {...this.state} />
                <Footer {...this.state} />
              </PageContainer>
            </CSSTransition>
          break;
        case 'about-contact':
          page =
            <CSSTransition
              timeout={timeoutTime}
              classNames="transition"
              key={"page-transition-"+ dynamicData.slug}
              onExited={this.onExited}
            >
              <PageContainer
                {...this.state}
                className={"page-" + dynamicData.slug}
                key={"page-"+dynamicData.slug}
              >
                <AboutContact {...this.state}  />
                <Footer {...this.state} />
              </PageContainer>
            </CSSTransition>
          break;
        case 'work':
          page =
            <CSSTransition
              timeout={timeoutTime}
              classNames="transition"
              key={"page-transition-"+ dynamicData.slug}
              onExited={this.onExited}
            >
              <PageContainer
                {...this.state}
                className={"page-" + dynamicData.slug}
                key={"page-"+dynamicData.slug}
              >
                <Work {...this.state} />
                <Footer {...this.state} />
              </PageContainer>
            </CSSTransition>
          break;
      }
    }
    return page;
  }

  getMainTitle() {
    const { dynamic: dynamicData} = this.state;
    const timeoutTime = {enter: 300, exit: 300,};
    let mainTitle;
    if(!dynamicData) {
      mainTitle = null;
    } else if(!dynamicData.maintitle) {
      mainTitle = null;
    } else {
      mainTitle =
        <CSSTransition
          timeout={timeoutTime}
          classNames="transition"
          key={"menu-transition-"+ dynamicData.slug}
          onExited={this.onExited}
        >
          <MainTitle {...this.state} key={"page-title-"+dynamicData.slug} />
        </CSSTransition>;
    }
    return mainTitle;
  }


  render() {
    const props = this.props;
    const state = this.state;
    const { dynamic: dynamicData} = this.state;


    //should be fetched from state later
    const appClasses = classnames('app', { 'app-404' : (state.statusCode === 404) });
    const contentClasses = classnames('app-content');
    let content;
    if (state.statusCode === 404) {

      return <div className={appClasses}>
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

      </div>;

    } else {

      return <div className={appClasses}>
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
          {this.getMainTitle()}
        </TransitionGroup>

        <TransitionGroup component={null} key={"page-transition"}>
          {this.getPage(state.currentPage)}
        </TransitionGroup>

        <Logo {...state} />

      </div>;
    }
  }
}
App.defaultProps = {
};

export default App;
