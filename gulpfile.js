var { src, dest, parallel } = require('gulp');
var postcss = require('gulp-postcss');
var atImport = require('postcss-import');
var tailwindcss = require('tailwindcss');

function serve() {
	gulp.watch('./src/scss/*.css', ['css']);
};

function css() {
	var plugin = [
		tailwindcss('./tailwind.js'),
		atImport()
	];
	return src('./src/scss/*.css')
		.pipe(postcss(plugin))
		.pipe(dest('./public/'))
};

exports.css = css;
exports.default = parallel(css);