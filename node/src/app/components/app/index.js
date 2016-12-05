'use strict'

//import {} from './style.scss';

import 'adaptors/svg4everybody';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Meta from "react-helmet";
import ReactTransitionGroup from 'react-addons-transition-group';
import classnames from 'classnames';
import lodash from 'lodash';

import get from 'lodash/get';
import find from 'lodash/find';
import includes from 'lodash/includes';

// TODO: see if there's a better way to get fonts in
//import 'adaptors/localfont';
//We now use regular font files with expires headers instead, not giving away the font code by default...

import window from 'adaptors/window';

//import 'app/lib/animate';

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

class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = props.state;
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

		if(state.statusCode === 404) {
			document.body.className = 'the404 loaded';
		} else {
			document.body.className = 'loaded';
		}

	}

	getPage(pageId) {
		const { currentPage, page: pageData, footer} = this.state;
		let page;
		if(!pageData) {
			page = null;
		} else {
			switch(pageId) {
				case 'home':
					page = <PageContainer {...this.state} className={"page-" + pageData.slug} key={"page-"+pageData.slug}>
						{this.getMainTitle()}
						<Home {...this.state} />
						<Footer data={footer} />
					</PageContainer>;
					break;
				case 'about-contact':
					page = <PageContainer {...this.state} className={"page-" + pageData.slug} key={"page-"+pageData.slug}>
						{this.getMainTitle()}
						<AboutContact {...this.state}  />
						<Footer data={footer} />
					</PageContainer>;
					break;
				case 'work':
					page = <PageContainer {...this.state} className={"page-" + pageData.slug} key={"page-"+pageData.slug}>
						{this.getMainTitle()}
						<Work {...this.state} />
						<Footer data={footer} />
					</PageContainer>;
					break;
			}

		}
		return page;
	}
	getMainTitle() {
		const { currentPage, page: pageData} = this.state;
		let mainTitle;
		if(!pageData) {
			mainTitle = null;
		} else if(!pageData.maintitle) {
			mainTitle = null;
		} else {
			
			mainTitle = <MainTitle {...this.state} key={"page-title-"+pageData.slug} />;
		}
		return mainTitle;
	}

	render() {
		const state = this.state;
		const { page: pageData } = state;
		
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
				<Header />
				<PageContainer {...this.state} key="page-notfound" className="page-notfound">
					
					<The404 {...this.state} />
					<Footer data={state.footer} />
					
				</PageContainer>
				<Logo />
			</div>;
			
		} else {
			
			return <div className={appClasses}>
				<Meta 
					title={get(state, 'page.seo.title') || 'Anton Andersson Form & Funktioner'} 
					meta={[
						{
							name: "description",
							content: get(state, 'page.seo.desc') || 'Freelancing graphic designer and web developer. Creating form and functions for clients of all sorts and sizes.'
						}, {
							property: "og:description",
							content: get(state, 'page.seo.desc') || 'Freelancing graphic designer and web developer. Creating form and functions for clients of all sorts and sizes.'
						}, {
							name: "author",
							content: 'Anton Andersson Form & Funktioner'
						}, {
							property: "og:image",
							content: get(state, 'page.seo.image') || 'https://www.aaff.se/images/aaff-meta-bw.jpg'
						}, {
							property: "og:title",
							content: get(state, 'page.seo.title') || 'Anton Andersson Form & Funktioner'
						}, {
							property: "og:type",
							content: 'website'
						}, {
							name: "twitter:card",
							content:get(state, 'page.seo.twittercard') || 'summary'
						}, {
							name: "twitter:description",
							content: get(state, 'page.seo.desc') || 'Freelancing graphic designer and web developer. Creating form and functions for clients of all sorts and sizes.'
						}, {
							name: "twitter:image",
							content: get(state, 'page.seo.image') || 'https://www.aaff.se/images/aaff-meta-bw.jpg'
						}, {
							name: "twitter:title",
							content: get(state, 'page.seo.title') || 'Anton Andersson Form & Funktioner'
						}
					]}
				/>
				
				<Header />
					
					<ReactTransitionGroup component="div" className="transition-wrapper">
					
						{this.getMainTitle()}
						
					</ReactTransitionGroup>
					
					<ReactTransitionGroup component="div" className="transition-wrapper">
					
						{this.getPage(state.currentPage)}
					
					</ReactTransitionGroup>
						
				<Logo />

			</div>;
		}
	}

}
App.defaultProps = {
};

export default App;
