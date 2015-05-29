'use strict';

module.exports = {
	app: {
		title: 'Out in Science',
		description: 'Out in Science: A community space for the promotion and inclusion of LGBT in math and science.',
		keywords: 'Out in science, Computer Science, Web Development, Education, STEM, LGBT, Gay, Lesbian, Queer, Trans, Transgender, Chemistry, Biology, Physics, Math, engineering, electronics'
	},
	port: process.env.PORT || 3010,
	templateEngine: 'swig',
	sessionSecret: 'LGBT',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [ ],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-route/angular-route.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-sanitize/angular-sanitize.js'
			]
		},
		css: [
			'public/dist/application.min.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
