'use strict';
 
var {src, dest, watch, parallel} = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var tailwindcss = require('tailwindcss');
 
sass.compiler = require('node-sass');
 
function scss() {
	return src('./src/scss/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
		tailwindcss('./tailwind.js'),
		require('autoprefixer')
		]))
		.pipe(dest('./public'));
};
 
watch('./src/**/*.scss', { events: 'all' }, scss);

function defaultTask(cb) {
	scss();
	cb();
}

exports.default = defaultTask;