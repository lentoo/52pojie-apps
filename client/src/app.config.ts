export default {
  pages: [
    'pages/index/index',
    'pages/plate/index',
    'pages/demo/index',
    'pages/article/detail',
    'pages/plate/list/index',
    'pages/me/index',
    'pages/ant/ant-manor/index',
    'pages/me/record/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white'
  },
  cloud: true,
  tabBar: {
    selectedColor: '#0066CC',
    borderStyle: 'white',
    color: '#777',
    list: [{
      pagePath: "pages/index/index",
      text: "首页",
      iconPath: 'assets/images/commons/home-unselect.png',
      selectedIconPath: 'assets/images/commons/home-selected.png'
    }, 
    {
      pagePath: "pages/plate/index",
      text: '板块',
      iconPath: 'assets/images/commons/plate-unselect.png',
      selectedIconPath: 'assets/images/commons/plate-selected.png'
    },
    {
      pagePath: "pages/me/index",
      text: '我的',
      iconPath: 'assets/images/commons/me-unselect.png',
      selectedIconPath: 'assets/images/commons/me-selected.png'
    }]
  }
}
