'use strict';
module.exports = function (grunt) {

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
                    'src/map/Map.js',
                    'src/map/VizLayer.js',
                    'src/viz/viz.js',
                    'src/viz/VizTypes.js',
                    'src/viz/VizObj.js',
                    'src/viz/ViewCoordinator.js',
                    'src/viz/layout/Layout.js',
                    'src/viz/layout/Anchor.js',
                    'src/viz/layout/Grid.js',
                    'src/viz/Colors.js',
                    'src/viz/Sizes.js',
                    'src/viz/ChartConfig.js',
                    'src/viz/pie.js',
                    'src/viz/map/Map.js',
                    'src/viz/map/Util.js',
                    'src/viz/map/Shared.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },
        jsdoc: {
            dist: {
                src: ['dist/*.js'],
                options: {
                    destination: 'doc'
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
        nodeunit: {
            files: ['test/**/*_test.js']
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
                requireCurlyBraces: [ "if" ]
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
    });
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task.
    grunt.registerTask('default', ['jscs', 'jshint', 'concat', 'nodeunit', 'uglify', 'update-docs']);
    grunt.registerTask('update-docs', ['concat', 'jsdoc']);
};
