const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shopify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-connect');

  const is_production = grunt.option('env') == 'production';
  const credentials = is_production
    ? ''
    : grunt.file.readJSON('credentials.json');

  function createGlobalVariables(isDev, isProd) {
    return {
      __DEV__: isDev,
      __PROD__: isProd,
      __TEST__: false,
      __VERSION__: JSON.stringify(require('./package.json').version)
    };
  }

  grunt.initConfig({
    credentials: credentials,
    url: credentials.url,

    shopify: {
      options: {
        api_key: credentials.api_key,
        password: credentials.password,
        url: '<%= url %>',
        theme: credentials.theme_id,
        base: 'shop/'
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: './shop/',
          keepalive: true
        }
      }
    },

    clean: {
      reset: ['shop/**/*.*']
    },

    sass: {
      development: {
        options: {
          style: 'expanded'
        },
        files: [
          {
            expand: true,
            cwd: 'src/scss',
            src: ['*.scss'],
            dest: 'shop/assets',
            ext: '.css'
          }
        ]
      },
      production: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: [
          {
            expand: true,
            cwd: 'src/scss',
            src: ['*.scss'],
            dest: 'shop/assets',
            ext: '.css'
          }
        ]
      }
    },

    pkg: grunt.file.readJSON('package.json'),

    webpack: {
      options: webpackConfig,
      development: {
        mode: 'development',
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin(createGlobalVariables(true, false))
        )
      },
      production: {
        mode: 'production',
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin(createGlobalVariables(false, true))
        ),
        optimization: {
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                parallel: true,
                sourceMap: true,
                mangle: true,
                compress: true
              }
            })
          ]
        }
      }
    },

    //Optimisation of image assets.
    imagemin: {
      options: {
        optimizationLevel: 7,
        progressive: true,
        interlaced: true
      },
      assets: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'shop/assets',
            src: ['**/*.{png,jpg,jpeg,gif,svg}'],
            dest: 'shop/assets'
          }
        ]
      }
    },

    environment: is_production ? 'production' : 'development', // Set to 'development' or 'production', then restart grunt-:watch

    watch: {
      shopify: {
        files: [
          'shop/**/*.liquid',
          'shop/**/*.css',
          'shop/**/*.{png,jpg,jpeg,gif,svg}',
          'shop/**/*.js',
          'shop/**/*.json'
        ],
        tasks: ['shopify'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['src/js/app.js', 'src/js/app/*.js'],
        tasks: ['webpack:development']
      },
      sass: {
        files: ['src/scss/**'],
        tasks: ['sass:development']
      }
    }
  });

  grunt.registerTask('default', ['shopify']);

  grunt.registerTask('compile:development', [
    'webpack:development',
    'sass:development'
  ]);

  grunt.registerTask('compile:production', [
    'webpack:production',
    'sass:production'
  ]);
};
