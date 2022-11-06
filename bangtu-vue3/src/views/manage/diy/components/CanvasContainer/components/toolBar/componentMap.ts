import { defineAsyncComponent } from 'vue'
export const componentMap = {
  'Search':defineAsyncComponent(() => import('./basicsComponent/Search.vue')),// 首页头部
  'Banner':defineAsyncComponent(() => import('./basicsComponent/Banner.vue')),// 轮播图
  'BannerBackground':defineAsyncComponent(() => import('./basicsComponent/BannerBackground.vue')),// 轮播图
  'Navigation':defineAsyncComponent(() => import('./basicsComponent/Navigation.vue')),// 导航
  'NavigationBanner':defineAsyncComponent(() => import('./basicsComponent/NavigationBanner.vue')),// 导航
  'Statement':defineAsyncComponent(() => import('./basicsComponent/Statement.vue')),// 版权声明
  'Live':defineAsyncComponent(() => import('./basicsComponent/Live.vue')),// 直播课
  'Class':defineAsyncComponent(() => import('./basicsComponent/Class.vue')),// 精品课
  'Book':defineAsyncComponent(() => import('./basicsComponent/Book.vue')),// 推荐书籍
  'Data':defineAsyncComponent(() => import('./basicsComponent/Data.vue')),// 考点资料
  'News':defineAsyncComponent(() => import('./basicsComponent/News.vue')),// 资讯
  'Advert':defineAsyncComponent(() => import('./basicsComponent/Advert.vue')),// 广告位
  'Propaganda':defineAsyncComponent(() => import('./basicsComponent/Propaganda.vue')),// 宣传
  'Header':defineAsyncComponent(() => import('./basicsComponent/Header.vue')),// 首页头部
}
export default componentMap