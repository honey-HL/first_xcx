const {bus} = require('../../utils/bus.js');
const util = require('../../utils/util.js');
const date = new Date();
const db = wx.cloud.database;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPickerShow: false,
    // pickerStartArr: [2022,3,21, '15',1],
    // pickerStart: {
    //   type: "edit",
    // },
    windowHeight:'',
    statusItems: [
      {value: 'pending', name: '进行中', checked: true},
      {value: 'fulfilled', name: '已完成', checked: false},
    ],
    showIndexItems:  [
      {value: '1', name: '是', checked: true},
      {value: '0', name: '否', checked: false},
    ],
    start: {
      minutes: [],
      hours: [],
      monthArr: [1, 2,3,4,5,6,7,8,9,10,11,12],
      datesArr: [],
      full_year: date.getFullYear(),
      cur_month: date.getMonth() + 1,
      cur_date: date.getDate(),
      hour: date.getHours(),
      minute: '00'
    },
    formData: {
      name: '',
      conj: '已经坚持了',
      start: {},
      end:'',
      status: 'pending', // fulfilled 
      days: 0,
      isDisplayOnHome: '1'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { statusItems, formData, showIndexItems } = this.data;
    let optionData;
    if (options.data) {
      optionData = JSON.parse(options.data);
    } else {
      optionData = {
        ...formData,
        start: util.getInitialPicker()
      }
    }
    const newStatusItems = statusItems.map(item => {
      return {
        ...item,
        checked: item.value === optionData.status ? true: false
      };
    })
    const newShowIndexItems = showIndexItems.map(item => {
      return {
        ...item,
        checked: item.value === optionData.isDisplayOnHome ? true: false
      };
    })
    this.setData({
      showIndexItems: newShowIndexItems,
      statusItems: newStatusItems,
      isPickerShow: true,
      formData: optionData,
      windowHeight: wx.getSystemInfoSync().windowHeight
    }, () => {
      console.log(this.data)
    })
    bus.on('onGetPicker',(param) => {
      this.onStartEndDayChange (param);
      // const { picker, pickerType } = param;
      // if (pickerType === 'start') {
      //   this.setData({
      //     formData: {
      //       ...this.data.formData,
      //       start: picker
      //     }
      //   })
      // } else {
      //   this.setData({
      //     formData: {
      //       ...this.data.formData,
      //       end: picker
      //     }
      //   })
      // }
    })
  },

  onStartEndDayChange (param) {
    const { picker, pickerType } = param;
    const { formData } = this.data;
    if (pickerType === 'start') {
      const days = util.daysDistance(picker, formData.end);
      this.setData({
        formData: {
          ...formData,
          start: picker,
          days: days || 0
        }
      })
    } else {
      const days = util.daysDistance(formData.start, picker);
      this.setData({
        formData: {
          ...formData,
          end: picker,
          days: days || 0
        }
      })
    }
  },

  onGetPicker (picker) {
    console.log('onGetPicker==>')
  },

  confirmMileTitle (e) {
    console.log('confirmMileTitle==>')
  },

  radioChange (e) {
    const status = e.detail.value;
    const { formData } = this.data;
    this.setData({
      formData: {
        ...formData,
        end: status === 'fulfilled' && !formData.end? util.getInitialPicker() : formData.end,
        status,
      } 
    })
  },

  showIndexRadioChange (e) {
    const value = e.detail.value;
    this.setData({
      formData: {
        ...this.data.formData,
        isDisplayOnHome: value
      } 
    })
  },

  bindKeyInput: function (e) {
    const val = e.detail.value
    let _formData = Object.assign({},  this.data.formData)
    _formData.name = val;
    this.setData({
      formData: _formData
    })
  },

  bindConjKeyInput: function (e) {
    const val = e.detail.value
    let _formData = Object.assign({},  this.data.formData)
    _formData.conj = val;
    this.setData({
      formData: _formData
    })
  },
 
  onSave: function () {
    const db = wx.cloud.database();
    const dataObj = {
      ...this.data.formData,
      create_time: new Date().getTime(),
    }
    const { formData } = this.data;
    if (formData._id) { // 更新
      delete dataObj._openid;
      delete dataObj._id;
      delete dataObj.create_time
      db.collection('milestone_list').where({
        _openid: wx.getStorageSync('openid'),
        _id: formData._id
      }).update({
        data: dataObj,
        success: () => {
          wx.showToast({
            icon: 'none',
            title: '里程碑更新成功'
          })
          wx.switchTab({
            url: '../my/my'
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '里程碑更新失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    } else { // 新增
      db.collection('milestone_list').add({
        data: dataObj,
        success: res => {
          wx.showToast({
            icon: 'none',
            title: '里程碑新增成功'
          })
          wx.switchTab({
            url: '../my/my'
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '里程碑新增失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
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