import RoutePattern from 'route-pattern';
import find from 'lodash/find';
import some from 'lodash/some';
import mapValues from 'lodash/mapValues';
import camelCase from 'lodash/camelCase';

import {Modernizr} from 'adaptors/env';
import Track from 'adaptors/track';
import window from 'adaptors/window';

import virtualUrl from './virtualurl';
import Routes from './routes';
import GlobalLoads from './global-loads';
import Actions from './actions';

function applyRoute(page, params, hash, itemsToLoad, statusCode) {
	Flux.goTo(page, params, hash, statusCode || 200);
	Flux.loadData([].concat(GlobalLoads, itemsToLoad));
}

function getHash(vurl) {
	let hash = vurl.hash.substr(1);
	hash = hash.length ? hash : null;
	return hash;
}

function setUrl(url, replace) {
	if (replace) {
		if(window.history.replaceState)
			window.history.replaceState(null, null, url);
	} else {
		if(window.history.pushState)
			window.history.pushState(null, null, url);
	}
}

const Flux = Object.assign(
	Actions,
	{
		init(initialUrl, hostApi=process.env.API_URL, proxyUrl) {
			const vurl = virtualUrl(initialUrl || window.location.href);
			global.hostApi = hostApi;
			global.proxyUrl = proxyUrl || vurl.origin;
			window.onpopstate = () => {
				Flux.navigate(window.location.href, true, true);
			};
			Flux.navigate(vurl.original, false, false, true, true);
		},
		
		navigate(urlString, history, ignoreUrl, replaceState, force) {
		
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
			applyRoute(route.id, namedParams, getHash(vurl), route.data.apply(null, params), route.statusCode);
			
			if (!ignoreUrl) {
				setUrl(urlString, replaceState);
			}
			if (!history) {
				//window.scrollTo(0, 0);
			}
			
/*
			switch(route.id) {
				case 'blog':
					Flux.setBlogCategoryTo(params[0] || 'all');
					break;
				case 'blog/search-results':
					Flux.setSearchQueryTo(params[0]);
					break;
			}
*/
			Track('set', 'page', path);
			Track('send', 'pageview');
		}
		
/*
		override(url) {
			return (e) => {
				e.preventDefault();
				Flux.navigate(url);
			};
		},
		
		overrideNoScroll(url) {
			return (e) => {
				e.preventDefault();
				Flux.navigate(url, true);
			};
		}
*/
	}
);

window.Flux = Flux;

export default Flux