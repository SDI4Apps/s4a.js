'use strict';
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                nonull: true,
                src: [
                    'src/<%= pkg.name %>.js',
                    'src/config/Config.js',
                    'src/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },
        jsdoc: {
            dist: {
                src: [
                    'src/**/*.jsdoc',
                    'src/**/*.js',
                    'README.md'
                ],
                options: {
                    destination: 'doc',
                    template: "node_modules/ink-docstrap/template",
                    configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                preserveComments: false,
                mangle: {
                    except: ['jQuery']
                }
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: [
                    'test/**/*.test.js',
                    'test/**/*.helper.js'
                ]
            }
        },
        jscs: {
            src: 'src/**/*.js',
            options: {
                preset: 'google.json',
                config: '.jscsrc',
                // If you use ES6 http://jscs.info/overview.html#esnext
                esnext: true,
                // If you need output with rule names
                // http://jscs.info/overview.html#verbose
                verbose: true,
                // Autofix code style violations when possible.
                fix: true,
                requireCurlyBraces: ["if"]
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:src', 'nodeunit']
            }
        },
        jasmine: {
            test: {
                src: 'dist/s4a.js',
                options: {
                    specs: 'test/*.test.js',
                    helpers: 'test/*.helper.js',
                    vendor: [
                        "node_modules/jquery.1/node_modules/jquery/dist/jquery.min.js",
                        "node_modules/dc/node_modules/crossfilter/crossfilter.min.js",
                        "node_modules/dc/node_modules/d3/d3.min.js",
                        "node_modules/dc.js"
                    ]
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task.
    grunt.registerTask('default', ['jscs', 'jshint', 'concat', 'uglify', 'update-docs']);
    grunt.registerTask('update-docs', ['concat', 'jsdoc']);
    grunt.registerTask('test', ['jscs', 'jshint', 'concat', 'jasmine:test']);
};