module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Paths
  var PathConfig = {
    sassDir:        'scss/',
    cssDir:         'css/',
    jsDir:          'js/',
    tempDir:        'temp/',
    distDir:        'production/'
  };

  // tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: PathConfig, 

    //clean files
    clean: {
      options: { force: true },
      all: {
        src: ["<%= config.cssDir %>", "<%= config.imgDir %>"]
      },
      css: {
        src: ["<%= config.cssDir %>**/*.map"]
      }
    },

    // autoprefixer
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 4 version', 'Android 4', 'ie 8', 'ie 9']
      },

      multiple_files: {
        options: {
            map: true
        },
        expand: true,
        flatten: true,
        src: '<%= config.cssDir %>*.css',
        //dest: '<%= config.cssDir %>'
        //dest: '<%= config.tempDir %>css/'
      },

      dist: {
        src: ['<%= config.cssDir %>*.css', 
              '!<%= config.cssDir %>bootstrap.css',
              '!<%= config.cssDir %>bootstrap.min.css',
              '!<%= config.cssDir %>ie.css',
              '!<%= config.cssDir %>ie8.css',
              ],
        //src: '<%= config.cssDir %>*.css'
      },
    },

    //sass
    sass: {
      dev: {
        options: {
          sourceMap: true,
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: '<%= config.sassDir %>',
          src: ['*.scss'],
          dest: '<%= config.cssDir %>',
          ext: '.css'
        }]
      },
      dist: {
        options: {
          sourceMap: false,
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: '<%= config.sassDir %>',
          src: ['*.scss'],
          dest: '<%= config.cssDir %>',
          ext: '.css'
        }]
      },
      min: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= config.sassDir %>',
          src: ['**/*.scss'],
          dest: '<%= config.cssDir %>',
          ext: '.min.css'
        }]
      }
    },

    //watcher project
    watch: {
      options: {
        debounceDelay: 1,
        // livereload: true,
      },
      css: {
        files: ['<%= config.sassDir %>**/*.scss'],
        tasks: ['sass:dev'/*, 'newer:autoprefixer:dist'*/],
        options: {
            spawn: false,
        }
      }
    },

    //Keep multiple browsers & devices in sync when building websites.
    browserSync: {
      dev: {
        bsFiles: {
          src : ['**/*.html','<%= config.cssDir %>**/*.css']
          //src : 'assets/css/*.css'
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

    notify: {
      options: {
        enabled: true,
        max_js_hint_notifications: 5,
        title: "Project"
      },
      watch: {
        options: {
          title: 'Task Complete',  // optional
          message: 'SASS finished running', //required
        }
      },
    }, 

    //copy files
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: './',
            src: [
              '**',

              '!scss/**',
              '!**/**/.svn/**',
              '!css/**',
            ],
            dest: '<%= config.distDir %>'
          } // makes all src relative to cwd
        ]
      },
    },

    csscomb: {
      all: {
        expand: true,
        cwd: '<%= config.cssDir %>',
        src: ['*.css'],
        dest: '<%= config.cssDir %>',
        ext: '.css'
      },

      dist: {
        expand: true,
        src: ['<%= config.cssDir %>*.css', 
              '!<%= config.cssDir %>bootstrap.css',
              '!<%= config.cssDir %>ie.css',
              '!<%= config.cssDir %>ie8.css'
              ],
        ext: '.css'
      }
    },

    cmq: {
      options: {
        log: false
      },
      all: {
        files: {
          '<%= config.cssDir %>*.css' : '<%= config.cssDir %>*.css'
        },
      },
      dist: {
        files: {
          '<%= config.cssDir %>all.css' : '<%= config.cssDir %>all.css'
        },
      }
    },
  });

// run task
//dev 
  //watch
  grunt.registerTask('w', ['watch']);
  //browser sync
  grunt.registerTask('bs', ['browserSync']);

  //watch + browser sync
  grunt.registerTask('dev', ['sass:dev', 'browserSync', 'watch']);
  grunt.registerTask('default', ['dev']);

//finally 
  //css beautiful
  grunt.registerTask('cssbeauty', ['sass:dist', 'cmq:dist', 'autoprefixer:dist', 'csscomb:dist']);

  //final build
  grunt.registerTask('dist', ['clean:css', 'cssbeauty']);

};



