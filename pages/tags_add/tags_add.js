// pages/tags_add/tags_add.js
// var Colorpicker = require('../../utils/colorpicker').Colorpicker
// debugger
const app = getApp()
const {bus} = require('../../utils/bus.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  onTagsDelete (e) {
    const cur_item = e.currentTarget.dataset.item;
    const {tags} = this.data;
    const _tags = tags.filter(tag => tag._id !== cur_item._id)
    let tagDelIds = [];
    tagDelIds.push(cur_item._id)
    this.setData({tags: _tags, tagDelIds})
  },

  handleTagDele () {
    const {tagDelIds} = this.data;
    const db = wx.cloud.database()
    tagDelIds.forEach(id => {
      db.collection('tag_list').where({
        _openid: wx.getStorageSync('openid'),
        _id: id
      }).remove()
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
    const {clicked_tag} = options;
    const {count_daka_opt, title} = this.data;
    const cur_edit_tag = clicked_tag && JSON.parse(clicked_tag);

    this.getUserTags()
    
    const _count_daka_opt = count_daka_opt.map(item => {
      if (cur_edit_tag && cur_edit_tag.needCalDaka == 1) {
        if (item.name === '是') {
          return {
            ...item,
            checked: true
          }
        } else {
          return {
            ...item,
            checked: false
          }
        }
      } else {
        if (item.name === '否') {
          return {
            ...item,
            checked: true
          }
        } else {
          return {
            ...item,
            checked: false
          }
        }
      }
    })
    // debugger
    this.setData({
      cur_edit_tag,
      title: !cur_edit_tag? title: '编辑打卡标签',
      count_daka_opt: _count_daka_opt,
      dakaDaseNum: cur_edit_tag ?cur_edit_tag.dakaDaseNum:'',
      needCalDaka: cur_edit_tag ? cur_edit_tag.needCalDaka:'',
      tagValue: cur_edit_tag ? cur_edit_tag.tag_value: '',
      tagColor: cur_edit_tag ? cur_edit_tag.tag_color:this.data.palette[0],
      mainHeight: wx.getSystemInfoSync().windowHeight - app.globalData.navHeight - 10 - 145+'px',
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
    }
    this.handleTagDele()
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
          console.log('add success res ==>',res)
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
    // debugger
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