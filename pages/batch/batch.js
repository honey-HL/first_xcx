// pages/batch/batch.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    year: 2019,
    month: 2,
    month_arr: []
  },

  getCheckDate (event) {

    let status = event.currentTarget.dataset.item.status;
    let item = event.currentTarget.dataset.item;
    let date = item.date;

    if (item.gray) {
      return false
    }

    for (let row of this.data.month_arr.list) {
      for (let td of row) {
        if (date == td.date && !td.gray) {
          if (!td.checked) {
            td.checked = true;
          } else {
            td.checked = false;
          }
        }
      }
    }
    this.setData({
      month_arr: this.data.month_arr
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // year: options.full_year,
      // month: options.cur_month,
      month_arr: app.getTableData(2, 2019)
      // month_arr: app.getTableData(options.cur_month, options.full_year)
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