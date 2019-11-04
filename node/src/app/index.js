'use strict';

import {} from './style.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import env from 'adaptors/env';
import App from 'components/app';

import Flux from 'app/flux';

const rootEl = document.getElementById('root');

window.env = env;
Flux.init();

ReactDOM.hydrate(<App state={state} />, rootEl);
