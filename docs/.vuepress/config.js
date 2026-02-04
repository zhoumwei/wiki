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
    logo: '/logo/logo.svg',
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
        text: '产品管理',
        children: [
          { text: '产品知识体系指南', link: '/product-management/' },
          { text: '1.1 产品思维', link: '/product-management/foundation/product-thinking' },
          { text: '1.2 产品经理分类', link: '/product-management/foundation/pm-classification' },
          { text: '2.1 产品生命周期', link: '/product-management/strategy/product-lifecycle' },
          { text: '2.2 需求优先级排序', link: '/product-management/strategy/priority-ranking' },
          { text: '2.2.1 RICE模型', link: '/product-management/strategy/rice-model' },
          { text: '2.2.2 MoSCoW法', link: '/product-management/strategy/moscow-method' },
          { text: '2.3 商业模式', link: '/product-management/strategy/business-model' },
          { text: '3.1 PRD文档撰写', link: '/product-management/design/prd-writing' },
          { text: '3.2 用户研究方法', link: '/product-management/design/user-research' },
          { text: '4.1 产品项目管理', link: '/product-management/development/project-management' },
          { text: '5.1 产品数据分析', link: '/product-management/analysis/data-analysis' },
          { text: '6.1 产品经理日常文档', link: '/product-management/collaboration/daily-documentation' },
          { text: '6.2 产品团队协作', link: '/product-management/collaboration/team-collaboration' },
          { text: '7.1 产品文档模板指南', link: '/product-management/templates/template-guide' },
          { text: '7.1.1 PRD模板', link: '/product-management/templates/prd-template' },
          { text: '7.1.2 BRD模板', link: '/product-management/templates/brd-template' },
          { text: '7.1.3 MRD模板', link: '/product-management/templates/mrd-template' },
          { text: '7.1.4 产品分析报告模板', link: '/product-management/templates/analysis-report-template' }
        ]
      },
      {
        text: 'Java',
        children: [
          { text: 'Java基础', link: '/interview/java/basic/' },
          { text: 'Java高级', link: '/interview/java/advanced/' },
          { text: 'Java集合详解', link: '/interview/java/collections/' },
          { text: 'Java多线程详解', link: '/interview/java/concurrency/' },
          { text: 'JDK版本变化详解', link: '/interview/java/jdk-changes/' },
          // { text: 'Spring Boot', link: '/interview/spring-boot/' },
          // { text: 'Spring Cloud', link: '/interview/spring-cloud/' },
          // { text: 'Vue', link: '/interview/vue/' },
          // { text: 'Node.js', link: '/interview/nodejs/' },
          // { text: '大数据', link: '/interview/big-data/' },
          // { text: '消息队列', link: '/interview/message-queue/' },
          // { text: '数据库', link: '/interview/database/' }
        ]
      },
        {
            text: 'Spring',
            children: [
                { text: 'Spring Boot', link: '/interview/spring-boot/' },
                { text: 'Spring Cloud', link: '/interview/spring-cloud/' },
                // { text: 'Vue', link: '/interview/vue/' },
                // { text: 'Node.js', link: '/interview/nodejs/' },
                // { text: '大数据', link: '/interview/big-data/' },
                // { text: '消息队列', link: '/interview/message-queue/' },
                // { text: '数据库', link: '/interview/database/' }
            ]
        },
      {
        text: '技术教程',
        children: [
          { text: 'LLM', link: '/tutorial/llm/' },
          // { text: '强化学习', link: '/tutorial/rl/' },
          // { text: '机器学习', link: '/tutorial/ml/' },
          // { text: 'R语言', link: '/tutorial/r/' },
          // { text: 'Python', link: '/tutorial/python/' },
          // { text: 'React', link: '/tutorial/react/' },
          // { text: 'Swift', link: '/tutorial/swift/' },
          // { text: '嵌入式', link: '/tutorial/embedded/' }
        ]
      },
      {
        text: '解决方案',
        children: [
          { text: 'AIOps', link: '/solution/aiops/' },
          { text: 'FinOps', link: '/solution/finops/' },
          { text: '高可用架构', link: '/solution/high-availability/' },
          { text: '智能营销', link: '/solution/smart-marketing/' }
        ]
      }
    ],
    lastUpdated: false,
    contributors: false,
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
      ],
      '/solution/finops/': [
        {
          text: 'FinOps解决方案',
          link: '/solution/finops/',
          children: [
            '/solution/finops/concept.md',
            '/solution/finops/implementation.md',
            '/solution/finops/tools.md',
            '/solution/finops/case-studies.md',
            '/solution/finops/risk-trends.md'
          ]
        }
      ],
      '/product-management/': [
        {
          text: '产品经理知识体系指南',
          link: '/product-management/',
          children: [
            '/product-management/foundation/product-thinking.md',
            '/product-management/foundation/pm-classification.md',
            '/product-management/strategy/product-lifecycle.md',
            '/product-management/strategy/priority-ranking.md',
            // '/product-management/strategy/rice-model.md',
            // '/product-management/strategy/moscow-method.md',
            '/product-management/strategy/business-model.md',
            '/product-management/design/prd-writing.md',
            '/product-management/design/user-research.md',
            '/product-management/development/project-management.md',
            '/product-management/analysis/data-analysis.md',
            '/product-management/collaboration/daily-documentation.md',
            '/product-management/collaboration/team-collaboration.md',
            '/product-management/templates/template-guide.md',
            '/product-management/templates/prd-template.md',
            '/product-management/templates/brd-template.md',
            '/product-management/templates/mrd-template.md',
            '/product-management/templates/analysis-report-template.md'
          ]
        }
      ]
    }
  }),

  bundler: webpackBundler()
})
