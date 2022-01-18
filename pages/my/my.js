// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    mainHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mainHeight: wx.getSystemInfoSync().windowHeight - app.globalData.navHeight - 10 +'px',
      windowHeight: wx.getSystemInfoSync().windowHeight + 'px'
    })
    console.log(' wx.cloud==>', wx)
    wx.cloud.callFunction({
      name: 'add',
      data: {
        a: 12,
        b: 19
      }
    }).then(res => {
      console.log('res ==> sum ==>', res);
      wx.showToast({
        title: res,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})