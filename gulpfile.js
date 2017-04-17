var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'), // css压缩
    uglify = require('gulp-uglify'),// js压缩
    rename = require('gulp-rename'), // 输出重命名
    concat = require('gulp-concat'), // 文件拼接
    requirejsOptimize = require('gulp-requirejs-optimize'),
    livereload = require('gulp-livereload'); // 当监听文件发生变化时，浏览器自动刷新页面
    



gulp.task('scripts', function () {
    return gulp.src('src/js/main.js')
        .pipe(requirejsOptimize())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('css',function(){
    return gulp.src('stylesheets/*.css')
            .pipe(concat('all.css'))
            .pipe(minifycss())
            .pipe(gulp.dest('dist/css'))
})