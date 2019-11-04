'use strict'

import fs from 'fs';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import cacheLayer from 'lib/cache-layer';

import window from 'adaptors/window';
import log from 'lib/log';
import bootstrapper from './bootstrapper';
import App from 'components/app';

let router = express.Router();
let stats = JSON.parse(fs.readFileSync(__dirname + '/stats.json', 'utf8'));

function extractJsLinks(input){

  let localList = [];
  (function recCheck(input){
    if(((typeof input) == 'object') || ((typeof input) == 'array')) {
      for (var key in input) {
        recCheck(input[key]);
      }
   } else {
     if(input.indexOf('.js') > -1)
      localList.push(input);
    }
  })(input);
  return localList;
}
const jsLinks = extractJsLinks(stats);

let preloads = '';

for (var i=0; i<jsLinks.length;i++)
  preloads += '</' + jsLinks[i] + '>; rel=preload; as=script, ';

preloads += '</' + stats.app[0] + '>; rel=preload; as=style, </fonts/pressura.woff>; rel=preload; as=font; crossorigin';

console.log(preloads);

function renderApp(req, res) {
	bootstrapper(`${req.protocol}://${req.hostname}${req.originalUrl}`, process.env.API_URL, process.env.API_URL)
	.then((state) => {
		const appString = ReactDOMServer.renderToString(<App state={state} />);
		const head = Helmet.rewind();
		let bodyClass = '';
		if(state.statusCode === 404 ){ bodyClass = 'the404'; }
		if(state.currentPage === 'about-contact' ){ bodyClass = 'inv'; }
		console.log('the body class: ' + bodyClass);
		res
		.status(state.statusCode)
		.header('Link',preloads)
		.render('app', {
			title: head.title,
			meta: head.meta,
			link: head.link,
			state: JSON.stringify(state),
			app: appString,
			bodyClass: bodyClass,
			jsFiles: jsLinks,
			cssFile: stats.app[0],
			cache: JSON.stringify(cacheLayer.getAll()),
			dev: window.env.verbose
		});


	})
	.catch(error => log('server route error', error, error.stack));
}

router.get('/*', renderApp);

export default router;
