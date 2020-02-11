'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    rigger = require('gulp-rigger'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    rimraf = require('gulp-rimraf');

// пути к файлам
var path = {
	public: {
		html: 'public/',
		css: 'public/css/',
		img: 'public/img/',
		fonts: 'public/fonts/'
	},

	src: {
		html: 'src/*.html',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},

	watch: {
		html: 'src/**/*.html',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},

    clean: './public/*'
};

// настройка сервера

var config = {
    server: {
        baseDir: './public',
        index: 'home_page.html'
        // index: 'executor_promo.html'
    },
    port: 3000
};

// запуск сервера

gulp.task('browserSync', function() {
    browserSync(config);
});

// build HTML
gulp.task('build:html', function() {
    return gulp.src(path.src.html)
            .pipe(rigger())
            .pipe(gulp.dest(path.public.html))
            .pipe(browserSync.reload({stream: true}));
});

// build css
gulp.task('build:css', function() {
    return gulp.src(path.src.style)
            .pipe(plumber())
            .pipe(sass())
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
                cascade: false
            }))
            .pipe(rename({basename: 'style', suffix: '.min'}))
            .pipe(cleanCss())
            .pipe(gulp.dest(path.public.css))
            .pipe(browserSync.reload({stream: true}));
});

// build fonts
gulp.task('build:fonts', function() {
    return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.public.fonts));
});

// build images
gulp.task('build:images', function() {
    return gulp.src(path.src.img)
		.pipe(gulp.dest(path.public.img));
});



// remove content build
gulp.task('clean', function() {
    return gulp.src(path.clean)
            .pipe(rimraf());
});

// watcher
gulp.task('watch', function() {
    gulp.watch(path.watch.html, gulp.series('build:html'));
    gulp.watch(path.watch.style, gulp.series('build:css'));
    gulp.watch(path.watch.fonts, gulp.series('build:images'));
    gulp.watch(path.watch.fonts, gulp.series('build:fonts'));
});

// build project
gulp.task('build',
    gulp.series('clean',
        gulp.parallel(
            'build:html',
            'build:css',
            'build:images',
            'build:fonts'
        )
    )
);

// build and watch
gulp.task('default',
    gulp.series(
        'build',
        gulp.parallel('browserSync', 'watch')
    )
);