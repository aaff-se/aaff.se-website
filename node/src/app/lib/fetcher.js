import { polyfill } from 'es6-promise';
import fetch from 'isomorphic-fetch';
import pick from 'lodash/pick';

import log from 'lib/log';
import window from 'adaptors/window';

(typeof window !== 'undefined') && (window.ajaxPending = false);
let ajaxes = {};

let defaultConfig = require('adaptors/proxy-url').default();


function fetcher (config) {
	const mergedConfig = Object.assign({}, defaultConfig, config);
	
	//if we run in development mode, we can fetch draft posts through our api by setting $_GET['dev'] below

	const url = mergedConfig.api() + mergedConfig.url + (process.env.NODE_ENV === 'development' ? '?dev' : '');
	
	log('Fetching:', url);
	const req = fetch(url, mergedConfig)
		.then(response => {
			remove(mergedConfig.url);
			if (response.status >= 400) {
				if(mergedConfig.failure) {
					mergedConfig.failure(response);
				} else {
					throw new Error('Bad response from server');
				}
			}
			return response.json().then(data => {
				return {
					postsPaginationTotal: response.headers.get('X-WP-TotalPages'),
					data: data
				}
			});
		});
	if(mergedConfig.success) {
		req
			.then(mergedConfig.success)
			.catch(mergedConfig.failure);
		}
	add(mergedConfig.url, req);
	return req;
}

function add (url, req) {
	ajaxes[url] = req;
	window.ajaxPending = true;
}

function remove (url) {
	delete ajaxes[url];
	window.ajaxPending = !!Object.keys(ajaxes).length;
}

export default fetcher;
