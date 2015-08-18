var del = require('del');
var gulp = require('gulp');
var shell = require('gulp-shell');
var zip = require('gulp-zip');
var username = require('username');
var sequence = require('run-sequence');

/* config */
var path = {
    build:'build',
    push:'/data/local/webapps/system.gaiamobile.org/'
};

var user = username.sync();
var config = require('./config/'+user+'.json');
var zipName = 'application.zip';
var adbPath = config.adb;

/* clean */
gulp.task('clean', function(cb) {
    del([path.build], cb);
});

/* zip */
gulp.task('zip', function () {
    return gulp.src('src/**/*')
        .pipe(zip(zipName))
        .pipe(gulp.dest(path.build));
});

/* push */
var pushCmd = [
    adbPath+' push '+path.build+'/'+zipName+' '+path.push+'/'+zipName,
    adbPath+' reboot'
];
gulp.task('push', shell.task(pushCmd));

gulp.task('build', function(cb){
    sequence('zip','push', cb);
});

/* watch */
gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['build']);
});