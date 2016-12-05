'use strict'

import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import cacheLayer from 'lib/cache-layer';

import log from 'lib/log';
import bootstrapper from './bootstrapper';
import App from 'components/app';

let router = express.Router();

function renderApp(req, res) {
	bootstrapper(`${req.protocol}://${req.hostname}${req.originalUrl}`, process.env.API_URL, process.env.API_URL)
	.then((state) => {
		const AppString = ReactDOMServer.renderToString(<App state={state} />);
		const head = Helmet.rewind();
		
		const bodyClass = (state.statusCode === 404 ? 'the404' : '');
		res 
		//.header('Link', "</bundle.js>; rel=preload; as=script")
		.render('app', {
			title: head.title,
			meta: head.meta,
			link: head.link,
			state: JSON.stringify(state),
			app: AppString,
			bodyClass: bodyClass,
			cache: JSON.stringify(cacheLayer.getAll())
		});
	})
	.catch(error => log('server route error', error, error.stack));
}

router.get('/*', renderApp);

export default router;