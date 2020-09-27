export default {
  pages: [
    'pages/index/index',
    'pages/plate/index',
    'pages/demo/index',
    'pages/article/detail',
    'pages/plate/list/index'
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
      pagePath: "pages/demo/index",
      text: 'Demo',
      iconPath: 'assets/images/commons/home-unselect.png',
      selectedIconPath: 'assets/images/commons/home-selected.png'
    }]
  }
}
