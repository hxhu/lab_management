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
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              name: '项目管理',
              icon: 'snippets',
              path: '/project',
              component: './project',
            },
            {
              name: '列表展示',
              icon: 'bars',
              path: '/list-display',
              component: './list-display',
            },
            {
              name: '图表展示',
              icon: 'fund', 
              path: '/figure-display',
              component: './figure-display',
            },
            {
              name: '图片展示',
              icon: 'picture',
              path: '/picture-display',
              component: './picture-display',
            },
            {
              name: '视频展示',
              icon: 'video-camera',
              path: '/video-display',
              component: './video-display',
            },
            {
              name: '地图展示',
              icon: 'environment',
              path: '/map-display',
              component: './map-display',
            },
            {
              component: './404',
            },
            // {
            //   path: '/admin',
            //   name: 'admin',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            //   routes: [
            //     {
            //       path: '/admin/sub-page',
            //       name: 'sub-page',
            //       icon: 'smile',
            //       component: './Welcome',
            //       authority: ['admin'],
            //     },
            //   ],
            // },
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
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
