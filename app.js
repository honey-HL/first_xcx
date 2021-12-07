//app.js
const date = new Date()
var lunar = require('./utils/lunar.js')

App({

  // 获取目标年月的天数
  getTableData(cur_month, cur_year, cur_date, index) {
    // 今
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
      // this.setData({
      //   cur_month_days: day_arr
      // })
      // if (i === this.data.cur_date) {
      //   this.setData({
      //     [third]: parseInt(i-1)
      //   })
      // }
    }

    // 格式化数据
    if (dayFirst !== 1) { // 当月第一天不是星期一
      last_month_start = last_days + 2 - dayFirst - 1;
      for (let i = last_month_start; i <= last_days; i++) { // 上个月数据
        if (cur_month == 1) {
            total.push({ is_clicked: false, checked: false, date: i, month: 12, year: cur_year - 1, gray: true, status:0, lunar_date: lunar.showCal(cur_year - 1, 12, i) });
        } else {
            total.push({ is_clicked: false,  checked: false,date: i, month: cur_month - 1, year: cur_year, gray: true, status:0, lunar_date: lunar.showCal(cur_year, cur_month - 1, i) });
        }
      }
    }
    for (let j = 1; j <= days; j++) { // 当月数据
      total.push({ is_clicked: false, checked: false, date: j, month: cur_month, year: cur_year, gray: false, status: 1, lunar_date: lunar.showCal(cur_year, cur_month, j) });
    }
    for (let n = 1; n < next_days; n++) { // 下月数据
        if (cur_month == 12) {
            total.push({ is_clicked: false,  checked: false,date: n, month: 1, year: cur_year + 1, gray: true, status: 2, lunar_date: lunar.showCal(cur_year + 1, 1, n) });
        } else {
            total.push({ is_clicked: false,  checked: false,date: n, month: cur_month + 1, year: cur_year, gray: true, status: 2, lunar_date: lunar.showCal(cur_year, cur_month + 1, n) });
        }
    }
    let currData = [];
    let allData = [];
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
    console.log(total);
    console.log(allData);
    let month_arr = new Object();
    month_arr.list = allData
    let hang = month_arr.list.length;
    // this.setData({
    //   a_margin: Math.ceil(((670-110)/hang - 95)/2) + 'rpx'
    // })
    month_arr.id = cur_year + '_' +cur_month;
    if (arguments[3]) {
    let index_mon = 'tb_arr['+ index + ']';
    this.setData({
      [index_mon]: month_arr
    })
    } else {
      return month_arr;
    }
    for (let i = 0; i < 12; i++) {
      this.setData({
        ['tb_arr['+ i + ']']: month_arr
      })
    }
    console.log('this.data.tb_arr',this.data.tb_arr);
    console.log('this.data.month_arr',this.data.month_arr);
  },


  //滑动渐入渐出
  slideupshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },


  /**
 * 设置监听器
 */
  setWatcher(page) {
    let data = page.data;
    let watch = page.watch;
    Object.keys(watch).forEach(v => {
      console.log(v)
      let key = v.split('.'); // 将watch中的属性以'.'切分成数组
      let nowData = data; // 将data赋值给nowData
      for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
        nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
      }
      let lastKey = key[key.length - 1];
      // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
      let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
      let deep = watch[v].deep; // 若未设置deep,则为undefine
      this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
    })
  },


  /**
   * 监听属性 并执行监听函数
   */
  observe(obj, key, watchFun, deep, page) {
    var val = obj[key];
    // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
    if (deep && val != null && typeof val === 'object') {
      Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
        this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
      })
    }
    var that = this;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
        watchFun.call(page, value, val); // value是新值，val是旧值
        val = value;
        if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
          that.observe(obj, key, watchFun, deep, page);
        }
      },
      get: function () {
        return val;
      }
    })
  },



  checkSessionAndLogin () {
    let that = this;
    let thisOpenId = wx.getStorageSync('openid');
    if (thisOpenId) {
      console.log('have openid')
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail: function () {
          console.log('but session_key expired');
          // session_key 已经失效，需要重新执行登录流程
          wx.removeStorageSync('openid');
          that.checkSessionAndLogin();
        }
      })
    } else { // 首次登陆
      console.log('do not have openid');
      that.loginAndGetOpenid();
    }
  },

  loginAndGetOpenid () {
    let that = this;
    wx.cloud.callFunction({
      name:'get_open_id',
      data: {}
    }).then(res=>{
      console.log('[云函数] [get_open_id] user openid: ', res.result.openid)
      that.globalData.openid = res.result.openid
      wx.setStorageSync('openid', res.result.openid);
      // wx.showModal({
      //   title: res.result.openid
      // })
    })
  },


  onLaunch: function () {
    var _this=this

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'honney-f0fvn',
        traceUser: true,
      })
    }

    var userinfo = wx.getStorageSync('user');
    console.log('userinfo', userinfo);
    this.checkSessionAndLogin();

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserProfile({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },


  globalData: {
    code: '',
    // url: 'https://honney.xyz/',
    // url: 'http://taili-xcx.com/',
    url: 'http://127.0.0.1:8000/',
    // url: 'http://192.168.124.5/',
    // url: 'http://111.67.206.99/',
    calendar: {
      is_show_new_mask: false,
    },
    show_mask: false,
    pictures_arr: [],
    windowHeight: '',
    userInfo: null
  }


})