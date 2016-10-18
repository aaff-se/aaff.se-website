/**
  Example route definitions
  {
    '/': function () {},
    '/projects': function () {},
    '/projects/:pid': function (pid) {}
  }
*/
const routes = {
	home: {
		id: 'home',
		patterns: ['/'],
		data: () => [{
			url: 'aa/v1/home',
			type: 'page',
			slug: 'home',
			async: ['related_content']
		}]
	},
		
	
	aboutContact: {
		id: 'about-contact',
		patterns: ['/about-contact'],
		data: slug => [{
			url: `aa/v1/about-contact`,
			type: 'page',
			slug: 'about-contact',
			async: ['related_content']

		}]
	},
	//does this work? could work be a catch-all? YES!
	work: {
		id: 'work',
		patterns: ['/:cid'],
		data: slug => [{
			url: `aa/v1/work/${slug}`,
			type: 'page',
			slug: slug,
			async: ['related_content']
		}]
	},
	
	notfound: {
		id: 'notfound',
		pattern: '/404',
		statusCode: 404,
		data: () => []
	}
};

export default routes;