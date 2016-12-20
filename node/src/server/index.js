'use strict';

import cons from 'consolidate';
import express from 'express';
import path from 'path';
import camelCase from 'lodash/camelCase';
import log from 'lib/log';

import routes from './routes.js';

const port = 3000;
const publicPath = path.resolve(__dirname, '../../build/public');

let app = express();

app.set('port', port);
app.set('host', process.env.VIRTUAL_HOST || ('http://localhost:' + app.get('port') + '/'));

app.engine('html', cons.lodash);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, './'));

app.use(express.static( publicPath ));

app.use('/', routes);
 
app.listen(3000, () => log('Server running'));