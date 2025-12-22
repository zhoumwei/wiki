import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  base: '/wiki/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '知识库',
      description: '涵盖Java、Spring、Vue、Node.js等技术知识'
    }
  },

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',
    navbar: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '开始阅读',
        link: '/get-started'
      },
      {
        text: '面试题',
        children: [
          { text: 'Java基础', link: '/interview/java/basic/' },
          { text: 'Java高级', link: '/interview/java/advanced/' },
          { text: 'Java集合详解', link: '/interview/java/collections/' },
          { text: 'Java多线程详解', link: '/interview/java/concurrency/' },
          { text: 'JDK版本变化详解', link: '/interview/java/jdk-changes/' },
          { text: 'Spring Boot', link: '/interview/spring-boot/' },
          { text: 'Spring Cloud', link: '/interview/spring-cloud/' },
          { text: 'Vue', link: '/interview/vue/' },
          { text: 'Node.js', link: '/interview/nodejs/' },
          { text: '大数据', link: '/interview/big-data/' },
          { text: '消息队列', link: '/interview/message-queue/' },
          { text: '数据库', link: '/interview/database/' }
        ]
      },
      {
        text: '技术教程',
        children: [
          { text: 'LLM', link: '/tutorial/llm/' },
          { text: '强化学习', link: '/tutorial/rl/' },
          { text: '机器学习', link: '/tutorial/ml/' },
          { text: 'R语言', link: '/tutorial/r/' },
          { text: 'Python', link: '/tutorial/python/' },
          { text: 'React', link: '/tutorial/react/' },
          { text: 'Swift', link: '/tutorial/swift/' },
          { text: '嵌入式', link: '/tutorial/embedded/' }
        ]
      },
      {
        text: '解决方案',
        children: [
          { text: 'AIOps', link: '/solution/aiops/' },
          { text: '高可用架构', link: '/solution/high-availability/' },
          { text: '智能营销', link: '/solution/smart-marketing/' }
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
      '/interview/java/collections/': [
        {
          text: 'Java集合详解',
          link: '/interview/java/collections/'
        }
      ],
      '/interview/java/concurrency/': [
        {
          text: 'Java多线程详解',
          link: '/interview/java/concurrency/'
        }
      ],
      '/interview/java/jdk-changes/': [
        {
          text: 'JDK版本变化详解',
          link: '/interview/java/jdk-changes/'
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
      ],
      '/tutorial/llm/': [
        {
          text: 'LLM学习教程',
          link: '/tutorial/llm/'
        }
      ],
      '/tutorial/rl/': [
        {
          text: '强化学习教程',
          link: '/tutorial/rl/'
        }
      ],
      '/tutorial/ml/': [
        {
          text: '机器学习教程',
          link: '/tutorial/ml/'
        }
      ],
      '/tutorial/r/': [
        {
          text: 'R语言教程',
          link: '/tutorial/r/'
        }
      ],
      '/tutorial/python/': [
        {
          text: 'Python教程',
          link: '/tutorial/python/'
        }
      ],
      '/tutorial/react/': [
        {
          text: 'React教程',
          link: '/tutorial/react/'
        }
      ],
      '/tutorial/swift/': [
        {
          text: 'Swift教程',
          link: '/tutorial/swift/'
        }
      ],
      '/tutorial/embedded/': [
        {
          text: '嵌入式教程',
          link: '/tutorial/embedded/'
        }
      ],
      '/solution/aiops/': [
        {
          text: 'AIOps解决方案',
          link: '/solution/aiops/'
        }
      ],
      '/solution/high-availability/': [
        {
          text: '高可用架构解决方案',
          link: '/solution/high-availability/'
        }
      ],
      '/solution/smart-marketing/': [
        {
          text: '智能营销解决方案',
          link: '/solution/smart-marketing/'
        }
      ]
    }
  }),

  bundler: webpackBundler()
})
