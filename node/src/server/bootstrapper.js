import find from 'lodash/find';
import some from 'lodash/some';

import log from 'app/lib/log';
import DataLoader from './data-loader';

import RoutePattern from 'route-pattern';
import virtualUrl from 'app/flux/virtualurl';
import Routes from 'app/flux/routes';

const globalLoads = [
	{
		url: 'aa/v1/global/footer',
		type: 'footer'
	}
];
let _state;

function navigate(urlString) {
	const vurl = virtualUrl(urlString);
	const path = vurl.pathname + vurl.search;
	let route = find(Routes, route => {
		return some(route.patterns, pattern => RoutePattern.fromString(pattern).matches(path));
	});
	
	let namedParams = [];
	let params = [];
	
	if (!route) {
		route = Routes.notfound;
	} else {
		const pattern = find(route.patterns, pattern => RoutePattern.fromString(pattern).matches(path));
		let paramsResult = RoutePattern.fromString(pattern).match(path);
		params = paramsResult ? paramsResult.params : [];
		namedParams = paramsResult ? paramsResult.namedParams : [];
	}
	
	let action = applyRoute(route.id, namedParams, '', route.data.apply(null, params), route.statusCode);
	return action.then(state => Promise.resolve(state));
}

function applyRoute(page, params, hash, itemsToLoad, statusCode) {
	return Promise.all([
		setPage(page, params, hash, statusCode || 200),
		loadData([].concat(globalLoads, itemsToLoad))
	]).then(responses => responses[1]);
}

function applyData(response, type) {
	const changeSet = {};
	changeSet[type] = response.data.content;
	if (response.postsPaginationTotal) {
		changeSet.postsPaginationTotal = parseInt(response.postsPaginationTotal, 10);
	}
	if (response.data.statusCode) {
		changeSet.statusCode = response.data.statusCode;
	}
	if (response.url) {
		changeSet.initCacheUrl = response.url;
	}
	Object.assign(_state, changeSet);
	log('Loaded', type, _state[type]);
}

function setPage(newPage, newParams, newHash, statusCode) {
	_state.currentPage = newPage;
	_state.currentParams = newParams;
	_state.currentHash = newHash;
	_state.statusCode = statusCode;
	return Promise.resolve(_state);
}

function loadData(itemsToLoad) {
	return DataLoader(itemsToLoad, applyData).then(() => _state);
}

function bootstrapper(initialUrl, hostApi, proxyUrl) {
	_state = {
		relatedContent: []
	};
	const vurl = virtualUrl(initialUrl);
	global.hostApi = hostApi;
	global.proxyUrl = proxyUrl;
	return navigate(vurl.original);
}

export default bootstrapper;
