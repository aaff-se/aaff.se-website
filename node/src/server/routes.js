'use strict'

import fs from 'fs';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import cacheLayer from 'lib/cache-layer';

import log from 'lib/log';
import bootstrapper from './bootstrapper';
import App from 'components/app';

let router = express.Router();
let stats = JSON.parse(fs.readFileSync(__dirname + '/stats.json', 'utf8'));
let bodyClass = '';

function renderApp(req, res) {
	bootstrapper(`${req.protocol}://${req.hostname}${req.originalUrl}`, process.env.API_URL, process.env.API_URL)
	.then((state) => {
		const appString = ReactDOMServer.renderToString(<App state={state} />);
		const head = Helmet.rewind();
		if(state.statusCode === 404 ) bodyClass = 'the404';
		if(state.currentPage === 'about-contact' ) bodyClass = 'inv';
		
		res 
		//.header('Link', '</' + stats.app[0] + '>; rel=preload; as=script')
		.render('app', {
			title: head.title,
			meta: head.meta,
			link: head.link,
			state: JSON.stringify(state),
			app: appString,
			bodyClass: bodyClass,
			jsFile: stats.app[0],
			cssFile: stats.app[1],
			cache: JSON.stringify(cacheLayer.getAll())
		});
		
		
	})
	.catch(error => log('server route error', error, error.stack));
}

router.get('/*', renderApp);

export default router;