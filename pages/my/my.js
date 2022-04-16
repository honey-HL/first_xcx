// pages/my/my.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [],
    milestone: [],
    windowHeight: '',
    mainHeight:'',
    avatarUrl: ''
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },

  onTagsAdd() {
    wx.navigateTo({
      url: '../tags_add/tags_add'
    })
  },
  goMilestone () {
    wx.navigateTo({
      url: '../milestone/milestone'
    })
  },
  onTagsDelete () {
debugger
  },

  onClickTag (e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../tags_add/tags_add?clicked_tag='+JSON.stringify(item)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mainHeight: wx.getSystemInfoSync().windowHeight - app.globalData.navHeight - 10 +'px',
      windowHeight: wx.getSystemInfoSync().windowHeight + 'px'
    })
    this.getUserTags()
    this.getMilestone()
  },

  daysDistance(year,month,day) {     
    var date1 = new Date();
    var date2 = new Date(year,month,day);
    var date = (date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000);
    return Math.ceil(date)
  },

  getMilestone() {
    const days1 = this.daysDistance(2022,2,21);
    const days2 = this.daysDistance(2022,1,20);
    const milestone = [
      {
        name: '入职活跃网络',
        conj: '已经坚持了',
        start: '2022年3月21日',
        end:'',
        status: 'pending', // fulfilled
        days:days1,
      },
      {
        name: '婆在我们家🏠',
        conj: '已经住了',
        start: '2022年2月20日',
        end:'',
        status: 'pending', // fulfilled
        days: days2,
      }
    ]
    this.setData({milestone})
  },

  getUserTags () {
    const db = wx.cloud.database()
    db.collection('tag_list').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      // debugger
      this.setData({tags: res.data}, () => {
        console.log('this.data.tags==>',this.data.tags)
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
    this.getUserTags()
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