import toolbox from 'sw-toolbox/sw-toolbox.js';

const debug = (process.env.NODE_ENV === 'development' ? true : false)

toolbox.options.debug = debug;

// uses fastest to make sure we always update the api cache - we make use of the app cache as well, so this shouldn't run too often anyway
toolbox.router.get(/cms.aaff.se\/wp-json/, toolbox.fastest, {
	cache: {
		name: 'api'
	}
});

// shouldn't change without a file name change as well, just cache hard.
toolbox.router.get(/\.(woff|svg|json|jpg|jpeg|gif|png)$/, toolbox.cacheFirst, {
	cache: {
		name: 'staticForever'
	}
});

// might get updated, lets keep them for a day
toolbox.router.get(/(www|ww2|stg).aaff.se.*\.(js|css)/, toolbox.cacheFirst, {
	cache: {
		name: 'staticSomeTime',
		maxAgeSeconds: 86400

	}
});


//cache the pages, but not for longer than a session (15 mins) - to make sure that the app cache is updated
toolbox.router.get(/(www|ww2|stg).aaff.se/, toolbox.cacheFirst, {
	cache: {
		name: 'localPages',
		maxAgeSeconds: 900
	},
});

// GA should only go through network
toolbox.router.get(/google-analytics/, toolbox.networkOnly);


//if not sure, get network first
toolbox.router.default = toolbox.networkFirst;

toolbox.precache([
	'/fonts/pressura.woff',
	'/spritemap.svg',
	'/bundle.css',
	'/bundle.js',
	'/manifest.json'
]);