# <NAME_OF_PROJECT>

This store is hosted at <LINK_HERE>.

## Development Environment Setup Instructions
### Existing Store
1. Open the store on Shopify, and create a separate theme for yourself, if it doesn't already exist
1. Clone the existing repo for the store
1. Copy `credentials_template.json` to `credentials.json`
1. In `credentials.json`, set `api_key`, `password`, and `theme` for shop (`theme` should be your dev theme)
1. In your terminal, navigate to the folder
1. (Until the `grunt-shopify` package is updated past 0.5.0) run `npm install https://github.com/wilr/grunt-shopify/tarball/master`
1. run `npm install`
1. run `grunt shopify:upload`

## Day-to-day use
1. In `Gruntfile.js`, set `environment` based on current activity
1. run `grunt watch`
1. All SCSS files should be created in `src/scss`, and included via `@import`
1. All JS files should be created in `src/js`
1. All other assets should be created in `shop/assets`

## Using local Development environment
Rather than watching for files and uploading assets(js and css files) to Shopify theme servers, the current Grunt file supports development server that contains compiled css and js files with maps.

#### Steps:
1. Watch compiled js and css files and run local development server:
    ```
    $ npm run dev
    ```
1. Make sure to edit the `theme.liquid` files an use the local address from the development server.
    It's better to comment the compiled for production version of the fils.
    
    For JS files:
    ```
        {% comment %}
            {{ 'libs.min.js' | asset_url | script_tag }}
            {{ 'app.min.js' | asset_url | script_tag }}
        {% endcomment %}

        <script type="text/javascript" src="http://127.0.0.1:9001/assets/libs.min.js"></script>
        <script type="text/javascript" src="http://127.0.0.1:9001/assets/app.min.js"></script>
    ```
    
    For CSS files:
    ```
        {% comment %}
            {{ 'application.css' | asset_url | stylesheet_tag }}
            {{ 'slick.css' | asset_url | stylesheet_tag }}
        {% endcomment %}

        <link rel="stylesheet" href="http://127.0.0.1:9001/assets/application.css">
        <link rel="stylesheet" href="http://127.0.0.1:9001/assets/slick.css">
    ```

-----
