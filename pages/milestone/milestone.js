// pages/milestone/milestone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    formData: {
      name: '入职活跃网络',
      conj: '已经坚持了',
      start: '2022年3月21日',
      end:'',
      status: 'pending', // fulfilled
      days: 12,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  confirmMileTitle (e) {
    debugger
  },

  bindKeyInput: function (e) {
    const val = e.detail.value
    console.log('val====>',val)
    this.setData({
      ...formData,
      name: val
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