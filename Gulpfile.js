var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugin = gulpLoadPlugins();
var browserify = require('browserify');
var vss = require('vinyl-source-stream');
var stylish = require('jshint-stylish');
var gulpHelpers = require('./build-utils/gulpHelpers.js');

var watchFiles = [
  './src/client/**/*',
  '!./src/client/assets/css/duel.css',
  '!./src/client/assets/js/allScripts.js',
];

var lintFiles = [
  './src/client/**/*.js',
  '!./src/client/assets/js/allScripts.js'
];

var sassFiles = [
  './src/client/assets/sass/**/*.scss'
];

var browserifyFiles = [
  './src/client/app/app.js'
];

//TODO add concat and minify for css / js
//TODO preventy copying files which will be concat/minified during build
var copyFiles = [
  './src/**/*',
  '!./src/client/app'
  // '!./src/client/assets/css/',
  // '!./src/client/assets/lib/',
];

/******************************/
/*  DEV TASKS                 */
/******************************/
//lint
gulp.task('lint', function() {
  return gulp.src(lintFiles)
    .pipe(plugin.jshint())
    .pipe(plugin.jshint.reporter(stylish)).on('error', gulpHelpers.watchErrorContinue);
});

//sass
gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(plugin.sass().on('error', plugin.sass.logError))
    .pipe(gulp.dest('./src/client/assets/css')).on('error', gulpHelpers.watchErrorContinue);
});

//browserify using vinyl source streams (gulp-browserify no longer maintained)
gulp.task('browserify', function() {
  //file to browserify
  return browserify(browserifyFiles)
    .bundle().on('error', gulpHelpers.watchErrorContinue)
    //output name
    .pipe(vss('allScripts.js')).on('error', gulpHelpers.watchErrorContinue)
    //output location
    .pipe(gulp.dest('./src/client/assets/js/')).on('error', gulpHelpers.watchErrorContinue);
});

//start dev version using nodemon
gulp.task('nodemon', function(){
  return plugin.nodemon(
    {script: 'src/server/server.js', watch: ['src/server/**/*','src/server/server.js']}
  ).on('error', gulpHelpers.printWatchError);
});

//starts build server
gulp.task('start', plugin.shell.task([
    'echo Starting the server!',
    'node build/server.js'
  ])
);

//watch
gulp.task('watch', function(){
  return gulp.watch(watchFiles, ['devBuild']).on('error', gulpHelpers.printWatchError);
});

//dev build
gulp.task('devBuild', ['lint','sass','browserify'], gulpHelpers.printDevComplete);

//dev to launch nodemon and keep an eye on files automatically
gulp.task('dev', ['devBuild','watch','nodemon']);


/******************************/
/*  BUILD TASKS               */
/*  tasks run in series       */
/******************************/
//installs bower files
gulp.task('bowerBuild', function() {
  return plugin.bower().on('error', gulpHelpers.printBuildError);
});

//lint build - breaks build on error
gulp.task('lintBuild', ['bowerBuild'], function() {
  return gulp.src(lintFiles)
    .pipe(plugin.jshint())
    .pipe(plugin.jshint.reporter(stylish))
    .pipe(plugin.jshint.reporter('fail')).on('error', gulpHelpers.printBuildError);
});

//sass build - breaks build on error
gulp.task('sassBuild', ['lintBuild'], function () {
  return gulp.src(sassFiles)
    .pipe(plugin.sass().on('error', gulpHelpers.printBuildError))
    .pipe(gulp.dest('./src/client/assets/css')).on('error', gulpHelpers.printBuildError);
});

//browserify build - breaks build on error
gulp.task('browserifyBuild', ['sassBuild'], function() {
  //file to browserify
  return browserify(browserifyFiles)
    .bundle().on('error', gulpHelpers.printBuildError)
    //output name
    .pipe(vss('allScripts.js')).on('error', gulpHelpers.printBuildError)
    //output location
    .pipe(gulp.dest('./src/client/assets/js/')).on('error', gulpHelpers.printBuildError);
});

//build wont copy if any tasks in array throw errors
//need a way to ensure copying doesn't have any errors
gulp.task('build', ['bowerBuild','lintBuild','sassBuild','browserifyBuild'], function(){
  gulp.src(copyFiles).pipe(gulp.dest('./build'))
  .on('error', gulpHelpers.printBuildError)
  .on('end', gulpHelpers.printBuildComplete);
});

//default to dev task
gulp.task('default', ['dev']);
