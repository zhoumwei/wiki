import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  base: '/wiki/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '技术面试宝典',
      description: '涵盖Java、Spring、Vue、Node.js等技术面试题'
    }
  },

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',
    navbar: [
      {
        text: '首页',
        link: '/'
      },
      // {
      //   text: '开始阅读',
      //   link: '/get-started'
      // },
      {
        text: '面试题',
        children: [
          { text: 'Java基础', link: '/interview/java/basic/' },
          { text: 'Java高级', link: '/interview/java/advanced/' },
          { text: 'Spring Boot', link: '/interview/spring-boot/' },
          { text: 'Spring Cloud', link: '/interview/spring-cloud/' },
          { text: 'Vue', link: '/interview/vue/' },
          { text: 'Node.js', link: '/interview/nodejs/' },
          { text: '大数据', link: '/interview/big-data/' },
          { text: '消息队列', link: '/interview/message-queue/' },
          { text: '数据库', link: '/interview/database/' }
        ]
      }
    ],
    sidebar: {
      '/get-started': [
        {
          text: '开始阅读',
          link: '/get-started'
        }
      ],
      '/interview/java/basic/': [
        {
          text: 'Java基础面试题',
          link: '/interview/java/basic/'
        }
      ],
      '/interview/java/advanced/': [
        {
          text: 'Java高级面试题',
          link: '/interview/java/advanced/'
        }
      ],
      '/interview/spring-boot/': [
        {
          text: 'Spring Boot面试题',
          link: '/interview/spring-boot/'
        }
      ],
      '/interview/spring-cloud/': [
        {
          text: 'Spring Cloud面试题',
          link: '/interview/spring-cloud/'
        }
      ],
      '/interview/vue/': [
        {
          text: 'Vue面试题',
          link: '/interview/vue/'
        }
      ],
      '/interview/nodejs/': [
        {
          text: 'Node.js面试题',
          link: '/interview/nodejs/'
        }
      ],
      '/interview/big-data/': [
        {
          text: '大数据面试题',
          link: '/interview/big-data/'
        }
      ],
      '/interview/message-queue/': [
        {
          text: '消息队列面试题',
          link: '/interview/message-queue/'
        }
      ],
      '/interview/database/': [
        {
          text: '数据库面试题',
          link: '/interview/database/'
        }
      ]
    }
  }),

  bundler: webpackBundler()
})
