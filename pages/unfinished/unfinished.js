// pages/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'a','b','c'
    ], 
    old_cur:1,
    count:0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },




  Change (e) {
    console.log(e);
    let arr = this.data.imgUrls;
    let jian = this.data.count;
    let add = this.data.count;

    let current = e.detail.current;
    console.log('current', current);
    console.log('old_cur', this.data.old_cur);
    if (current < this.data.old_cur) { // 右滑  删除数组末尾元素  数组前面增加元素
      arr.splice(arr.length-1,1);
      jian = jian - 1;
      arr.unshift(jian);
      this.setData({
        ['count']: jian,
        ['imgUrls']:arr
      })
      console.log(this.data.imgUrls);
    } else if (current > this.data.old_cur) { // 左滑  删除数组前面元素   增加数组末尾元素
      arr.splice(0,1);
      add = add + 1;
      arr.push(add);
      this.setData({
        ['count']: add,
        ['imgUrls']: arr
      })
      console.log(this.data.imgUrls);
    }
    this.setData({
      old_cur: 1
    })
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '未完成'
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