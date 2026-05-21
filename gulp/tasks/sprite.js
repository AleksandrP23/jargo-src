import svgSprite from "gulp-svg-sprite";
import svgmin from "gulp-svgmin";
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';

export const svgSprites = () => {
  return app.gulp.src(app.paths.srcSvg, { encoding: false })
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($, file, done) {
          const skipStripColor = /^bath(-[1-7])?\.svg$/i.test(file.basename);

          if (!skipStripColor) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
          }

          done();
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(app.gulp.dest(app.paths.buildImgFolder));
}
