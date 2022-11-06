// 导入api接口模块
export const panelList = [
  {
    title: '顶部样式',
    type: 1,
    sysDictItemVOList: [
      {
        itemText: '顶部1',
        iconClass: 'icon-gonggao1',
        type: 'Header',
        componentContent: {
          webTitle: 0, 
          webLogo: '',
          isLogo:true,
          isDate:true
        }
      },
      {
        itemText: '顶部2',
        iconClass: 'icon-gonggao1',
        type: 'Header',
        componentContent: {
          webTitle: 0, 
          webLogo: '',
          isLogo:false,
          isDate:false
        }
      },
      {
        itemText: '顶部3',
        iconClass: 'icon-gonggao1',
        type: 'Header',
        componentContent: {
          webTitle: 0, 
          webLogo: '',
          isLogo:false,
          isDate:true
        }
      },
      {
        itemText: '顶部4',
        iconClass: 'icon-gonggao1',
        type: 'Header',
        componentContent: {
          webTitle: 0, 
          webLogo: '',
          isLogo:true,
          isDate:false
        }
      },
    ]
  },
  {
    title: '基础组件',
    type: 2,
    sysDictItemVOList: [
      {
        itemText: '独立式轮播图',
        iconClass: 'icon-gonggao1',
        type: 'Banner',
        componentContent: {
          websiteHtmlCustomModuleLinkVOList:[
            {
              imgUrl:'',
              sort:0
            }
          ]
        }
      },
      {
        itemText: '背景式轮播图',
        iconClass: 'icon-gonggao1',
        type: 'Banner',
        componentContent: {
          websiteHtmlCustomModuleLinkVOList:[
            {
              imgUrl:'',
              sort:0
            }
          ]
        }
      },
      {
        itemText: '单页Icon导航',
        iconClass: 'icon-gonggao1',
        type: 'Navigation',
        componentContent: {
          lineCount:5,
          pageCount:999,
          websiteHtmlCustomModuleLinkVOList:[
            {
              title:'',
              imgUrl:'',
              sort:0
            }
          ]
        }
      },
      {
        itemText: '轮播Icon导航',
        iconClass: 'icon-gonggao1',
        type: 'Navigation',
        componentContent: {
          lineCount:5,
          pageCount:1,
          websiteHtmlCustomModuleLinkVOList:[
            {
              title:'',
              imgUrl:'',
              sort:0
            }
          ]
        }
      },
      {
        itemText: '版权声明',
        iconClass: 'icon-gonggao1',
        type: 'Statement',
        componentContent: {
          copyright:'XXX提供技术支持'
        }
      },
    ]
  },
  {
    title: '内容组件',
    type: 3,
    sysDictItemVOList: [
      {
        itemText: '直播课',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
      {
        itemText: '精品好课',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
      {
        itemText: '推荐书籍',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
      {
        itemText: '考点资料',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
      {
        itemText: '资讯专区',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
    ]
  },
  {
    title: '营销组件',
    type: 4,
    sysDictItemVOList: [
      {
        itemText: '广告位',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
      {
        itemText: '宣传模块',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
    ]
  }
]
export default panelList
