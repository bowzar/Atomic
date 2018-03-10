function grunt_proc(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            main: {
                options: {
                    compress: true,
                },
                files: [{
                    expand: true,
                    cwd: './app/web-ui/views/framework/css/',
                    src: ['theme0*.less', "theme10.less"],
                    dest: './app/web-ui/views/framework/css/',
                    ext: '.css'
                }]
            },
        },
        requirejs: {
            compile: {
                options: {
                    optimize: 'none',
                    baseUrl: "./app/web-ui/",
                    name: 'views/framework/js/require.config',
                    mainConfigFile: './app/web-ui/views/framework/js/require.config.js',
                    include: [
                        "entry",
                    ],
                    out: "./app/web-ui/views/framework/js/require.main.js"
                }
            }
        },
        // concat: {
        //     options: {
        //         separator: '\n',
        //     },
        //     dist: {
        //         src: ['./app/web-ui/views/framework/js/lib/service-*.js'],
        //         dest: './app/web-ui/views/framework/js/lib/services.js',
        //     },
        // },
        // uglify: {
        //     compressjs: {
        //         files: {
        //             './js/global.min.js': ['./js/global.js']
        //         }
        //     }
        // },
        // jshint: {
        //     all: ['./js/global.js']
        // },
        watch: {
            less: {
                files: ['./app/web-ui//views/framework/css/theme.less'],
                tasks: ['less:main']
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // grunt.registerTask('outputcss', ['less:build']);
    // grunt.registerTask('concatjs', ['concat']);
    // grunt.registerTask('compressjs', ['concat', 'jshint', 'uglify']);
    grunt.registerTask('pkjs', ['requirejs']);
    grunt.registerTask('watchall', ['less', 'watch']);
    grunt.registerTask('default');

}


module.exports = grunt_proc;