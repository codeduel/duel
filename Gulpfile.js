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
  './src/server/**/*.js',
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
    .pipe(plugin.jshint.reporter(stylish)).on('error', gulpHelpers.printContinueError);
});

//sass
gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(plugin.sass().on('error', plugin.sass.logError))
    .pipe(gulp.dest('./src/client/assets/css')).on('error', gulpHelpers.printContinueError);
});

//browserify using vinyl source streams (gulp-browserify no longer maintained)
gulp.task('browserify', function() {
  //file to browserify
  return browserify(browserifyFiles)
    .bundle().on('error', gulpHelpers.printContinueError)
    //output name
    .pipe(vss('allScripts.js')).on('error', gulpHelpers.printContinueError)
    //output location
    .pipe(gulp.dest('./src/client/assets/js/')).on('error', gulpHelpers.printContinueError);
});

//start dev version using nodemon
gulp.task('nodemon', function(){
  return plugin.nodemon(
    {script: 'src/server/server.js', watch: ['src/server/**/*','src/server/server.js']}
  ).on('error', gulpHelpers.printBreakRestartError);
});

//starts build server
gulp.task('start', plugin.shell.task([
    'echo Starting the server!',
    'node build/server.js'
  ])
);

//watch
gulp.task('watch', function(){
  return gulp.watch(watchFiles, ['devBuild']).on('error', gulpHelpers.printBreakRestartError);
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
  return plugin.bower().on('error', gulpHelpers.printBreakError);
});

//lint build - breaks build on error
gulp.task('lintBuild', ['bowerBuild'], function() {
  return gulp.src(lintFiles)
    .pipe(plugin.jshint())
    .pipe(plugin.jshint.reporter(stylish))
    .pipe(plugin.jshint.reporter('fail')).on('error', gulpHelpers.printContinueError);
});

//sass build - breaks build on error
gulp.task('sassBuild', ['lintBuild'], function () {
  return gulp.src(sassFiles)
    .pipe(plugin.sass().on('error', gulpHelpers.printBreakError))
    .pipe(gulp.dest('./src/client/assets/css')).on('error', gulpHelpers.printBreakError);
});

//browserify build - breaks build on error
gulp.task('browserifyBuild', ['sassBuild'], function() {
  //file to browserify
  return browserify(browserifyFiles)
    .bundle().on('error', gulpHelpers.printBreakError)
    //output name
    .pipe(vss('allScripts.js')).on('error', gulpHelpers.printBreakError)
    //output location
    .pipe(gulp.dest('./src/client/assets/js/')).on('error', gulpHelpers.printBreakError);
});

//build wont copy if any tasks in array throw errors
//need a way to ensure copying doesn't have any errors
gulp.task('build', ['bowerBuild','lintBuild','sassBuild','browserifyBuild'], function(){
  gulp.src(copyFiles).pipe(gulp.dest('./build'))
  .on('error', gulpHelpers.printBreakError)
  .on('end', gulpHelpers.printBuildComplete);
});

//default to dev task
gulp.task('default', ['dev']);
