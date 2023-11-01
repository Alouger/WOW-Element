/* eslint-env node */
// .eslintrc.cjs的第一行也写了这个，作用是注明当前eslint的环境
module.exports = {
    plugins: [
      require('postcss-each-variables'),
      require('postcss-nested'),
      require('postcss-each')({
        plugins: {
          beforeEach: [
            require('postcss-for'),
            require('postcss-color-mix')
          ]
        }
      }),
    ]
}