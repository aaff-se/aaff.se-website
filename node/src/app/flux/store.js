import "@babel/polyfill";

import {EventEmitter} from 'events';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import some from 'lodash/some';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';

import log from 'app/lib/log';
import window from 'adaptors/window';
import DataLoader from 'app/lib/data-loader';
import Nulls from './nulls';
//import Defaults from './defaults';

const _state = Object.assign({
	currentPage: Nulls.page,
	currentHash: Nulls.section,
	//blogCategory: Defaults.blogCategory,
	//searchMode: Defaults.searchMode,
	//searchQuery: Nulls.searchQuery,
	//modal: Nulls.modal,
	//colours: Nulls.colours,
	//takeover: Nulls.takeover,
	//postsPagination: Defaults.postsPagination,
	//postsPaginationTotal: Nulls.postsPaginationTotal,
	relatedContent: []
}, window.state);

/*
if(_state.takeover && window.localStorage.getItem('takeover-'+_state.takeover.id)) {
	_state.takeover.seen = true;
}
*/

function applyData(response, type) {
	const changeSet = {};
	changeSet[type] = response.data.content;
	if (response.postsPaginationTotal) {
		changeSet.postsPaginationTotal = parseInt(response.postsPaginationTotal, 10);
	}
	if (response.data.statusCode) {
		changeSet.statusCode = response.data.statusCode;
	}

	Object.assign(_state, changeSet);
	log('Loaded', type, _state[type]);
	Store.emit('change', _state);
}

/*
function applyJobDetailData(response) {
	const job = response.data;
	const index = findIndex(_state.jobs, 'shortcode', job.shortcode);
	_state.jobs[index] = job;
	log('Added job details', job);
	Store.emit('change', _state);
}

function applyMorePosts(response, type) {
	_state.posts = _state.posts.concat(response.data);
	log('Added more posts', response.data);
	Store.emit('change', _state);
}
*/

function getApplyFunctionFor(dependency) {
	let func  = () => {};
	switch(dependency) {
		case 'related_content':
			func = applyRelatedContent;
			break;
	}
	return func;
}

function applyRelatedContent(response) {
	const content = response.data;
	_state.relatedContent.push(content);
	log('Loaded related content', content);
	Store.emit('change', _state);
}

window._state = _state;

const Store = Object.assign(
	EventEmitter.prototype,
	{
		setPage(newPage, newParams, newHash, newStatusCode) {
			const newPageIdArray = newPage.split('/');
			let slug = newPageIdArray[newPageIdArray.length - 1];
			
			//stop work pages from loading twice - also works for wildcard 404s
			if(newParams.cid) slug = newParams.cid;
			
			if(_state.dynamic && _state.dynamic.slug !== slug) {
				_state.dynamic = null;
			} else if(_state.dynamic && _state.dynamic.slug === slug) {
				return;
			};

/*
			if(_state.post && _state.post.slug !== slug) {
				_state.post = null;
			}
*/
/*
			if(newPage !== 'blog/search-results') {
				_state.searchQuery = null;
			}
			if(newPage !== 'blog') {
				_state.blogCategory = Defaults.blogCategory;
				_state.searchMode = Defaults.searchMode;
				_state.posts = Nulls.posts;
				_state.postsPagination = Defaults.postsPagination;
				_state.postsPaginationTotal = Nulls.postsPaginationTotal;
			}
*/
			_state.currentPage = newPage;
			_state.currentParams = newParams || Nulls.params;
			_state.currentHash = newHash || Nulls.hash;
			_state.statusCode = newStatusCode;
			//_state.modal = null;
			_state.relatedContent = [];
			Store.emit('change', _state);
		},
		
		loadData(itemsToLoad) {
			itemsToLoad = filter(itemsToLoad, item => {
				// load this item if:
				// - it doesn't exist in the store OR
				// - it exists in the store with a different slug OR
				// - posts have a different blog category
				return (!_state[item.type] || (item.slug && _state[item.type].slug && _state[item.type].slug !== item.slug));
			});
			DataLoader(itemsToLoad, applyData).then(() => {
				Store.emit('change', _state);
				Store.initiateAsyncLoadsFor(itemsToLoad);
			});
		},
		
		initiateAsyncLoadsFor(itemsToLoad) {
			log(itemsToLoad);
			itemsToLoad.filter(item => item.async).forEach(item => {
				item.async.forEach(dependency => {
					DataLoader(get(_state[item.type], dependency, []).map(url => {
						return {
							url: url,
							type: camelCase(dependency)
						};
					}), getApplyFunctionFor(dependency));
				});
			});
		},
		
/*
		setBlogCategoryTo(id) {
			_state.blogCategory = id;
			_state.postsPagination = Defaults.postsPagination;
			Store.emit('change', _state);
		},
		
		setSearchQueryTo(string) {
			_state.searchQuery = string;
			Store.emit('change', _state);
		},
		
		showContacts() {
			_state.modal = 'contacts';
			Store.emit('change', _state);
		},
		
		showNavOverlay() {
			_state.modal = 'navigation';
			Store.emit('change', _state);
		},
		
		closeTakeover() {
			if(_state.takeover) {
				try {
					window.localStorage.setItem('takeover-'+_state.takeover.id, true);
				} catch (e) {
					console.warn('Silently ignoring localStorage error when browsing in Private Mode on iOS');
				}
				_state.takeover.seen = true;
			}
			Store.emit('change', _state);
		},
		
		closeModal() {
			_state.modal = Nulls.modal;
			Store.emit('change', _state);
		},
		
		getJobDetails(jid) {
			const job = find(_state.jobs, 'shortcode', jid);
			if(job.description) {
				Store.emit('change', _state);
			} else {
				DataLoader([{
				url: `ustwo/v1/jobs/${jid}`,
				type: 'job'
				}], applyJobDetailData).then(() => Store.emit('change', _state));
			}
		},
		showSearch() {
			_state.searchMode = true;
			Store.emit('change', _state);
		},
		
		hideSearch() {
			_state.searchMode = false;
			Store.emit('change', _state);
		},
		
		showBlogCategories() {
			_state.modal = 'blogCategories';
			Store.emit('change', _state);
		},
		
		loadMorePosts() {
			if (_state.postsPagination === _state.postsPaginationTotal) {
				Store.emit('change', _state);
			} else {
				const pageNo = ++_state.postsPagination;
				const category = _state.blogCategory;
				let url;
				if (category === 'all') {
				url = `ustwo/v1/posts?per_page=12&page=${pageNo}`;
			} else {
				url = `ustwo/v1/posts?per_page=12&category=${category}&page=${pageNo}`;
			}
			DataLoader([{
				url: url,
				type: 'posts'
				}], applyMorePosts).then(() => Store.emit('change', _state));
			}
		},
		
		resetPosts() {
			_state.posts = Nulls.posts;
			Store.emit('change', _state);
		}
*/
	}
);

export default Store;