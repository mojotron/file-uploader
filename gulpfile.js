import gulp from "gulp";
import gulpTypescript from "gulp-typescript";
import gulpCopy from "gulp-copy";

const typescriptProject = gulpTypescript.createProject("tsconfig.json");

gulp.task("scripts", () => {
  return typescriptProject
    .src()
    .pipe(typescriptProject())
    .pipe(gulp.dest("dist"));
});

gulp.task("copy-public", () => {
  return gulp
    .src("src/public/**/*")
    .pipe(gulpCopy("dist/public", { prefix: 2 }));
});

gulp.task("copy-views", () => {
  return gulp.src("src/views/**/*").pipe(gulpCopy("dist/views", { prefix: 2 }));
});

gulp.task("build", gulp.series("scripts", "copy-public", "copy-views"));
