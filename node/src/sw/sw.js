import {registerRoute} from 'workbox-routing/registerRoute.mjs';
import {setDefaultHandler} from 'workbox-routing/setDefaultHandler.mjs';
import {CacheFirst} from 'workbox-strategies/CacheFirst.mjs';
import {StaleWhileRevalidate} from 'workbox-strategies/StaleWhileRevalidate.mjs';
import {NetworkFirst} from 'workbox-strategies/NetworkFirst.mjs';
import {NetworkOnly} from 'workbox-strategies/NetworkOnly.mjs';
import {Plugin as ExpirationPlugin} from 'workbox-expiration/Plugin.mjs';
import {Plugin as CacheableResponse} from 'workbox-cacheable-response/Plugin.mjs';

const debug = (process.env.NODE_ENV === 'development' ? true : false)


// Need to regex ".*" for external requests, in order to match the full url
registerRoute(
  new RegExp('.*google-analytics.*'),
  new NetworkOnly({
    cacheName: 'ga',
  })
);

//cache local static
registerRoute(
  new RegExp('\.(woff|json|jpg|jpeg|gif|png|js|css|ico|svg)$'),
  new CacheFirst({
    cacheName: 'staticForever',
    plugins: [
      new CacheableResponse({
        statuses: [0, 200],
      }),
    ]
  })
);

//cache external static from api url
registerRoute(
  new RegExp('.*' + process.env.API_URL.replace('.','\.') + '.*\.(woff|json|jpg|jpeg|gif|png|js|css|ico|svg)$'),
  new CacheFirst({
    cacheName: 'staticForever',
    plugins: [
      new CacheableResponse({
        statuses: [0, 200],
      }),
    ]
  })
);

//cache api response from the api url
registerRoute(
  new RegExp('.*' + process.env.API_URL.replace('.','\.') + '.*'),
  new StaleWhileRevalidate({
    cacheName: 'api',
    plugins: [
      new CacheableResponse({
        statuses: [0, 200],
      }),
    ]
  })
);

registerRoute(
  new RegExp('(www|ww2|stg)\.aaff\.se'),
  new CacheFirst({
    cacheName: 'localPages',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 300,
      }),
      new CacheableResponse({
        statuses: [0, 200],
      }),
    ]
  })
);



setDefaultHandler(
  new NetworkOnly()
);
