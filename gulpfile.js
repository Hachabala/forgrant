'use strict';
const gulp 					= require('gulp');
const sass 					= require('gulp-sass'),
	watch	 				= require('gulp-watch'),
	sourcemaps 				= require('gulp-sourcemaps'),
	rigger	 				= require('gulp-rigger'),
	postcss 				= require('gulp-postcss'),
	ejs 					= require('gulp-ejs'),
	uglify	 				= require('gulp-uglify'),
	gulpif 					= require('gulp-if'),
	cssnano 				= require('gulp-cssnano'),
	imagemin 				= require('gulp-imagemin'),
	autoprefixer 			= require('gulp-autoprefixer'),
	plumber 				= require('gulp-plumber'),
	debug 					= require('gulp-debug'),
	cache 					= require('gulp-cache'),
	notify					= require('gulp-notify'),
	fs						= require('fs'),
	del						= require('del'),
	log						= require('fancy-log'),
	imageminJpegRecompress	= require('imagemin-jpeg-recompress'),
	pngquant    			= require('imagemin-pngquant'),
	browserSync 			= require('browser-sync').create();

const useSourceMaps 	= false,
	  isCssNano		    = true;


const path = {
	dist: {
		js:    './dist/js/',
		css:   './dist/css/',
		fonts: './dist/fonts/',
		img:   './dist/img/',
		html:  './dist/'
	},
	src: {
		js:    './src/js/*.js',
		scss:  './src/scss/style.scss',
		fonts: './src/fonts/**/*.*',
		img:   './src/img/**/*.*',
		html:  './src/html/*.ejs'
	},
	watch: {
		js:    './src/js/**/*.js',
		scss:  './src/scss/**/*.scss',
        fonts: './src/fonts/*.*',
		html:  './src/html/**/*.ejs',
		img:   './src/img/**/*.*'
	},
	clean: './dist/'
};

gulp.task('clear', function(){
	return del(path.clean);
});
gulp.task('clearCache', function () {
	return cache.clearAll();
});

gulp.task('clean', gulp.series(['clear','clearCache']));

gulp.task('scss', function () {
    console.clear();
    return gulp.src(path.src.scss) // можно следить только за измененными файлами с помощью since - gulp.src(path.src.scss_all, {since: gulp.lastRun('scss')})
		.pipe(plumber({errorHandler:notify.onError(function (err) {
				return {
					title: 'scss',
					message: err.message
				};
			})
		}))
		.pipe(gulpif(useSourceMaps, sourcemaps.init()))
		.pipe(sass({
			includePaths: require('node-normalize-scss').includePaths
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulpif(isCssNano, cssnano()))
		.pipe(gulpif(useSourceMaps, sourcemaps.write()))
		.pipe(debug({title: 'src'}))
		.pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.stream());
});
gulp.task('css', function () {
    return gulp.src(path.src.css)
		.pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.stream());
});
gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.dist.fonts))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
	//console.log(data_file);
	return gulp.src(path.src.html)
		.pipe(plumber({errorHandler: log}))

		.pipe(ejs({
			//jsonData: jsonFile
		}, {}, {
			ext: '.html'
		}))
		.pipe(debug({title: 'src'}))
		.pipe(gulp.dest(path.dist.html))
		.pipe(browserSync.stream());
});
gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulpif(useSourceMaps, sourcemaps.init()))
        .pipe(gulpif(useSourceMaps, sourcemaps.write()))
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.stream());
});

gulp.task('js_lib', function () {
    return gulp.src(path.src.js_lib)
        .pipe(gulp.dest(path.dist.js_lib))
        .pipe(browserSync.stream());
});
gulp.task('images', function() {
	return gulp.src(path.src.img, {since: gulp.lastRun('images')})
		.pipe(cache(imagemin(
			imagemin.jpegtran({progressive: true}),
			{
				verbose: true,
				plugins: [
					pngquant({quality: 80}),
					imageminJpegRecompress({quality:'low'})
				]
			}
		)))
		.pipe(gulp.dest(path.dist.img));
});

gulp.task('browserSync', function() {
	browserSync.init({
		proxy:'forgrant/dist',
		host: 'forgrant',
		open: "external",
		notify: true
	});
});

gulp.task('watch', function() {
	gulp.watch([path.watch.html,path.watch.js, path.watch.img,path.watch.fonts], gulp.parallel('html','js','images'));
    gulp.watch(path.watch.scss, gulp.parallel('scss'));
});
gulp.task('default', gulp.series('scss','fonts','html','js','images', gulp.parallel('watch','browserSync')));