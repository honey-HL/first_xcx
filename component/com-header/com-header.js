// component/com-header.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title:  {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    navTop: app.globalData.navTop, //导航栏距顶部距离
    navHeight: app.globalData.navHeight + 10, //导航栏高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack () {
      // wx.switchTab({
      //   url: '../calendar/calendar'
      // })
      var pages = getCurrentPages();
      var beforePage = pages[pages.length - 2];
      beforePage.onLoad(beforePage.options);
      wx.navigateBack({
         delta: 1,
      })      
    }
  }
})
