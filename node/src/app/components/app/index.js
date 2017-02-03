'use strict'

//import {} from './style.scss';

import 'adaptors/svg4everybody';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Meta from "react-helmet";
import ReactTransitionGroup from 'react-addons-transition-group';
import classnames from 'classnames';

import get from 'lodash/get';
import find from 'lodash/find';
import includes from 'lodash/includes';

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
		const { dynamic: dynamicData, contact} = this.state;
		let page;
		if(!dynamicData) {
			page = null;
		} else {
			switch(pageId) {
				case 'home':
					page = <PageContainer {...this.state} className={"page-" + dynamicData.slug} key={"page-"+dynamicData.slug}>
						{this.getMainTitle()}
						<Home {...this.state} />
						<Footer {...this.state} />
					</PageContainer>;
					break;
				case 'about-contact':
					page = <PageContainer {...this.state} className={"page-" + dynamicData.slug} key={"page-"+dynamicData.slug}>
						{this.getMainTitle()}
						<AboutContact {...this.state}  />
						<Footer {...this.state} />
					</PageContainer>;
					break;
				case 'work':
					page = <PageContainer {...this.state} className={"page-" + dynamicData.slug} key={"page-"+dynamicData.slug}>
						{this.getMainTitle()}
						<Work {...this.state} />
						<Footer {...this.state} />
					</PageContainer>;
					break;
			}

		}
		return page;
	}
	getMainTitle() {
		const { dynamic: dynamicData} = this.state;
		let mainTitle;
		if(!dynamicData) {
			mainTitle = null;
		} else if(!dynamicData.maintitle) {
			mainTitle = null;
		} else {
			
			mainTitle = <MainTitle {...this.state} key={"page-title-"+dynamicData.slug} />;
		}
		return mainTitle;
	}

	render() {
		const state = this.state;
		const { dynamic: dynamicData } = state;
		
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

					<Footer {...this.state} />
					
				</PageContainer>

				<Logo {...this.state} />

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
				
				<Header />
					
				<ReactTransitionGroup component="div" className="transition-wrapper">
				
					{this.getMainTitle()}
					
				</ReactTransitionGroup>
				
				<ReactTransitionGroup component="div" className="transition-wrapper">
				
					{this.getPage(state.currentPage)}
				
				</ReactTransitionGroup>
						
				<Logo {...this.state} />
				
			</div>;
		}
	}

}
App.defaultProps = {
};

export default App;
