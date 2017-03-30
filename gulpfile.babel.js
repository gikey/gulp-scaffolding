import gulp from 'gulp';
import init from './init';
import prettify from 'gulp-html-prettify';
import clean from 'gulp-clean';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import cssbeautify from 'gulp-cssbeautify';
import gulpIf from 'gulp-if';
import sass from 'gulp-sass';
import less from 'gulp-less';
import stylus from 'gulp-stylus';
import csso from 'gulp-csso';
import uglify from 'gulp-uglify';
import postcss from 'gulp-postcss';
import jsonFormat from 'gulp-json-format';
import plumber from 'gulp-plumber';
import imageResize from 'gulp-image-resize';

const settings = {
    project: gulp.env.pro || 'test',
    styleMethod: gulp.env.type || 'css',
    script: 'js',
    images: false,
    mock: false,
    styleCompress: true,
    jsCompress: false,
    openBrowser: true,
    port: 3030,
    imgResizeWidth: 100,
    imgResizeHeight: 100,
    imgResizeFormat: 'jpg'
}

let paths = {
    root: './',
    filePath: settings.project,
    buildPath: `${settings.project}/${settings.styleMethod}`,
    sass: `${settings.project}/sass`,
    less: `${settings.project}/less`,
    stylus: `${settings.project}/stylus`,
    css: `${settings.project}/css`,
    js: `${settings.project}/js`,
    images: `${settings.project}/images`
}

const percessors = [
    require('autoprefixer')(),
    require('postcss-triangle')(),
    require('postcss-alias')()
];

gulp.task('init', () => {
    init({
        dir: settings.project,
        style: settings.styleMethod,
        js: settings.script,
        mock: settings.mock,
        image: settings.images
    }, () => {
        setTimeout(() => {
            gulp.src(`${settings.project}/**/*.html`)
                .pipe(prettify({ indent_char: ' ', indent_size: 2 }))
                .pipe(gulp.dest(paths.filePath))

            gulp.src(`${paths.root}/config.json`)
                .pipe(jsonFormat(4))
                .pipe(gulp.dest(paths.root))
        }, 500);

    });
});

gulp.task('css', () => {
    return gulp.src(`${paths.css}/*.css`)
        .pipe(cssbeautify())
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream({ match: '**/*.css' }));
})

gulp.task('sass', () => {
    return gulp.src(`${paths.sass}/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(percessors))
        .pipe(gulpIf(settings.styleCompress, csso(), cssbeautify({ indent: '  ' })))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

// less编译css
gulp.task('less', () => {
    return gulp.src(`${paths.less}/*.less`)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(less().on('error', console.error.bind(console)))
        .pipe(postcss(percessors))
        .pipe(gulpIf(settings.styleCompress, csso(), cssbeautify({ indent: '  ' })))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('stylus', () => {
    return gulp.src([`${paths.stylus}/*.styl`, `!${paths.stylus}/_*.styl`])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(stylus())
        .pipe(postcss(percessors))
        .pipe(gulpIf(settings.styleCompress, csso(), cssbeautify({ indent: '  ' })))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

// gulp.task('es6', () => {
//     return gulp.src(`${paths.js}/app.js`)
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(gulpIf(settings.jsCompress,uglify()))
//         .pipe(gulpIf(settings.jsCompress, rename('main.min.js'), rename('main.js')))
//         .pipe(gulp.dest(`${paths.js}`))
//         .pipe(browserSync.stream({match:'**/*.js'}));
// });

gulp.task('clean', ['resetEnv'], () => {
    settings.project = gulp.env.pro || settings.project;
    return gulp.src(settings.project)
        .pipe(clean())
});

gulp.task('resetEnv', () => {
    let config = require('./config.json');
    settings.project = config.project;
    settings.styleMethod = config.type;
    for (let p in paths) {
        if (p != 'root') {
            if (p == 'buildPath') {
                paths.buildPath = `${settings.project}/${settings.styleMethod}`
            } else if (p == 'filePath') {
                paths.filePath = settings.project;
            } else {
                paths[p] = `${settings.project}/${p}`
            }
        }
    }
});

gulp.task('imageResize', function() {
    gulp.src(`${paths.images}/**/*`)
        .pipe(imageResize({
            width: settings.imgResizeWidth,
            height: settings.imgResizeHeight,
            crop: true,
            upscale: false,
            format: settings.imgResizeFormat
        }))
        .pipe(gulp.dest(paths.images));
});

gulp.task('browser-sync', ['resetEnv', settings.styleMethod], () => {
    browserSync.init({
        server: paths.root,
        open: settings.openBrowser,
        port: settings.port,
        startPath: paths.filePath
    });
    gulp.watch(`${paths.buildPath}/**/*`, [settings.styleMethod]);
    // gulp.watch(`${paths.js}/app.js`,['es6']);
    console.log(`${paths.filePath}/**/*.html`);
    gulp.watch([`${paths.filePath}/**/*.html`, `${paths.filePath}/js/**/*.js`]).on('change', browserSync.reload);
    // gulp.watch(`${paths.project}/*.${settings.tplMethod}`, [settings.tplMethod]);
});

gulp.task('default', ['browser-sync']);