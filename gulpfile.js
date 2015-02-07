/**
 * This file is part of the Nodium core package
 *
 * (c) Niko van Meurs & Sid Mijnders
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author Niko van Meurs <nikovanmeurs@gmail.com>
 * @author Sid Mijnders
 */
const
    browserify = require('browserify'),
    gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    source     = require('vinyl-source-stream');


gulp.task('build', function () {

    var bundler,
        stream;

    bundler = browserify({
        entries: ['./js/wrapper.js']
    });

    stream = bundler.bundle();

    return stream
        .pipe(source('./dist/wrapper.js'))
        .pipe(rename('nodium-neo4j.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify', function () {

    return gulp.src('./dist/nodium-neo4j.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
})