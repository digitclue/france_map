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
		watch: {
			options: {
				debounceDelay: 1,
				// livereload: true
			},
			styles: {
				files: 'scss/**/*.scss',
				tasks: 'sass:dev',
				options: {
					spawn: false
				}
			}
		},
		browserSync: {
      dev: {
        bsFiles: {
          src : ['**/*.html','css/**/*.css', '*.css']
        },
        options: {
          server: {
            baseDir: "./",
            index: "index.html",
            directory: true
          },
          watchTask: true
        }
      }
    },
	});

	grunt.registerTask('default', ['sass:dev', 'browserSync', 'watch']);
};