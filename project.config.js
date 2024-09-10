const path = require('path');
const URI = 'https://accountdev.mingqi-tech.cn/';
// const px2rem = require('postcss-pxtorem');

module.exports = {
  renderer: {
    /**
     * webpack config options
     * see: https://webpack.js.org/configuration/
     */
    webpack: {},
    /**
     * style configs
     */
    style: {
      /**
       * css-loader options
       * see: https://webpack.js.org/loaders/css-loader#options
       */
      css: {},
      /**
       * less-loader options
       * see: https://webpack.js.org/loaders/less-loader#options
       */
      less: {
        lessOptions: {
          modifyVars: {
            '@primary-color': '#38A28A',
          },
          javascriptEnabled: true,
        },
      },
      /**
       * sass-loader options
       * see: https://webpack.js.org/loaders/sass-loader/#options
       */
      sass: {},
      /**
       * postcss-loader options
       * https://webpack.js.org/loaders/postcss-loader/#options
       */
      postcss: {
        postcssOptions: {
          // rem 方案代码
          // plugins: [
          //   px2rem({
          //     rootValue: 12,
          //     unitPrecision: 5,
          //     propList: ['*'],
          //     selectorBlackList: [],
          //     replace: true,
          //     mediaQuery: false,
          //     minPixelValue: 0,
          //   })
          // ]
        },
      },
      /**
       * StylelintWebpackPlugin options
       * see: https://webpack.js.org/plugins/stylelint-webpack-plugin/#options
       */
      lint: null
    },
    /**
     * babel-loader options
     * see: https://webpack.js.org/loaders/babel-loader/#options
     */
    babel: {},
    /**
     * file-loader options
     * see: https://github.com/webpack-contrib/file-loader
     */
    file: {},
    /**
     * EslintWebpackPlugin options
     * see: https://webpack.js.org/plugins/eslint-webpack-plugin/#options
     */
    eslint: {},
    // DevServer see: https://webpack.js.org/configuration/dev-server
    devServer: {
      compress: true,
      port: 3012,
      proxy: {
        '/api': {
          target: URI,
          changeOrigin: true,
        },
      },
    },
    alias: {},
    // CDN配置
    deployOptions: {
      packages: {
        // validator: {
        //   scripts: {
        //     variableName: 'validator',
        //     path: 'validator.min.js',
        //     cdnPath: 'validator.min.js',
        //   },
        // },
        // "echarts": {
        //   scripts: {
        //     variableName: 'echarts',
        //     path: IS_PROD ? 'echarts.min.js' : 'echarts.js',
        //     cdnPath: IS_PROD ? 'dist/echarts.min.js' : 'dist/echarts.js',
        //   }
        // },
        // "@ant-design/icons": {
        //   scripts: {
        //     variableName: 'icons',
        //     path: IS_PROD ? 'authorized.umd.min.js' : 'authorized.umd.js',
        //     cdnPath: IS_PROD ? 'dist/authorized.umd.min.js' : 'dist/authorized.umd.js',
        //   }
        // },
        // axios: {
        //   scripts: {
        //     variableName: 'axios',
        //     path: 'axios.min.js',
        //     cdnPath: 'dist/axios.min.js',
        //   },
        // },
        // react: {
        //   scripts: {
        //     variableName: 'React',
        //     path: 'react.production.min.js',
        //     cdnPath: 'umd/react.production.min.js',
        //   },
        // },
        // 'react-dom': {
        //   scripts: {
        //     variableName: 'ReactDOM',
        //     path: 'react-dom.production.min.js',
        //     cdnPath: 'umd/react-dom.production.min.js',
        //   },
        // },
        // '@remix-run/router': {
        //   scripts: {
        //     variableName: 'RemixRouter',
        //     path: 'router.umd.min.js',
        //     cdnPath: 'dist/router.umd.min.js',
        //   },
        // },
        // 'react-router': {
        //   scripts: {
        //     variableName: 'ReactRouter',
        //     path: 'react-router.production.min.js',
        //     cdnPath: 'dist/umd/react-router.production.min.js',
        //   },
        // },
        // 'react-router-dom': {
        //   scripts: {
        //     variableName: 'ReactRouterDOM',
        //     path: 'react-router-dom.production.min.js',
        //     cdnPath: 'dist/umd/react-router-dom.production.min.js',
        //   },
        // },
        // dayjs: {
        //   scripts: {
        //     variableName: 'dayjs',
        //     path: 'dayjs.min.js',
        //     cdnPath: 'dayjs.min.js',
        //   },
        // },
        // antd: {
        //   scripts: {
        //     variableName: 'antd',
        //     path: 'antd.min.js',
        //     cdnPath: 'dist/antd.min.js',
        //   },
        // },
      },
      useCdn: true,
      getCdnPath: (n, v, p) => `https://unpkg.com/${n}@${v}/${p}`,
    },
  },
  main: {
    webpack: {},
    /**
     * ts-loader options
     * see: https://github.com/TypeStrong/ts-loader
     */
    babel: {},
    alias: {}
  },
  alias: {
    '@packages': path.resolve('packages'),
  },
  // swagger生成器配置
  swaggers: [
    // {
    //   url: `${URI}/api/user-service/v2/api-docs`,
    //   outputs: [
    //     {
    //       dest: path.resolve('apis', 'user-service'),
    //       dtos: [
    //         {
    //           path: '/license/list/pageable',
    //           method: 'get',
    //           name: 'LicenseListPageable',
    //         },
    //       ],
    //       vos: [{ name: 'SysLicenseVo', target: 'SysLicenseVo' }],
    //     },
    //   ],
    // },
  ],
};
