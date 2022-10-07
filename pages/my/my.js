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
    willDeleteItem: {},
    modal: {
      show: false
    },
    cur_item: {},
    avatar: '',
    nickname: '暂无昵称',
    isLogin: false,
  },

  changeAvatar(){
    wx.chooseMedia({
      count: 1,
      mediaType:['image']
    }).then(res=>{
      // 把图片上传到云端
      wx.cloud.uploadFile({
          cloudPath: 'a' + Math.random() + '.jpg',
          filePath:res.tempFiles[0].tempFilePath
      }).then(uploadRes=>{
          console.log(uploadRes);
          let fileID = uploadRes.fileID;
          // 把图片与当前用户ID 绑定在一起, 存入云数据库
          const openid = getApp().globalData.openid;
          // 更新数据库中的头像路径
          let db = wx.cloud.database();
          db.collection('users').where({
            _openid : openid
          }).update({
            data:{
              avatar: fileID
            }
          }).then(updateRes=>{
            this.setData({
              avatar: fileID
            })
          })
      })
    })
  },

  /** 点击头像后的操作 */
  tapAvatar(){
    if(this.data.isLogin){   //已登录, 执行选择图片更换头像
      this.changeAvatar();
    } else {      //未登录, 则执行登录
    wx.getUserProfile({
        lang:"zh_CN",
        desc: '您的信息将用于登录小程序',
      }).then(res=>{
        console.log(res);
        // 通过openid查询云数据库, 验证是否已注册
        let db =  wx.cloud.database();
        const openid = wx.getStorageSync('openid');
        db.collection('users').where({
          _openid : openid
        }).get().then(queryRes=>{
          console.log(queryRes);
            if(queryRes.data.length != 0){ //已经注册过了
              this.setData({
                avatar:queryRes.data[0].avatar ,
                nickname: queryRes.data[0].nickname,
                isLogin:true
              })
            } else {  //没有注册过, 第一次登录, 则执行注册
            //  插入数据库
    　　     db.collection('users').add({
              data: {
                avatar:res.userInfo.avatarUrl,
                nickname:res.userInfo.nickName
              }
            })
            this.setData({
              avatar:res.userInfo.avatarUrl,
              nickname:res.userInfo.nickName,
              isLogin:true
            })
          }
        })
      })    
    }
  },

  onTagsAdd() {
    wx.navigateTo({
      url: '../tags_add/tags_add?isAddBtn='+JSON.stringify(1)
    })
  },
  onMilestoneAdd() {
    wx.navigateTo({
      url: '../milestone/milestone'
    })
  },
  goMilestone (e) {
    const data = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../milestone/milestone?data=' + JSON.stringify(data)
    })
  },

   /**
   * 打开弹框
   */
  showDelConfirmModal () {
    let objModal = {
      show: true,
      showCancel: true,
      cancelColor: '#fff',
      confirmColor: '#fff',
      title: '确定删除此里程碑?',
      content: [{text: '删除了就再也找不回来了～'}]
      // height: '70%',
      // confirmText: '我知道了'
    }
    this.setData({
      modal: objModal
    })
  },

   /**
   * 弹框按钮操作事件
   * @res 取消/确定按钮的相关信息
   */
  modalOperate (res) {
    if (res.detail.res == 'confirm') {
      this.sureToDelete()
      console.log('点确定')
    } else if (res.detail.res == 'cancel') {
      console.log('cancel')
    }
  },

  async sureToDelete() {
    const { willDeleteItem, milestone } = this.data;
    const _this = this;
    const db = wx.cloud.database();
    await db.collection('milestone_list').where({
      _openid: wx.getStorageSync('openid'),
      _id: willDeleteItem._id
    }).remove().then(res => {
     
      const newMilestone = milestone.filter(it => it._id !== willDeleteItem._id)
      // bus.emit('goDelete', {delItem: willDeleteItem})
      _this.setData({
        milestone: newMilestone
      })
    })
  },

  onDeleteMilestone (e) {
    const cur_item = e.currentTarget.dataset.item;
    this.showDelConfirmModal();
    this.setData({willDeleteItem: cur_item})
  },

  onTagsDelete () {
    wx.navigateTo({
      url: '../tags_add/tags_add?delete_tag=1'
    })
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
    this.getMilestoneList()
  },

  daysDistance(year,month,day, dateEnd) {     
    const isStr = typeof(dateEnd) === 'string'
    let d =  isStr? dateEnd.split('-'):dateEnd;
    let date1;
    if (!isStr) {
      date1 = dateEnd;
    } else {
      date1 = new Date(parseInt(d[0]),parseInt(d[1])-1,parseInt(d[2]));
    }
    const date2 = new Date(year,month-1,day);
    const date = (date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000);
    return isStr? Math.ceil(date) + 1 : Math.ceil(date);
  },

  getMilestoneList () {
    const _openid = wx.getStorageSync('openid')
    wx.cloud.callFunction({
      name: 'get_milestone_list',
      data: {
        filter: {
          _openid
        }
      }
    }).then((res) => {
      const { result } = res;
      const fulfilledData = result.filter(item => item.status === "fulfilled");
      const pendingData = result.filter(item => item.status === "pending");
      const resultData = pendingData.concat(fulfilledData);
      this.setData({ milestone: resultData })
    })
  },

  getUserTags () {
    const db = wx.cloud.database()
    db.collection('tag_list').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      
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
    this.getMilestoneList()
    this.getUserInfomation()
  },

  getUserInfomation () {
    let db =  wx.cloud.database();
    const openid = wx.getStorageSync('openid');
    db.collection('users').where({
        _openid : openid
    }).get().then(queryRes=>{
      console.log(queryRes);
      if(queryRes.data.length != 0){ //已经注册过了
        this.setData({
          avatar:queryRes.data[0].avatar ,
          nickname: queryRes.data[0].nickname,
          isLogin:true
        })
      }
    })
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