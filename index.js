var paths = {
  dist: 'www-dist',
  partials: 'www-dist/partials'
};

var del = require('del');
var templateCache = require('gulp-angular-templatecache');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

module.exports = function(gulp, opts) {

  // default opts
  opts = opts || {};
  opts.templatesModule = opts.templatesModule || 'templates';

  gulp.task('build-web-partials', function() {
    return gulp.src('www/{js,templates}/**/*.html')
      .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(templateCache('templateCacheHtml.js', { module: opts.templatesModule }))
      .pipe(gulp.dest(paths.partials));
  });

  gulp.task('build-web-cleanup', ['build-web-js'], function() {
    del([paths.partials]);
  });

  gulp.task('build-web-assets', function() {
    return gulp.src(['www/{css,img,lib/ionic/css,lib/ionic/fonts}/**/*'], { base: 'www' })
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('build-web-js', ['build-web-partials'], function() {
    var assets = useref.assets();
    var partialsInjectFile = gulp.src(paths.partials + '/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: paths.partials,
      addRootSlash: false
    };

    return gulp.src('www/index.html')
      .pipe(inject(partialsInjectFile, partialsInjectOptions))
      .pipe(assets)
      .pipe(gulpif('*.js', ngAnnotate()))
      .pipe(gulpif('*.js', uglify()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('build-web', ['build-web-assets', 'build-web-js', 'build-web-cleanup']);
};
