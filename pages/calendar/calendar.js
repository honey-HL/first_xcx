//index.js
//获取应用实例
const app = getApp()
const date = new Date()
var lunar = require('../../utils/lunar.js')
var days = require('../../utils/calculate_days.js')

Page({
  data: {
    clickedRowIndex: '',
    isShrink: false,
    calWidth: '',
    calHeight:'',
    calPosition: '',
    calTop:'',
    navHeight: app.globalData.navHeight + 80, //导航栏高度
    navTop: app.globalData.navTop, //导航栏距顶部距离
    navObj: app.globalData.navObj, //胶囊的高度
    navObjWid: app.globalData.ƒ, //胶囊宽度+距右距离
    swiper_month_arr: [{name: 'name1'},{name: 'name2'},{name: 'name3'}],
    swiperCurrent: 1,
    curMonthIndex: 1,
    choose_date_dt: [],
    payments: [{name: '支出', type: 'expend',clicked: true}, {name: '收入', type: 'earnings', clicked: false},],
    checked_payments: 'expend',
    show_date_popup: false,
    input_numbers: [1,2,3,4,5,6,7,8,9],
    clicked_num: '',
    chooseSize: false,
    showOperation: true,
    zhou_ji: '',
    batch_text: '批量',
    show_checkobx: false,
    slide_up1: {},
    slide_up2: {},
    slide_up3: {},
    calendar_x_animation: {},
    batch_add_animation: {},
    new_schedule_animation:{},
    select_pictures_animation: {},
    photo_video_animation: {},
    x: 0,
    y: 0,
    min_height: '',
    hasuserinfo: '',
    windowWidth: '',
    windowHeight:'',
    is_show_new_mask: false,
    sticky_tr: true,
    is_sticky: true,
    show_jin: false,
    touchDotX: 0,//X按下时坐标
    touchDotY: 0,//y按下时坐标
    interval: '',//计时器
    time:0,//从按下到松开共多少时间*100
    confirmColor:"#f4be51",
    is_show_picker: false,
    year_show: false,
    color:'red',
    tb_arr: [], 
    test_obj: {},
    months_arr: [],
    month_arr: [],
    year_arr:[],
    monthArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    cur_month_days: [],
    is_month_list_show: 'none',
    is_year_list_show: 'none',
    a_margin: '',
    full_year: date.getFullYear(),
    cur_month: date.getMonth() + 1,
    cur_index: 1,
    cur_date: date.getDate(),
    today: date.getDate(),
    today_month: date.getMonth() + 1,
    today_year: date.getFullYear(),
    value: [150-(2050 - date.getFullYear()), date.getMonth(), 0],
    weeks: [ '日', '一', '二', '三', '四', '五', '六'],
    motto: 'Hello World',
    userInfo: {},
    count: 0,
    hasUserInfo: false,
    lunar_arr: '',
    animation: '',
    itemList: [],
    avatarUrl: '',
    nickName: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onPageScroll: function (e) {
    debugger
    let _this = this
    wx.createSelectorQuery().select('#index').boundingClientRect(function (rect) {
      const scrollTop = e.scrollTop
      const offsetHeight = e.offsetHeight
      console.log('scrollTop===>',scrollTop, '   offsetHeight=====>',offsetHeight)
        // if (e.scrollTop >= rect.height - 555) {
        //     //已离底部一段距离，下面处理操作
        // }
    }).exec()
  },

  goLastMonth (current) {
    let _month;
    let _year;
    let show_jin;
    const {full_year, cur_month,curMonthIndex} = this.data;
    if (cur_month == 1) {
      _month = 12
      _year = full_year - 1 
    } else {
      _month = cur_month - 1 
      _year = full_year
    }
    let _curMonthIndex = curMonthIndex + 1;
    if (_month === date.getMonth() + 1 && _year === date.getFullYear()) {
      show_jin = false  
    } else {
      show_jin = true
    }
    const arr = app.getTableData(_year, _month, 'last')
    console.log('_curMonthIndex=========+>',_curMonthIndex)
    this.setData({show_jin, months_arr: arr,full_year:_year, cur_month: _month, swiperCurrent: current +1, curMonthIndex: _curMonthIndex})
    wx.setNavigationBarTitle({
      title: _year + '年' + _month + '月'
    })
  },

  goNextMonth (current) {
    let _month;let _year;let show_jin;
    const {full_year, cur_month,curMonthIndex, swiperCurrent} = this.data;
    if (cur_month == 12) {
      _month = 1
      _year  = full_year + 1
    } else {
      _month = cur_month + 1
      _year = full_year
    }
    if (_month === date.getMonth() + 1 && _year === date.getFullYear()) {
      show_jin = false  
    } else {
      show_jin = true
    }
    const arr = app.getTableData(_year, _month, 'next')
    this.setData({show_jin, months_arr: arr,full_year:_year, cur_month: _month, swiperCurrent: current})
    wx.setNavigationBarTitle({
      title: _year + '年' + _month + '月'
    })
  },

  swiperChange(e) {
    let _month;
    let _year;
    const {full_year, cur_month,curMonthIndex, swiperCurrent} = this.data;
    const {monthsObj} = app.globalData;
    console.log('84-----monthsObj--',monthsObj)
    
    const {current, source} = e.detail
   
    if(source === 'autoplay' || source === 'touch') {
      //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
      if (current < swiperCurrent) { // 右滑 获取上一个月数据
        console.log('右滑')
        this.goLastMonth(current)
      }
      if (current > swiperCurrent) { // 左滑 获取下一个月数据
        console.log('左滑')
        this.goNextMonth(current)
      }
      // if (_month === date.getMonth() + 1 && _year === date.getFullYear()) {
      //   this.setData({ show_jin: false })   
      // } else {
      //   this.setData({ show_jin: true })   
      // }
      // wx.setNavigationBarTitle({
      //   title: _year + '年' + _month + '月'
      // })
    }
  },

  // 今 返回今天
  backToday () {
    const {swiperCurrent, curMonthIndex} = this.data;
    const cur_month= date.getMonth() + 1 
    const full_year= date.getFullYear()

    this.setData({
      full_year, 
      cur_month, 
      swiperCurrent: curMonthIndex,
      show_jin: false,
      today: this.data.cur_date,
      today_month: cur_month,
      today_year: full_year
    })
   
    wx.setNavigationBarTitle({
      title: this.data.full_year + '年' + this.data.cur_month + '月'
    }) 
    let nian_yue_ri = this.data.full_year + '-' + (this.data.cur_month >= 10 ?this.data.cur_month:'0'+this.data.cur_month) + '-' + (this.data.cur_date>10?this.data.cur_date:'0'+this.data.cur_date);
    this.searchSchedule(nian_yue_ri);
  },

  touchCalBoxStart(e) {
    this.setData({
      touchDotX: e.touches[0].pageX, // 获取触摸时的原点
      touchDotY: e.touches[0].pageY
    })
    // 使用js计时器记录时间    
    this.data.interval = setInterval(() => {
      this.setData({
        time: this.data.time++
      })
    }, 100);
  },
  touchCalBoxEnd (e) {
    console.log(e)
    const {time, windowHeight} = this.data
    const {offsetTop} = e.currentTarget;
    const ele = wx.createSelectorQuery().select('#index');
    let calBtmHeight =`${(parseInt(windowHeight) - 127 - 65)}px`

    console.log('offsetTop===>',offsetTop)
    console.log('ele===>',ele)


    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - this.data.touchDotX;
    let tmY = touchMoveY - this.data.touchDotY;

    console.log('touchMoveY===>',touchMoveY)

    // debugger
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        console.log('滑动e',e)
      }
      if (absY > absX * 2 && tmY<0) { // up and down
        console.log(' up and down',e)
        // ele.style.position = 'fixed'
        // debugger
        this.setData({ // 
          calWidth: '96%',
          calHeight:'65px',
          calPosition: 'fixed',
          calTop:'125px',
          calBtmHeight,
          isShrink: true
        })
      } else { // pull
        this.setData({
          isShrink: false,
          calWidth: '',
          calHeight:'',
          calPosition: '',
          calTop:'',
          calBtmHeight: '320px'
        })
      }
    }
    clearInterval(this.data.interval); // 清除setInterval
    this.setData({
      time: 0
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showYearList() {
    let that = this
    this.setData({
      year_show: !that.data.year_show
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation()
  },
  // showPicker () {
  //   // debugger
  //   this.animation.height(this.data.windowHeight).step()
  //   this.setData({ animation: this.animation.export() })
  //   // wx.hideTabBar({})
  //   this.setData({
  //     sticky_tr: false,
  //     is_sticky: false,
  //     is_show_picker: true
  //   })
  // },
  hideOperation () {
    var animation1 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation3 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation4 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation1
    this.animation = animation2
    this.animation = animation3
    this.animation = animation4
    animation1.translate(0,0).opacity(0).step()
    animation2.translate(0,0).opacity(0).step()
    animation3.translate(0,0).opacity(0).step()
    animation4.translate(0,0).opacity(1).step()

    this.setData({
      batch_add_animation: animation4.export(),
      photo_video_animation: animation3.export(),
      select_pictures_animation: animation2.export(),
      new_schedule_animation: animation1.export()
    })
  },
  getCheckedPayments(e) {
    const payments_type =  e.currentTarget.dataset.payments;
    console.log('payments_type===>',payments_type)
    const new_payments = this.data.payments.map(item => {
      let new_item = item;
      if (item.type === payments_type) {
        new_item.clicked = true
      } else {
        new_item.clicked = false
      }
      return new_item
    })
    this.setData({ payments: new_payments, checked_payments: payments_type })
  },
  getNumber (e) {
    const old_num = this.data.clicked_num;
    const new_num = e.currentTarget.dataset.num;
    let str_num = ''
    if (!old_num) {
      if (new_num==='.') {
        str_num = '0.'
      } else {
        str_num = new_num + ''
      }
    } else {
      if ((old_num.indexOf('.') !== -1)) {
        if (new_num === '.') {
          str_num = old_num
        } else {
          const after = old_num.split('.')[1];
          if (after.length < 2) {
            str_num = old_num + '' + new_num
          } else {
            str_num = old_num.split('.')[0] + '.' + after.slice(0, 2);
          }
        }
      } else {
        str_num = old_num + '' + new_num
      }
    }
    this.setData({ clicked_num: str_num })
  },
  deleteNum () {
    const old_num = this.data.clicked_num;
    if (old_num.length > 0) {
      const new_num = old_num.slice(0, old_num.length - 1);
      console.log('new_num==>',new_num)
      this.setData({ clicked_num: new_num})
    }
  },
  goConfirm() {
    if (!this.data.clicked_num.length) {
      wx.showToast({
        title: '请输入具体金额',
        icon: 'none'
      })
    }
  },
  showDateModal () {
    let new_data = []
    const cur_month = this.data.cur_month
    const full_year = this.data.full_year
    const cur_month_data = this.getTableData(cur_month, this.data.full_year);
    new_data.push(cur_month_data)
    
    let cur_dt = {}
    for(let i = 1; i < 3; i++) {
      if (cur_month === 1) {
        cur_dt = this.getTableData(12, full_year - i);
      } else {
        cur_dt = this.getTableData(cur_month - i, full_year);
      }
      new_data.push(cur_dt)
    }
    new_data = new_data.map(item => {
      const ar = item.id.split('_');
      return {
        year: ar[0],
        month: ar[1],
        ...item
      }
    }).reverse()
   
    console.log('new_data==>',new_data)
    wx.hideTabBar();
    this.setData({choose_date_dt: new_data,show_date_popup: true, chooseSize: true,showOperation: false})
  },
  hideJiShiModal () {
    this.setData({
      showOperation: true
    })
    wx.showTabBar();
  },
  hideDateModal () {
    if (this.data.chooseSize) {
      this.setData({
        chooseSize: true,
        showOperation: false
      })
      wx.hideTabBar();
    }
  },
  closeDateModal() {
    this.setData({
      show_date_popup: false,
    })
  },
  closeModal() {
    const new_payments = this.data.payments.map(item => {
      let new_item = item;
      if (item.type === 'expend') {
        new_item.clicked = true
      } else {
        new_item.clicked = false
      }
      return new_item
    })
    setTimeout(() => {
      this.setData({
        chooseSize: false,
        showOperation: true,
        clicked_num:'',
        checked_payments: 'expend',
        payments: new_payments
      })
    },200)
    wx.showTabBar();
  },
  getOperation(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'schedule') {
      wx.navigateTo({
        url: '../new_schedule/new_schedule?cur_date=' + this.data.cur_date + '&cur_month=' + this.data.cur_month + '&' + 'full_year=' + this.data.full_year + '&type=' + type
      })
    }
    if (type == 'consume') {
      // wx.navigateTo({
      //   url: '../new_consumption/new_consumption?cur_date=' + this.data.cur_date + '&cur_month=' + this.data.cur_month + '&' + 'full_year=' + this.data.full_year + '&type=' + type
      // })
      const child = this.selectComponent('#myComponent');
      child.chooseSezi();
      this.setData({chooseSize: true, showOperation: false})
      wx.hideTabBar();
    }
    // if (type == 3 || type == 4) {
    //   wx.navigateTo({
    //     url: '../publish/publish?cur_date=' + this.data.cur_date + '&cur_month=' + this.data.cur_month + '&' + 'full_year=' + this.data.full_year + '&type=' + type
    //   })
    //   // this.setData({
    //   //   is_show_new_mask: false
    //   // })
    //   // 隐藏
    // } 
    // else{
    //   console.log(this.data);
    //   if (this.data.hasUserInfo) {
    //     wx.navigateTo({
    //       url: '../create/create?type=' + type
    //     })
    //   }
    // }
    this.hideOperation()
    this.setData({
      is_show_new_mask: false
    })
  },
  addSchedule() {
    var animation1 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation3 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation4 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation1
    this.animation = animation2
    this.animation = animation3
    this.animation = animation4
    if (this.data.is_show_new_mask || this.batch_text == '确定') {
      // debugger
      // 隐藏
      animation1.translate(0,0).opacity(0).step()
      animation2.translate(0,0).opacity(0).step()
      animation3.translate(0,0).opacity(0).step()
      animation4.translate(0,0).opacity(0).step()
      this.setData({
        photo_video_animation: animation3.export(),
        select_pictures_animation: animation2.export(),
        new_schedule_animation: animation1.export(),
        batch_add_animation: animation4.export(),
        show_checkobx: false,
        is_show_new_mask: false
      })
    } else {
      // 出现
      animation1.translate(0,-60).opacity(1).step()
      animation2.translate(0,-120).opacity(1).step()
      animation3.translate(0,-150).opacity(1).step()
      animation4.translate(0,-200).opacity(1).step()
      this.setData({
        batch_add_animation: animation4.export(),
        photo_video_animation: animation3.export(),
        select_pictures_animation: animation2.export(),
        new_schedule_animation: animation1.export(),
        batch_text:'批量',
        show_checkobx: false,
        is_show_new_mask: true
      })
    }
  },
  onClickRow (event) { // 点击行
    const {index} = event.currentTarget.dataset;
    this.setData({clickedRowIndex: index})
  },
  onClickDate(event) { // 点每一个日期
    let status = event.currentTarget.dataset.item.status;
    let item = event.currentTarget.dataset.item;
    // 多选的时候不能点下一页
    if (this.data.show_checkobx) {
      return false
    }
    console.log(item);
    this.setData({ cur_date: event.currentTarget.dataset.item.date })
    if(this.data.full_year >= 1900 && this.data.full_year <=2050){
      if (this.data.cur_month == 1 && status == 0) { // 当前是1月  点了上个月
        this.setData({ cur_month: 12, full_year: this.data.full_year - 1 })
      } else if (this.data.cur_month == 12 && status == 2) { // 当前是12月  点了
        this.setData({ cur_month: 1, full_year: this.data.full_year + 1 })
      } else {
        if (status == 0) { // 上月
          this.setData({ cur_month: this.data.cur_month - 1 })
        } else if (status == 2) { // 下月
          this.setData({ cur_month: this.data.cur_month + 1 })
        }
      }
    }
    if (status !== 1) { // 如果点的不是当前月份才更新
      wx.setNavigationBarTitle({
        title: this.data.full_year + '年' + this.data.cur_month + '月'
      })
      this.getTableData(this.data.cur_month, this.data.full_year, this.data.cur_date).then(res => {
        this.setData({
          month_arr: res
        })
      })
      // this.setData({
      //   month_arr: this.getTableData(this.data.cur_month, this.data.full_year, this.data.cur_date)
      // })
      this.setData({
        lunar_arr: lunar.showCal(this.data.full_year,this.data.cur_month,this.data.cur_date, 1).split(' ')
      })
      // this.getList();
      console.log('lunar_arr',this.data.lunar_arr);
    }
    let nian_yue_ri = this.data.full_year + '-' + (this.data.cur_month >= 10 ?this.data.cur_month:'0'+this.data.cur_month) + '-' + (this.data.cur_date>=10?this.data.cur_date:'0'+this.data.cur_date);
    this.setData({
      zhou_ji: days.calculateDays(this.data.full_year, this.data.cur_month, this.data.cur_date)
    })
    console.log(nian_yue_ri);
    this.searchSchedule(nian_yue_ri);
    // 去掉clicked
    this.getStyle(status);
    if (this.data.cur_month === date.getMonth() + 1 && this.data.full_year === date.getFullYear()) {
      this.setData({ show_jin: false })    
    }
  },
  getStyle (status) {
    let arr = this.data.month_arr.list;
    if (status === 1) {
      // 去掉所有clicked样式
      for (let row of this.data.month_arr.list) {
        for (let item of row) {
          if (item.is_clicked) {
            item.is_clicked = false;
            this.setData({
              month_arr: this.data.month_arr
            })
          }
        }
      }
      
      for (let row of this.data.month_arr.list) {
        for (let item of row) {
          if (item.year == this.data.full_year && item.month == this.data.cur_month && item.date == this.data.cur_date) {
            item.is_clicked = true;
            this.setData({
              month_arr: this.data.month_arr
            })
          }
        }
      }

    }
  },
  closeDialog2() {
    wx.showTabBar({})
    app.globalData.calendar.is_show_new_mask = false;
    this.setData({
      is_show_new_mask: app.globalData.calendar.is_show_new_mask
    })
  },
  closeDialog () {
    wx.showTabBar({})
    this.setData({
      sticky_tr: true,
      is_sticky: true,
      is_show_picker: false
    })
  },
  confirmSelect (e) {
    wx.showTabBar({})
    this.setData({
      sticky_tr: true,
      is_sticky: true,
      is_show_picker: false
    })
    this.getTableData(this.data.cur_month, this.data.full_year).then(res => {
      this.setData({
        month_arr: res
      })
    })
    // this.setData({
    //   month_arr: this.getTableData(this.data.cur_month, this.data.full_year)
    // })
  },
  bindChange: function(e) {
    const val = e.detail.value
    this.setData({
      full_year: this.data.year_arr[val[0]],
      cur_month: this.data.monthArr[val[1]],
      cur_date: this.data.cur_month_days[val[2]]
    })
  },
  closeList () {
    if (this.data.year_show) {
      this.setData({
        year_show: !this.data.year_show
      })
    }
  },

  searchSchedule (nian_yue_ri) {
    console.log('nian_yue_ri==>',nian_yue_ri.toString())
    let _this = this;
    const db = wx.cloud.database()
    db.collection('todo_list').where({
      _openid: wx.getStorageSync('openid'),
      date: nian_yue_ri.toString()
    }).get({
      success: function(res) {
     
        let results = res.data.reverse();
        console.log('results==>',results)
        let _types = [
          {data: []},
          {data: []},
          {data: []},
      ]
        results.forEach(item => {
          if (item.event_type === "schedule") { // 0 schedule
            _types[0].data.push(item)
            _types[0].type = 0
          } else if (Number(item.type) == 1) {
            _types[1].data.push(item)
            _types[1].type = 1
          } else if (Number(item.type) == 2) {
            _types[2].data.push(item)
            _types[2].type = 2
          }
        })
        console.log('_types==>',_types)
      
        _this.setData({
          itemList: _types
        })
      }
    })
  },

  getList () {
    let _this = this;
    const db = wx.cloud.database()
    db.collection('todo_list').get({
      success: function(res) {
      // 输出 [{ "title": "The Catcher in the Rye", ... }]
      console.log(res)
      let results = res.data;
      // debugger
      console.log('results', results);
      results.map(item => {
        if (item.start_time.length > 5) { // 一个一个添加2019-02-21 06:40:00 批量添加21:30 
          date_arr = item.start_time.split(' ')[0].split('-');
          console.log('date_arr==>',date_arr)
          // debugger
        } else {
          if (item.date) {
            date_arr = item.date.split('-');
          }
        }
      })
        let nian = date_arr[0];
        let yue = date_arr[1];
        let ri = date_arr[2];
        console.log(date);
      //   for (let row of _this.data.month_arr.list) {
      //     for (let item of row) {
      //       if (nian == item.year && yue == item.month && parseInt(ri) == item.date) {
      //         console.log(item);
      //         item.type = results[i].type;
      //         _this.setData({
      //           month_arr: _this.data.month_arr
      //         })
      //       }
      //       // console.log(item);
      //     }
      //   }
      // }
      console.log('month_arr.list',_this.data.month_arr.list);
    }
    })
    // wx.request( {
    //   url: app.globalData.url + 'api/events/list',
    //   headder: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   method: "get", 
    //   success: function( res ) {
    //     if (res.statusCode == 200) {
    //       let results = res.data.data;
    //       // console.log(this.data.month_arr);
    //       for (let i in results) {
    //         let date_arr = [];
    //         if (results[i].start_time.length > 5) { // 一个一个添加2019-02-21 06:40:00 批量添加21:30 
    //           date_arr = results[i].start_time.split(' ')[0].split('-');
    //         } else {
    //           if (results[i].date) {
    //             // debugger
    //             date_arr = results[i].date.split('-');
    //           }
    //         }
    //         let nian = date_arr[0];
    //         let yue = date_arr[1];
    //         let ri = date_arr[2];
    //         console.log(date);
    //         for (let row of _this.data.month_arr.list) {
    //           for (let item of row) {
    //             if (nian == item.year && yue == item.month && parseInt(ri) == item.date) {
    //               console.log(item);
    //               item.type = results[i].type;
    //               _this.setData({
    //                 month_arr: _this.data.month_arr
    //               })
    //             }
    //             // console.log(item);
    //           }
    //         }
    //       }
    //       console.log('month_arr.list',_this.data.month_arr.list);
    //     }
    //   }
    // })
  },

  calendarTranslateX () {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in'
    })
    animation.translateX(-this.data.windowWidth).opacity(1).step();
    this.setData({
      calendar_x_animation: animation.export(),
    })
  },

  init () {
    var animation1 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation3 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    var animation4 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation1
    this.animation = animation2
    this.animation = animation3
    this.animation = animation4
    // debugger
      // 隐藏
      animation1.translate(0,0).opacity(0).step()
      animation2.translate(0,0).opacity(0).step()
      animation3.translate(0,0).opacity(0).step()
      animation4.translate(0,0).opacity(0).step()
      this.setData({
        photo_video_animation: animation3.export(),
        select_pictures_animation: animation2.export(),
        new_schedule_animation: animation1.export(),
        batch_add_animation: animation4.export(),
        is_show_new_mask: false
      })
  },

  
  onLoad: function (options) {
    const {full_year, cur_month, cur_date} = this.data;
    // console.log(options);
    // console.log(this.data.is_show_new_mask)
    wx.setNavigationBarTitle({
      title: this.data.full_year + '年' + this.data.cur_month + '月'
    })
    const months_arr = app.getTableData(full_year, cur_month)
    //    isShrink: true
    let curRowIndex;
    months_arr[1].map((row, index) => {
     row.map(item => {
       if (item.isToday) {
        curRowIndex = index
       }
     })
    })
    this.setData({
      months_arr: months_arr,
      clickedRowIndex: curRowIndex,
      test_obj: months_arr[0][0],
      month_arr: months_arr[1],
      zhou_ji: days.calculateDays(full_year, cur_month, cur_date),
      min_height:Math.floor((wx.getSystemInfoSync().windowWidth - 75)/7) + 'px',
      // windowHeight: app.globalData.windowHeight,
      windowWidth: wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight + 'px'
    })

    console.log('windowHeight=======>',wx.getSystemInfoSync().windowHeight);
    // clearInterval(this.data.interval);
    // this.getYears();
    // this.setData({
    //     lunar_arr: lunar.showCal()
    // }, () => {
    //   console.log('lunar_arr1111=>',this.data.lunar_arr)
    // })
    
   
   
    // this.setData({months_arr: months_arr[0]}, () => {
    //   console.log('months_arr==>',this.data.months_arr[0].sDay)
    // })

    

    // wx.getUserInfo({
    //   success:function(res){
    //     console.log(res);
    //     var avatarUrl = 'userInfo.avatarUrl';
    //     var nickName = 'userInfo.nickName';
    //     that.setData({
    //       [avatarUrl]: res.userInfo.avatarUrl,
    //       [nickName]:res.userInfo.nickName,
    //     })
    //   }
    // })

    // 查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success(res) {
    //           console.log(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })

    // wx.login({
    //   success (res) {
    //     if (res.code) {
    //       console.log(res.code)
    //       //发起网络请求
    //       wx.request({
    //         url: 'https://test.com/onLogin',
    //         data: {
    //           code: res.code
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })



    /**********初始化  先获取当前月份 上月 下月  的数据************/ 
    // let cur_swiper_month_arr = []
    // let last_month_data = []
    // let next_month_data = []
    // this.getTableData(this.data.cur_month, this.data.full_year).then(res => {
    //   this.setData({
    //     month_arr: res
    //   })
    // })

  },




  /***
 * 获取当前显示月份的时间戳范围
 * 需要知道当前month_arr里面显示的 第一天的日期和最后一天的日期
 * 获取9月份数据  2021-09-01 00
 * ****/
  getMarkSchedule (cur_month) {
    return new Promise(function(resolve, reject) {
      let marked_items = []
      let temp = []
      let end_res = []
      const db = wx.cloud.database()
      db.collection('todo_list').where({
        _openid: wx.getStorageSync('openid'),
        month: cur_month.toString()
      }).orderBy('month', 'asc').get({
        success: function(results) {
          console.log('results===>',results)
          let mon_filtered = []
          results.data.map(item => {
            if (Number(item.month) == Number(cur_month)) {
              mon_filtered.push(item)
            }
          })
          marked_items = [...new Set(mon_filtered)]
          marked_items.map((item, i) => {
            if (temp.indexOf(item.date) === -1) {
              temp.push(item.date);
              end_res.push({
                date: item.date,
                items: [item]
              })
            } else {
              end_res.forEach((end, j) => {
                if (end.date === item.date) {
                    end_res[j].items.push(item);
                }
              })
            }
          })
          let _marked_items = end_res.map(day => {
            if (day.items.length > 1) {
              const undone = day.items.find(item => item.schedule_type == '0');
              const done = day.items.find(item => item.schedule_type == '1');
              if (!undone) {
                return {
                  date: day.items[0].date,
                  status: 'done', // 全都是已完成
                }
              } else if (!done) {
                return {
                  date: day.items[0].date,
                  status: 'undone', // 全都没完成
                }
              } else {
                return {
                  date: day.items[0].date,
                  status: 'pending', // 部分完成
                }
              }
            } else {
              const status = day.items[0].schedule_type == '1' ? 'done': 'undone'
              return {
                date: day.items[0].date,
                status,
              }
            }
          })
          console.log('_marked_items===>',_marked_items)
          resolve(_marked_items)
          console.log('877 end_res==>',end_res)
          console.log('891===marked_items===>',marked_items)
        }
      })
    })
  },

  /*******获取当前显示的月份数据******/
  async getTableData(cur_month, cur_year, cur_date, index) {
    // 今
    if (cur_month !== date.getMonth() + 1 || cur_year !== date.getFullYear()) {
      this.setData({ show_jin: true })    
    }
    console.log('arguments',arguments);
    let total = [];
    let days = 1; // 当月有几天
    let next_days = 7 - total.length % 7;
    let last_days = 1;
    let last_month_start = 1; // 从上个月第几号开始渲染
    let dayFirst = parseInt(new Date(cur_year, cur_month - 1, 1).getDay()) ? new Date(cur_year, cur_month - 1, 1).getDay() : 7; //当月第一天星期几
    // 算当月和下月多少天
    if (cur_month == 1 || cur_month == 3 || cur_month == 5 || cur_month == 7 || cur_month == 8 || cur_month == 10 || cur_month == 12) {
      days = 31;
      if (cur_month == 1 || cur_month == 8) {
        last_days = 31;
      } else if (cur_month == 3) {
        if (((cur_year % 4) == 0) && ((cur_year % 100) != 0) || ((cur_year % 400) == 0)) { // 闰年二月29天，平年2月28天
          last_days = 29;
        } else {
          last_days = 28;
        }
      } else if (cur_month == 5 || cur_month == 7 || cur_month == 10 || cur_month == 12) {
        last_days = 30;
      }
    } else if (cur_month == 4 || cur_month == 6 || cur_month == 9 || cur_month == 11) {
      days = 30; last_days = 31;
    } else if (cur_month == 2) {
      if (((cur_year % 4) == 0) && ((cur_year % 100) != 0) || ((cur_year % 400) == 0)) { // 闰年二月29天，平年2月28天
        days = 29; last_days = 31;
      } else {
        days = 28; last_days = 31;
      }
    }
    let day_arr = []
    let third = "value[" + 2 + "]";
    for (let i = 1; i <= days; i++) {
      day_arr.push(i)
      this.setData({
        cur_month_days: day_arr
      })
      if (i === this.data.cur_date) {
        this.setData({
          [third]: parseInt(i-1)
        })
      }
    }

    const conmon_data = {
      is_clicked: false, 
      checked: false,
    }
  
   
    // 格式化数据
    if (dayFirst !== 7) { // 当月第一天不是星期日就没有上月数据渲染 因为列表是  上月数据 + 当月数据 + 下月数据
      last_month_start = last_days + 2 - dayFirst - 1;
      for (let i = last_month_start; i <= last_days; i++) { // 上个月数据
        let last_month_day_item = {
         ...conmon_data,
          gray: true,
          status:0, 
          date: i,
          month: cur_month == 1 ? 12: cur_month - 1,
          year: cur_month == 1 ? cur_year - 1: cur_year,
          lunar_date: cur_month == 1 ? lunar.showCal(cur_year - 1, 12, i): lunar.showCal(cur_year, cur_month - 1, i)
        }

        let _last_month_day_item = {
          ...last_month_day_item,
          nian_yue_ri: `${last_month_day_item.year+ '-' + (last_month_day_item.month >= 10 ? last_month_day_item.month: '0' +last_month_day_item.month) + '-' + (last_month_day_item.date >= 10 ? last_month_day_item.date: '0' + last_month_day_item.date)}`
        }
        total.push(_last_month_day_item)
      }
    }
    const marked_items = await this.getMarkSchedule(cur_month);
    console.log('marked_items============>',marked_items)
    for (let j = 1; j <= days; j++) { // 当月数据
     
      let cur_month_day_item = {
        ...conmon_data,
         gray: false,
         status:1, 
         date: j,
         month: cur_month, 
         year: cur_year,
         lunar_date: lunar.showCal(cur_year, cur_month, j)
      }
      let nian_yue_ri = `${cur_month_day_item.year+ '-' + (Number(cur_month_day_item.month) >= 10 ? cur_month_day_item.month: '0' + cur_month_day_item.month) + '-' + (Number(cur_month_day_item.date)>= 10 ? cur_month_day_item.date: '0' + cur_month_day_item.date)}`

      let _cur_month_day_item = {
        ...cur_month_day_item,
        nian_yue_ri
      }
      for(let d =0; d < marked_items.length; d++) {
        if (marked_items[d].date === nian_yue_ri) {
          _cur_month_day_item = {
            ...cur_month_day_item,
            status: marked_items[d].status,
            has_schedule: true
          }
        }
      }
      total.push(_cur_month_day_item);
    }
    for (let n = 1; n < next_days; n++) { // 下月数据
      let next_month_day_item = {
        ...conmon_data,
        gray: true,
        status:2, 
        date: n,
        month: cur_month == 12 ? 1 : cur_month + 1, 
        year: cur_year,
        // lunar_date: cur_month == 12 ? lunar.showCal(cur_year + 1, 1, n): lunar.showCal(cur_year, cur_month + 1, n)
      }
      const _next_month_day_item = {
        ...next_month_day_item,
        nian_yue_ri: `${next_month_day_item.year + (next_month_day_item.month >= 10 ? next_month_day_item.month:'0' +next_month_day_item.month)+'-' + (next_month_day_item.date >= 10 ? next_month_day_item.date: '0' + next_month_day_item.date)}`
      }
      total.push(_next_month_day_item)
    }
    let currData = [];
    let allData = [];
    /***
     * 应该在这里加上日程标志
     ****/
    for (let m = 0; m < total.length; m++) {
      total[m].is_clicked = false
      if (total[m].year == cur_year && total[m].month == cur_month && total[m].date == cur_date) {
        total[m].is_clicked = true
      }
      currData.push(total[m]); // cur_month, cur_year, cur_date
      if ((m != 0 && (m + 1) % 7 === 0) || m === total.length - 1) {
        if (currData.length === 7) {
          allData.push(currData);
        }
        currData = [];
      }
    }

    // 渲染table
    console.log('total==>',total);
    console.log('allData===>',allData);
    let month_arr = new Object();
    month_arr.list = allData

    let hang = month_arr.list.length;
    const _a_margin = Math.ceil(((670-110)/hang - 95)/2) + 'rpx';
    console.log('_a_margin==>',_a_margin)
    this.setData({
      a_margin: _a_margin
    })
    month_arr.id = cur_year + '_' +cur_month;
    if (arguments[3]) {
      let index_mon = 'tb_arr['+ index + ']';
      this.setData({
        [index_mon]: month_arr
      })
    } else {
      console.log('month_arr==>',month_arr)
      return month_arr;
    }
    for (let i = 0; i < 12; i++) {
      this.setData({
        ['tb_arr['+ i + ']']: month_arr
      })
    }
    console.log('this.data.tb_arr===>',this.data.tb_arr);
    console.log('this.data.month_arr===>',this.data.month_arr);
  },
  
  getYears () {
    let new_arr = []
    let first = "value[" + 0 + "]";
    for (let i = 1900; i <= 2050; i++) {
      new_arr.push(i);
      this.setData({
        year_arr: new_arr
      })
    }
  },

  getSetting() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              wx.navigateTo({
                url: '../create/create?type=' + this.data.type
              })
            }
          })
        }
      }
    })
    // wx.openSetting({
    //   success: function (osrs) {
    //     // 出发条件是返回的时候
    //     console.log("Aaaa");
    //     wx.getUserInfo({
    //       success: function (getuserinfo) {
    //         that.data.hasuserinfo = true;
    //         that.setData(that.data);
    //         console.log(that.data.hasuserinfo);
    //       },
    //       fail: function (fres) {
    //         that.data.hasuserinfo = false;
    //         that.setData(that.data);
    //         console.log(that.data.hasuserinfo);
    //       }
    //     })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */

  onHide () {
    // this.init()
  },

  onShow: function () {
    const {cur_date, full_year, cur_month} = this.data;
    // app.slideupshow(this, 'slide_up1', 0, 1)
    // app.slideupshow(this, 'slide_up2', 0, 1)
    // app.slideupshow(this, 'slide_up3', 0, 1)
    // this.getList();
    let nian_yue_ri = full_year + '-' + (cur_month >= 10 ?cur_month:'0'+cur_month) + '-' + (cur_date>=10?cur_date:'0'+cur_date);
    this.searchSchedule(nian_yue_ri);
    // this.getTableData(this.data.cur_month, this.data.full_year).then(res => {
    //   this.setData({
    //     month_arr: res
    //   })
    // })
    
    // 获取日程列表的高度
    // const query = wx.createSelectorQuery()
    //   query.select('.schedule_area').boundingClientRect()
    //   query.selectViewport().scrollOffset()
    //   query.exec(function (res) {
    //     debugger
    //     res[0].height
    //   })
  }

  // getUserInfo: function(e) {
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }

})
