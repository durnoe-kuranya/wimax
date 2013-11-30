(function () {
	'use strict';

	module.exports = function (grunt) {
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			jslint: {
				all: {
					src: ['scripts/**.js', '*.js'],
					directives: {
						white: true,
						predef: ['window', 'module', 'jQuery'],
						todo: true
					},
					options: {
						white: true
					}
				}
			},
			jasmine: {
				all: {
					src: ['specs/**.js'],
					errorReporting: true
				}
			},
			watch: {
				files: ['scripts/**.js', '*.js'],
				tasks: ['jslint']
			}
		});

		grunt.loadNpmTasks('grunt-jslint');
		grunt.loadNpmTasks('grunt-jasmine-task');
		grunt.loadNpmTasks('grunt-contrib-watch');

		grunt.registerTask('default', ['watch']);
	};
}());