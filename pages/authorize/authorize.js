// pages/authorize/authorize.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight + 'px'
    })
    // 当code获取到后 就可以直接跳转到你的小程序主页了 我的小程序主页是pages下的index
    if (app.globalData.userInfo.code) {
      
      // wx.switchTab({
      //     url: '../calendar/calendar'
      // })
    } else {
      wx.switchTab({
        url: '../calendar/calendar'
      })
    }
  },

  getUserInfo(res) {
    app.globalData.userInfo = res.detail.userInfo;
    app.globalData.userInfo.iv = res.detail.iv;
    app.globalData.userInfo.encryptedData = res.detail.encryptedData;
    app.globalData.userInfo.signature = res.detail.signature;
    app.globalData.userInfo.code = app.globalData.code;
    // 把获取的用户信息放在本地缓存中
    wx.setStorageSync('user', JSON.stringify(app.globalData.userInfo));
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