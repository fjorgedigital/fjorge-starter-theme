// Questions? Visit our documentation: http://wjiki.fjorgedigital.com/index.php?title=Gulp

/****************************************
        DEPENDENCIES
*****************************************/
/*
 * This list of dependency variables comes from the package.json file. Ensure any dependency listed here is also added to package.json.
 * These variables are declared here at the top and are used throughout the gulpfile to complete certain tasks and add functionality.
*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');


/****************************************
        SOURCE PATHS
*****************************************/
/*
  You'll also notice there is a number 1 and 2 next to some of the source paths. There are 2 different ways to set up your source files depending on your project's needs:
  1) The first way is to set your paths with a wildcard: *. This will allow you to add any files to your source directories and gulp will compile all of them.
  2) The other way is to manually add the file paths you want to be compiled. This will allow you to order certain libraries or custom files for dependency sake. If there is no need to get this granular control, leaving it set to the wildcard makes things rather straightforward during development.
*/
var input_sass_stylesheet = './src/sass/style.scss';
var input_sass_components = './src/sass/**/*.scss';
var input_vendor_css = './src/vendor/css/**/*.css';

var input_custom_js =   [
                            './src/js/*.js', // 1 - used as a catch-all. This will add all .js files located within src/js/ to be compiled.
                            // './src/js/main.js', // 2 - FOR DEPENDENCIES - if you want to control your enqueue order, manually add each file in the order you'd like
                        ];
var input_vendor_js =  [
                            './src/vendor/js/**/*.js', // 1 - used as a catch-all. This will add all .js files located within src/vendor/js/ to be compiled and minfied.
                            // './src/vendor/js/**/slick.js', // 2 - FOR DEPENDENCIES - if you want to control your enqueue order, manually add each file in the order you'd like
                        ];


/****************************************
        DISTRIBUTION DIRECTORIES
*****************************************/
// Location of where compiled production files should be placed
var destination_sass = './dist/css/';
var destination_js = './dist/js/';


/****************************************
        STANDARD TASKS
*****************************************/

// COMPILE SASS :: UN-MINIFIED & MINIFIED
gulp.task('sass', function() {
    return gulp.src(input_sass_stylesheet)
        .pipe(sass({
            sourceComments: 'map',
            sourceMap: 'sass',
            outputStyle: 'nested'
        })
        .on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(destination_sass))

        // minify for production
        .pipe(rename('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(destination_sass));
});

// COMPILE & MINIFY VENDOR & MISC CSS
gulp.task('vendor-css', function() {
    return gulp.src(input_vendor_css)
        .pipe(concat('vendor.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(destination_sass));
});


// COMPILE CUSTOM JS :: UN-MINIFIED & MINIFIED
gulp.task('scripts', function() {
	return gulp.src(input_custom_js)
	    .pipe(concat('custom.js'))
	    .pipe(gulp.dest(destination_js))

	    // minify for production
	    .pipe(rename('custom.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(destination_js));
});

// COMPILE & MINIFY VENDOR JS
gulp.task('vendor-scripts', function() {
    return gulp.src(input_vendor_js)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destination_js));
});




/****************************************
    	CUSTOM PROJECT TASKS
*****************************************/

// PROJECT TASK ONE
// gulp.task('project-task', function(){
//	return gulp.src('')
// });




/****************************************
        BUILD TASK
*****************************************/
// COMPILES SCSS, CSS & JS, does NOT watch for file changes
gulp.task('build', ['sass', 'vendor-css', 'scripts', 'vendor-scripts']);



/****************************************
        WATCH TASK
*****************************************/
// WATCH AND LOG SOURCE FILE CHANGES
gulp.task('watch', function () {
    gulp.watch(input_custom_js, ['scripts'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    gulp.watch(input_vendor_js, ['vendor-scripts'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    gulp.watch(input_sass_components, ['sass'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    gulp.watch(input_sass_stylesheet, ['sass'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});


/****************************************
        DEFAULT TASK
*****************************************/
// DEFAULT GULP TASK
gulp.task('default', ['build', 'watch']);

