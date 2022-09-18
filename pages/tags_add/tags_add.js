
const app = getApp()
const {bus} = require('../../utils/bus.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: {
      show: false
    },
    is_add: false, // 是否是添加标签
    is_delete: false, // 是否是删除标签
    tags: '', // 所以标签
    cur_edit_tag: '', // 当前编辑的tag
    title: '添加打卡标签',
    dakaDaseNum: 0,
    needCalDaka: 0,
    count_daka_opt: [
      {name: '是', value: '1', checked: false},
      {name: '否', value: '0', checked: true},
    ],
    daka_count_type: [
      {name: 'year', value: '按年累计', checked: true},
      {name: 'month', value: '按月累计', checked: false},
      {name: 'week', value: '周累计', checked: false},
    ],
    mainHeight:'',
    windowHeight:"",
    palette:["#add8e6", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "#ffbb00",
				"rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)",
				"rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)", "rgb(230, 184, 175)", "rgb(244, 204, 204)",
				"rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)",
				"rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)",
        "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)"],
    tagColor: '',
    tagValue: '',
    tagDelIds: [],
  },

   /**
   * 弹框按钮操作事件
   * @res 取消/确定按钮的相关信息
   */
  modalOperate (res) {
    if (res.detail.res == 'confirm') {
      this.handleTagDele()
    } else if (res.detail.res == 'cancel') {
      console.log('cancel')
    }
  },

     /**
   * 打开弹框
   */
  showDelConfirmModal (cur_item) {
    let objModal = {
      show: true,
      showCancel: true,
      cancelColor: '#fff',
      confirmColor: '#fff',
      title: '确定删除此标签?',
      content: [{text: '删除了就再也找不回来了～'}]
    }
    this.setData({
      willDeleteItem: cur_item,
      modal: objModal
    })
  },

  onTagsDelete (e) {
    const cur_item = e.currentTarget.dataset.item;
    this.showDelConfirmModal(cur_item);
  },

  handleTagDele () {
    const {willDeleteItem} = this.data;
    const id = willDeleteItem._id;
    const db = wx.cloud.database()
    db.collection('tag_list').where({
      _openid: wx.getStorageSync('openid'),
      _id: id
    }).remove().then(() => {
      wx.navigateBack({
        delta: 2
      })
    })
  },

  getUserTags () {
    const db = wx.cloud.database()
    db.collection('tag_list').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      const arr = res.data.map(item => {
        return {
          ...item,
          clicked: false
        }
      })
      this.setData({tags: arr}, () => {
        console.log('this.data.tags==>',this.data.tags)
      })
    })
  },

  radioChange (event) {
   this.setData({needCalDaka: event.detail.value})
  },

  bindBaseInput (e) {
    this.setData({dakaDaseNum: e.detail.value})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {delete_tag, clicked_tag, isAddBtn} = options;
    const {count_daka_opt, title} = this.data;
    const cur_edit_tag = clicked_tag && JSON.parse(clicked_tag);
    const is_add_btn = isAddBtn && JSON.parse(isAddBtn)
    let _count_daka_opt = [];
    let currentTitle = '';
    if (cur_edit_tag) {// 编辑
      currentTitle = '编辑打卡标签';
      this.getUserTags()
      _count_daka_opt = count_daka_opt.map(item => {
        return {
          ...item,
          checked: cur_edit_tag.needCalDaka && item.name === '是' ?
                  true: item.name === '否'? true: false
        }
      })
    } else if (delete_tag && parseInt(delete_tag) === 1) {// 删除
      currentTitle = '删除已有标签'
      this.getUserTags()
      this.setData({ 
        is_delete: true
      })
    } else { // 添加
      _count_daka_opt = count_daka_opt
      currentTitle = title;
    }
    this.setData({
      is_add: is_add_btn,
      cur_edit_tag,
      title: currentTitle,
      count_daka_opt: _count_daka_opt,
      dakaDaseNum: cur_edit_tag ?cur_edit_tag.dakaDaseNum:'',
      needCalDaka: cur_edit_tag ? cur_edit_tag.needCalDaka:'',
      tagValue: cur_edit_tag ? cur_edit_tag.tag_value: '',
      tagColor: cur_edit_tag ? cur_edit_tag.tag_color:this.data.palette[0],
      mainHeight: wx.getSystemInfoSync().windowHeight - app.globalData.navHeight - 10 - 85 - 20 +'px',
      windowHeight: wx.getSystemInfoSync().windowHeight + 'px'
    })
    // Colorpicker.create({
    //   el: "color-picker", //元素id
    //   color: "#000fff", //默认颜色
    //   change: function (elem, hex) {
    //     //选中颜色发生改变时事件
    //     elem.style.backgroundColor = hex;
    //   }
    //   })
  },
  saveItem() {
    const { tagColor, cur_edit_tag, dakaDaseNum,needCalDaka, tagValue} = this.data;
    const obj = {
      tag_color: tagColor, 
      needCalDaka: needCalDaka,
      tag_value: tagValue
    }
    if (needCalDaka == 1) {
      obj.dakaDaseNum = dakaDaseNum;
    } else {
      obj.dakaDaseNum && delete obj.dakaDaseNum;
      obj.needCalDaka && delete obj.needCalDaka;
    }
    // this.handleTagDele()
    const db = wx.cloud.database()
    if (cur_edit_tag) { // 编辑标签
       // 如果tag_color或者tag_value有任意一个发生了改变就要去更新record list中对应tag的这2个字段
      if ((obj.tag_color !== cur_edit_tag.tag_color) || (obj.tag_value !== cur_edit_tag.tag_value)) {
        bus.emit('onUpdateTag', {_openid:cur_edit_tag._openid, tag_id: cur_edit_tag._id, ...obj})
      }
      db.collection('tag_list').where({
        _openid: wx.getStorageSync('openid'),
        _id: cur_edit_tag._id
      })
      .update({
        data:{
          ...obj
        },
        success:() => {
          wx.navigateBack({
            delta: 2
          })
        }
      })
    } else {
      db.collection('tag_list').add({
        data: obj,
        success: res => {
          wx.navigateBack({
            delta: 2
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      tagValue: e.detail.value
    })
  },
  changeColor (eve) {
    const color = eve.currentTarget.dataset.color;
    this.setData({
      tagColor: color
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