// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: '注册结果页',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: '注册页',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          name: '个人中心',
          icon: 'smile',
          path: '/user/center',
          component: './user/center',
        },
        {
          name: '个人设置',
          icon: 'smile',
          path: '/user/settings',
          component: './user/settings',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              name: 'welcome',
              icon: 'smile',
              path: '/welcome',
              component: './Welcome',
            },
            // {
            //   name: 'manager',
            //   icon: 'cluster',
            //   path: '/manager',
            //   component: './manager',
            // },
            // {
            //   name: 'config',
            //   icon: 'tool',
            //   path: '/config',
            //   component: './config',
            // },
            // {
            //   name: 'monitor',
            //   icon: 'dashboard',
            //   path: '/monitor',
            //   component: './monitor',
            // },
            {
              name: 'model-push',
              icon: 'download',
              path: '/model-push',
              component: './model-push',
            },
            {
              name: 'video-display',
              icon: 'video-camera',
              path: '/video-display',
              component: './video-display',
            },
            {
              name: 'device-manager',
              icon: 'setting',
              path: '/device-manager',
              component: './device-manager',
            },
            {
              name: 'log',
              icon: 'calendar',
              path: '/log',
              component: './log',
            },
            {
              name: 'config-push',
              icon: 'file-text',
              path: '/config-push',
              component: './config-push',
            },
            {
              name: 'dataset-manager',
              icon: 'database',
              path: '/dataset-manager',
              component: './dataset-manager',
            },
            {
              name: 'data-upload',
              icon: 'cloud-upload',
              path: '/data-upload/:page',
              component: './data-upload',
              hideInMenu: true
            },
            // {
            //   name: 'picture-display',
            //   icon: 'picture',
            //   path: '/picture-display',
            //   component: './picture-display',
            // },
            // {
            //   name: 'video-display',
            //   icon: 'video-camera',
            //   path: '/video-display',
            //   component: './video-display',
            // },
            // {
            //   name: 'map-display',
            //   icon: 'environment',
            //   path: '/map-display',
            //   component: './map-display',
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy:{
    '/api/': {
      // target: 'https://preview.pro.ant.design',
      target: 'http://127.0.0.1:18800/dlplatform',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
