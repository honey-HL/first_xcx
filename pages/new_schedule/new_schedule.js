// pages/publish/publish.js
const app = getApp()
const date = new Date()
const {bus} = require('../../utils/bus.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeData: {},
    id: '',
    is_edit: false,
    operation_type: '',
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    year: 2019,
    month: 2,
    month_arr: [],
    items: [
      {name: '0', value: '未完成', checked: false},
      {name: '1', value: '已完成', checked: true},
    ],
    checked_type: 1,
    is_range: false,
    today: date.getDate(),
    location: '所在位置',
    show_end_time: false,
    is_touch_trash: false,
    show_mask: app.globalData.show_mask,
    pictures: app.globalData.pictures_arr,
    cost: '',
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
    end: {
      minutes: [],
      hours: [],
      monthArr: [1, 2,3,4,5,6,7,8,9,10,11,12],
      datesArr: [],
      full_year: date.getFullYear(),
      cur_month: date.getMonth() + 1,
      cur_date: date.getDate(),
      hour: date.getHours() + 1,
      minute: '00'
    },
    clicked_start: false,
    clicked_end: false,
    src_1: '',
    picker_height: 0,
    picker_value_start: [date.getMonth(), date.getDate() - 1, date.getHours(), 0],
    picker_value_end: [date.getMonth(), date.getDate() - 1, date.getHours() + 1, 0],
    evaContent: ''
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

  checkeForBatch () {
    for (let row of this.data.month_arr.list) {
      for (let td of row) {
        if (this.data.start.cur_date == td.date && !td.gray) {
          td.checked = true;
        }
      }
    }
    this.setData({
      month_arr: this.data.month_arr
    })
  },

  bindKeyInput: function (e) {
  　let cost = e.detail.value;
    console.log('cost ',cost);
　　this.setData({
　　　　cost: cost
　　})
  },

  charChange (e) {
    console.log(e.detail.value)
    this.setData({
      evaContent: e.detail.value
    })
  },

  saveItem () {
    const {activeData} = this.data;
    let start_time = this.data.start.full_year +'-'+ (this.data.start.cur_month >= 10 ?this.data.start.cur_month:'0'+this.data.start.cur_month) + '-' + (this.data.start.cur_date>=10?this.data.start.cur_date:'0'+this.data.start.cur_date) + ' '+this.data.start.hour + ':' + this.data.start.minute;
    let end_time = this.data.end.full_year +'-'+ (this.data.end.cur_month >= 10 ?this.data.end.cur_month:'0'+this.data.end.cur_month) + '-' + (this.data.end.cur_date>=10?this.data.end.cur_date:'0'+this.data.end.cur_date) + ' '+this.data.end.hour + ':' + this.data.end.minute;
    let start_riqi = activeData.sYear +'-'+ (activeData.sMonth >= 10 ?activeData.sMonth:'0'+activeData.sMonth) + '-' + (activeData.sDay>=10?activeData.sDay:'0'+activeData.sDay);
    let obj = {};
    console.log('this.data.operation_type==>',this.data.operation_type)
    if (this.data.operation_type != 4) {
      obj = {
        schedule_type: this.data.checked_type,
        is_range: this.data.is_range,
        location: this.data.location,
        startTime: start_time,
        endTime: end_time,
        content: this.data.evaContent,
        month: activeData.sMonth,
        date: start_riqi,
        create_time: new Date().getTime(),
        _open_id: wx.getStorageSync('openid'),
        event_type: 'schedule'// this.data.operation_type
      }
      var that = this;

      let url = 'http://taili-xcx.com/api/events/'
      let back_url = ''
      if (this.data.is_edit) {
        // 编辑操作
        obj.id = this.data.id;
        url = url + 'update'
        back_url = '../schedule/schedule'
      } else { // 增加操作
        url = url + 'add'
        // back_url = '../calendar/calendar'
        back_url = '../schedule/schedule'
      }
      console.log('wx', wx);

      console.log('obj==>',obj)

      const openid = wx.getStorageSync('openid')

      console.log('openid==>',openid);
      // wx.switchTab({
      //   url: '../schedule/schedule'
      // })

      const db = wx.cloud.database()
      db.collection('todo_list').add({
        data: obj,
        success: res => {
          console.log('add success res ==>',res)
          // debugger
          // // 在返回结果中会包含新创建的记录的 _id
          // this.setData({
          //   counterId: res._id,
          //   count: 1
          // })
          // wx.showToast({
          //   title: '新增记录成功',
          // })
          wx.switchTab({
            url: '../calendar/calendar'
            // url: '../schedule/schedule'
          })
          // 更新表格的数据
          bus.emit('onUpdate', {_id: res._id, activeData})
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
      //获取汇率
      // let _this = this
      // wx.request( {
      //   url: url,
      //   headder: {
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   method: "post", 
      //   data: obj,
      //   success: function( res ) {
      //     if (res.data.status == 200) {
      //       if (_this.data.is_edit) {
      //         wx.showToast({
      //             title: '编辑成功',
      //             icon: 'none',
      //             duration: 1000,
      //             mask:true
      //         })
      //         setTimeout(function(){
      //           wx.switchTab({
      //             url: back_url
      //           })
      //         }, 500);
      //       } else {
              // wx.switchTab({
              //   url: back_url
              // })
      //       }
      //     }
      //   }
      // })
    } else { // 如果选的是批量操作
      this.batch_addition()
    }
  },

  batch_addition () {
    let obj = []
    for (let row of this.data.month_arr.list) {
      for (let item of row) {
        if (item.checked) {
          obj.push({
            type: 2,
            start_time: this.data.start.hour + ':' + this.data.start.minute,
            end_time: this.data.end.hour + ':' + this.data.end.minute,
            location: this.data.location,
            content: this.data.evaContent,
            date: item.year + '-' + (item.month>10?item.month:'0'+item.month) + '-' + (item.date>10?item.date:'0'+item.date)
          })
        }
      }
    }
    console.log(obj);
    wx.request( {
      url: "http://taili-xcx.com/api/events/batch_addition",
      headder: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post", 
      data: {list: obj},
      success: function( res ) {
        if (res.data.status == 200) {
          wx.switchTab({
            url: '../calendar/calendar'
          })
        }
      }
    })
  },

  switchStartBox (e) {
    let type = e.currentTarget.dataset.type;
    if (type == 0) {
      if (!this.data.clicked_start) {
        this.setData({
          clicked_end: false,
          clicked_start: true
        })
      } else {
        this.setData({
          clicked_start: false
        })
      }
    } else if (type == 1) {
      if (!this.data.clicked_end) {
        this.setData({
          clicked_start: false,
          clicked_end: true
        })
      } else {
        this.setData({
          clicked_end: false
        })
      }
    }
  },

  radioChange(e) { // 0 护肤品  1 衣物   2 日程
    this.setData({
      checked_type: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  switch1Change (e) {
    this.setData({
      is_range: e.detail.value
    })
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },

  getMonthDatesInit () {
    console.log(date);
    let arr = []
    let days = ''
    let cur_year = date.getFullYear();
    let cur_month = date.getMonth() + 1;
    if (cur_month == 1 || cur_month == 3 || cur_month == 5 || cur_month == 7 || cur_month == 8 || cur_month == 10 || cur_month == 12) {
      days = 31;
    } else if (cur_month == 2) {
      if (((cur_year % 4) == 0) && ((cur_year % 100) != 0) || ((cur_year % 400) == 0)) { // 闰年二月29天，平年2月28天
        days = 29;
      } else {
        days = 28;
      }
    } else if (cur_month == 4 || cur_month == 6 || cur_month == 9 || cur_month == 11) {
      days = 30;
    }
    for (let i = 1; i <= days; i++) {
      arr.push(i)
    }
    let date_2 = 'picker_value_start[' + 1 + "]";
    let date_3 = 'picker_value_end[' + 1 + "]";
    this.setData({
      [date_2]: date.getDate() - 1,
      ['start.datesArr']: arr,
      [date_3]: date.getDate() - 1,
      ['end.datesArr']: arr
    })
  },

  bindChange(e) {
    let type = e.currentTarget.dataset.type;
    const val = e.detail.value
    console.log(val)
    if (type == 0) {
      this.setData({
        ['start.cur_month']: this.data.start.monthArr[val[0]],
        ['start.cur_date']: this.data.start.datesArr[val[1]],
        ['start.hour']: this.data.start.hours[val[2]],
        ['start.minute']: this.data.start.minutes[val[3]]
      })
    } else if (type == 1) {
      if (this.data.end.monthArr[val[0]] > date.getMonth() + 1) {
        this.setData({
          show_end_time: true
        })
      } else {
        if (this.data.end.datesArr[val[1]] > this.data.today) {
          this.setData({
            show_end_time: true
          })
        } else {
          this.setData({
            show_end_time: false
          })
        }
      }
      if (this.data.end.hours[val[2]] >= date.getHours()) {
        this.setData({
          ['end.hour']: this.data.end.hours[val[2]]
        })
      } else {
        this.setData({
          ['end.hour']: date.getHours()
        })
      }
      this.setData({
        ['end.cur_month']: this.data.end.monthArr[val[0]],
        ['end.cur_date']: this.data.end.datesArr[val[1]],
        ['end.minute']: this.data.end.minutes[val[3]]
      })
    }
  },

  addAnotherPhoto () {
    wx.navigateTo({
      url: '../create/create'
    })
  },

  getLocationAuth () {
      let that = this;
      wx.getSetting({
      success(res) {
        // debugger
        if (res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              // const ctx = wx.createCameraContext()
              // ctx.takePhoto({
              //   quality: 'high',
              //   success: (res) => {
              //   }
              // })
              // debugger
              wx.chooseLocation({
                type: 'wgs84',
                success(res) {
                  console.log(res);
                  that.setData({
                    location: res.name
                  })
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                }
              })
            }
          })
        }
      }
    })
  },
  getLocation () {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
    })
  },

  switchMask () {
    app.globalData.show_mask = false
    this.setData({
      show_mask: app.globalData.show_mask
    })
  },

  moveToTrash () {
    app.globalData.pictures_arr.length = 0;
    app.globalData.show_mask = false
    this.setData({
      is_touch_trash: true,
      show_mask: app.globalData.show_mask
    })
    wx.switchTab({
      url: '../calendar/calendar'
    })
  },

  getHourMinuteInit () {
    let arr = []
    let minutes_arr = []
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        arr[i] = '0' + i
      }
      arr.push(i)
    }
    arr.splice(10,1)
    for (let i = 0 ; i <= 55; i++) {
      if (i % 5 === 0) {
        if (i < 10) {
          minutes_arr.push('0' + i)
        } else {
          minutes_arr.push(i)
        }
      }
    }
    this.setData({
      ['start.minutes']: minutes_arr,
      ['start.hours']: arr,
      ['end.minutes']: minutes_arr,
      ['end.hours']: arr
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const activeData = JSON.parse(options.activeData)
    // debugger
    let start_month_index = 'picker_value_start[' + 0 + "]";
    let end_month_index = 'picker_value_end[' + 0 + "]";
    let start_date_index = 'picker_value_start[' + 1 + "]";
    let end_date_index = 'picker_value_end[' + 1 + "]";
    let start_hour_index = 'picker_value_start[' + 2 + "]";
    let end_hour_index = 'picker_value_end[' + 2 + "]";
    let start_minute_index = 'picker_value_start[' + 3 + "]";
    let end_minute_index = 'picker_value_end[' + 3 + "]";
    this.setData({
      year: activeData.sYear,
      month: activeData.sMonth,
      activeData,
      // month_arr: app.getTableData(2, 2019),
      // month_arr: app.getCalTableData(options.cur_month, options.full_year),
      ['start.cur_month']: activeData.sMonth,
      ['start.cur_date']: activeData.sDay,
      ['end.cur_month']:activeData.sMonth,
      ['end.cur_date']: activeData.sDay,
    })

    if (options.type) {
      this.setData({
        operation_type:options.type,
      })
      if (options.type == 4) { // 进入此页面的操作类型
        this.data.items[2].checked = true;
        this.setData({
          items: this.data.items
        })
        this.checkeForBatch();
      }
    }

    this.getMonthDatesInit()
    this.getHourMinuteInit()

    if (options.data_type) { // data_type存在 当前是  修改   操作
      let start_time = options.start_time.split(':');
      let end_time = options.end_time.split(':');
      let start_hour = start_time[0];
      let end_hour = end_time[0];
      let start_minute = start_time[1];
      let end_minute = end_time[1];
      for (let i in this.data.items) {
        if (i == options.data_type) {
          this.data.items[i].checked = true
        }
      }
      let minutes = this.data.start.minutes
      for (let i in minutes) {
        if (minutes[i] == start_minute) {
          this.setData({
            [start_minute_index]: i
          })
        }
        if (minutes[i] == end_minute) {
          this.setData({
            [end_minute_index]: i
          })
        }
      }
      this.setData({
        id: options.id,
        [start_month_index]: options.cur_month - 1,
        [start_date_index]: parseInt(options.cur_date - 1),
        [end_month_index]: options.cur_month - 1,
        [end_date_index]: parseInt(options.cur_date - 1),
        [start_hour_index]: parseInt(start_hour),
        [end_hour_index]: parseInt(end_hour),
        ['start.hour']: start_hour,
        ['end.hour']: end_hour,
        ['start.minute']: start_minute,
        ['end.minute']: end_minute,
        checked_type: options.data_type,
        evaContent: options.content,
        is_edit: true,
        cost: parseInt(options.cost),
        items: this.data.items
      })
    } else { // 不是修改操作
      console.log(this.data.picker_value_start);
      this.setData({
        [start_month_index]: options.cur_month - 1,
        [start_date_index]: options.cur_date - 1,
        [end_month_index]: options.cur_month - 1,
        [end_date_index]: options.cur_date - 1,
        [start_hour_index]: date.getHours(),
        [end_hour_index]: date.getHours() + 1,
        pictures: app.globalData.pictures_arr
      })
      console.log(this.data.pictures);
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
  onUnload: function (options) {
    app.globalData.pictures_arr.length = 0;
    this.backLastPage()
  },

  backLastPage () {
    if (this.data.is_edit) {
      wx.switchTab({
        url: '../schedule/schedule'
      })
    } else {
      wx.switchTab({
        url: '../calendar/calendar'
      })
    }
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