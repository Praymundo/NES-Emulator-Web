const { watch, src, dest, series, parallel } = require('gulp');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./gulpfile.assets/webpack-config');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');

function clean() {
	return del(['./dist/**', '!./dist']);
}

function buildAll() {
	return src('src/index.mjs').pipe(plumber()).pipe(webpackStream(webpackConfig.getConfig(), webpack)).pipe(dest('./dist/'));
}

function copyStatic() {
	return src(['src/assets/lib/**/*']).pipe(dest('./dist/lib/'));
}

function watcher() {
	browserSync.init({
		ui: false,
		open: false,
		//watch: true,
		server: {
			baseDir: './dist'
		},
		port: 8000
	});
	watch(
		['./src/**/*.html', './src/index.mjs', './src/module/**/*.*', './src/assets/css/**/*.*'],
		series(build, function browserSyncReload(done) {
			browserSync.reload();
			done();
		})
	);
}

const build = parallel(copyStatic, buildAll);
const buildDist = series(clean, build);
const buildDevelop = series(buildDist, watcher);

exports.build = buildDist;
exports.default = buildDist;
exports.dev = buildDevelop;
