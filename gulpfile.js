const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

gulp.task('serve', ['sass'], ()=>{
	browserSync.init({
		server:{
			baseDir:"./"
		}
	});
	gulp.watch("sass/*.scss", ['sass']);
	gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('sass',()=>{
	return gulp.src("./sass/**/*.scss")
	.pipe(sass())
	.pipe(gulp.dest("./"))
	.pipe(browserSync.stream());
})

gulp.task('default',['serve']);