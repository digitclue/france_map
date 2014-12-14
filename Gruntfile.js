module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: [{
					expand: true,
					cwd: 'scss/',
					src: ['*.scss'],
					dest: 'css/',
					ext: '.css'
				}]
			}
		},
		clean: ['.sass-cache', 'css/**/*.map'],
		express: {
			all:{
				options:{
					port: 9000,
					bases: '.',
					livereload: true
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			styles: {
				files: 'scss/**/*.scss',
				tasks: 'sass:dev',
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.registerTask('default', ['express', 'watch']);
};