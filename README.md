# gulp-ionic-webbuild

Add-on Gulp tasks to optimise an Ionic project for mobile web deployment.

## Installation

From your Ionic project directory, run:

```bash
npm i --save-dev gulp-ionic-webbuild
```

Next, at the bottom of your `gulpfile.js`, add the following:

```javascript
require('gulp-ionic-webbuild')(gulp, {
  templatesModule: 'templates'
});
```

**Note: the `templatesModule` value is the name of the Angular module to which the compiled templates will be added (this defaults to "templates"). It's very important that this matches the name of an Angular module included in your app, otherwise things will break in spectacular fashion!**

Finally, add special "marker" comments to the `<head>` section of your `www/index.html` file. These comments will inject your compiled AngularJS templates/partials (using [gulp-angular-templatecache](https://www.npmjs.com/package/gulp-angular-templatecache)) and generate a single optimised JS build file (using [gulp-useref](https://www.npmjs.com/package/gulp-useref) and [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)).

```html
...
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
  <title></title>

  <!-- compiled css output -->
  <link href="css/ionic.app.min.css" rel="stylesheet">

  <!-- build:js({www,www-dist/partials}) js/app.build.js -->
  <!-- ionic/angularjs js -->
  <script src="lib/ionic/js/ionic.bundle.js"></script>

  <!-- cordova script (this will be a 404 during development) -->
  <script src="cordova.js"></script>

  <!-- bower deps -->
  <script src="lib/lodash/lodash.js"></script>
  <script src="lib/moment/moment.js"></script>

  <!-- your app's js -->
  <script src="js/app.js"></script>
  <script src="js/controllers.js"></script>

  <!-- inject:partials -->
  <!-- endinject -->
  <!-- endbuild -->
</head>
...
```

The important bits to notice here are:

```html
<!-- build:js({www,www-dist/partials}) js/app.build.js -->
```
This marks the starting point from which files will be included in the JS build.

```html
<!-- inject:partials -->
<!-- endinject -->
```
This is where your compiled templates will be injected into the file. Since this will be a JS file, it will also be included in the final build.

```html
<!-- endbuild -->
```
This denotes the end point for files to be included in the JS build.

## Usage

Simply run your new Gulp task from your Ionic project directory:

```bash
gulp build-web
```

Your compiled web build can now be found in the `www-dist` folder. You can test it out using a web server of your choice, e.g.:

```bash
npm i -g http-server
http-server www-dist
```
