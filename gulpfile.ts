import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import replace from "gulp-replace";
import tap from "gulp-tap";
import babel from "gulp-babel";
import del from "del";

const sass = gulpSass(dartSass);
const { parallel, series } = gulp;
const srcPath = "./src/**";
const distPath = "./dist/";

// 存放variable和mixin的sass文件在被引用时直接导入，不引入dist目录中
const DIRECTIMPORT = ["/scss/"];

// del
const clear = async () => {
  return await del.sync([distPath]);
};

// ts
const buildTs = () => {
  const files = `${srcPath}/*.{js,ts}`;
  return gulp
    .src(files)
    .pipe(babel({ presets: ["@babel/typescript"] }))
    .pipe(gulp.dest("dist"));
};

// 原样复制
const copy = () => {
  const files = `${srcPath}/*.{sjs,axml,json}`;
  const imageFiles = `${srcPath}/*.{png,jpg,gif,ico}`;
  return gulp.src([files, imageFiles], { since: gulp.lastRun(copy) }).pipe(gulp.dest(distPath));
};

// 处理样式文件 全部当scss
const buildSacc = () => {
  const sassFiles = [`${srcPath}/*.{acss,scss}`];
  return gulp
    .src(sassFiles, { since: gulp.lastRun(buildSacc) })
    .pipe(
      tap((file) => {
        file.contents = Buffer.from(
          // 匹配@import
          String(file.contents)
            // 将原有 import 且已经被注释的删掉
            .replace(/\/\*[\s\S]@import[\s\S]*?\*\//g, "")
            .replace(/\/\/@import[\s\S]*?\n/g, "")
            // 将原有 import 且不在 DIRECTIMPORT 文件中的注释掉
            .replace(/@import\s+['|"](.+?)['|"];?/g, ($1, $2) => {
              return DIRECTIMPORT.some((item) => {
                return $2.indexOf(item) > -1;
              })
                ? $1
                : `/** ${$1} **/`;
            })
        );
      })
    )
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(
      // 去掉注释并修改scss后缀为acss
      replace(/(\/\*\*\s{0,})(@.+?)(\s{0,}\*\*\/)/g, ($1, $2, $3) => {
        return $3.replace(/\.scss/g, ".acss");
      })
    )
    .pipe(
      rename({
        extname: ".acss",
      })
    )
    .pipe(gulp.dest(distPath));
};

exports.default = series(clear, parallel(buildSacc, copy, buildTs));
