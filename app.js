//app.js

//  "pages/view/view",
// {
//   "pagePath": "pages/view/view",
//   "text": "视图",
//   "selectedIconPath": "images/icon/finished_lan.png",
//   "iconPath": "images/icon/finished.png"
// },
const date = new Date()
var lunar = require('./utils/lunar.js')
const weekDayMap = {
  '日': 0,
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
}

App({

  getNextMonthData (next_month_year, next_month) {// 获取下月数据
    let nextMonData = lunar.showCal(next_month_year, next_month)
    this.globalData.monthsObj[`${next_month_year}_${next_month}`] = nextMonData
    return nextMonData;
  },

  getNextMonYear(cur_year, cur_month) { // 获取下月的年份和月份
    let next_month_year;let next_month;
    if (cur_month == 12) {
      next_month_year = cur_year + 1;
      next_month = 1;
    } else {
      next_month_year = cur_year;
      next_month = cur_month + 1;
    }
    return {next_month_year, next_month}
  },

  getNext2MonthData (next_2month_year, next_2month) {// 获取下2月数据
    let next2MonData = lunar.showCal(next_2month_year, next_2month)
    this.globalData.monthsObj[`${next_2month_year}_${next_2month}`] = next2MonData
    return next2MonData;
  },

  getNext2MonYear(cur_year, cur_month) { // 获取下2月的年份和月份
    let next_2month_year;let next_2month;
    if (cur_month + 2 > 12) {
      next_2month_year = cur_year + 1;
      next_2month = (cur_month + 2) % 12;
    } else {
      next_2month_year = cur_year;
      next_2month = cur_month + 2;
    }
    return {next_2month_year, next_2month}
  },

  getLastMonthData (last_month_year, last_month) {// 获取上月数据
    let lastMonData = lunar.showCal(last_month_year, last_month)
    this.globalData.monthsObj[`${last_month_year}_${last_month}`] = lastMonData
    return lastMonData
  },

  getLastMonYear(cur_year, cur_month) { // 获取上月的年份和月份
    let last_month_year;let last_month;
    if (cur_month == 1) {
      last_month_year = cur_year - 1;
      last_month = 12;
    } else {
      last_month_year = cur_year;
      last_month = cur_month - 1;
    }
    return {last_month_year, last_month}
  },


  getLast2MonthData (last_2month_year, last_2month) {// 获取上2月数据
    let last2MonData = lunar.showCal(last_2month_year, last_2month)
    this.globalData.monthsObj[`${last_2month_year}_${last_2month}`] = last2MonData
    return last2MonData
  },

  getLast2MonYear(cur_year, cur_month) { // 获取上2月的年份和月份
    let last_2month_year;let last_2month;
    if (cur_month - 2 <= 0) {
      last_2month = 12 + (cur_month - 2)
      last_2month_year = cur_year - 1
    } else {
      last_2month_year = cur_year;
      last_2month = cur_month - 2;
    }
    return {last_2month_year, last_2month}
  },


  // 获取目标年月的天数
  getCalTableData(cur_year, cur_month,t_type) {
    console.log('cur_year, cur_month====>',cur_year, cur_month)
    const {monthsObj, savedMonkeys,  months_arr} = this.globalData;
    let currentMonData;let lastMonData;let nextMonData;let last2MonData;let next2MonData; let monthsArr = months_arr;
    let con_lastMonData;let con_currentMonData;let con_nextMonData;let _savedMonkeys = savedMonkeys;
   

    const {last_2month_year, last_2month} = this.getLast2MonYear(cur_year, cur_month)
    const {last_month_year, last_month} = this.getLastMonYear(cur_year, cur_month)
    const {next_month_year, next_month} = this.getNextMonYear(cur_year, cur_month);
    const {next_2month_year, next_2month} = this.getNext2MonYear(cur_year, cur_month);

    // debugger

    let last_2month_key = `${last_2month_year}_${last_2month}`;
    let last_month_key = `${last_month_year}_${last_month}`;
    let cur_month_key = `${cur_year}_${cur_month}`;
    let next_month_key = `${next_month_year}_${next_month}`;
    let next_2month_key = `${next_2month_year}_${next_2month}`;

    // if (savedMonkeys.includes(last_2month_key)) return monthsArr;

    if (t_type == undefined) { // 不是左右滑动
      last2MonData = this.getLast2MonthData(last_2month_year, last_2month)
      lastMonData = this.getLastMonthData(last_month_year, last_month)
      currentMonData = lunar.showCal(cur_year, cur_month)
      nextMonData = this.getNextMonthData(next_month_year, next_month)
      next2MonData = this.getNext2MonthData(next_2month_year, next_2month)
      this.globalData.monthsObj[`${cur_year}_${cur_month}`] = currentMonData
  
       /********拼接当前月份上一个月末的数据和下一个月初的数据********/ 
       con_lastMonData = this.getConcatMonth(last2MonData, lastMonData, currentMonData) 
       con_currentMonData = this.getConcatMonth(lastMonData, currentMonData, nextMonData) 
       con_nextMonData = this.getConcatMonth(currentMonData, nextMonData, next2MonData)

       /********把数据转化成周数据，7条数据一组********/ 
       const _lastMonData = this.getWeekData(Array.from(con_lastMonData))
       const _currentMonData = this.getWeekData(con_currentMonData)
       const _nextMonData = this.getWeekData(Array.from(con_nextMonData))
       monthsArr = [_lastMonData, _currentMonData,_nextMonData]

       _savedMonkeys = [last_month_key, cur_month_key, next_month_key]
       
    } else {// 是左右滑动
     

      if (t_type === 'last') { // 右滑
        
        if (savedMonkeys.includes(last_month_key)) return monthsArr;

        if (Array.from(Object.keys(monthsObj)).includes[last_2month_key]) {
          last2MonData = monthsObj[last_2month_key]
          lastMonData = monthsObj[last_month_key]
          currentMonData = monthsObj[cur_month_key]
        } else {
          last2MonData = this.getLast2MonthData(last_2month_year, last_2month)
          this.globalData.monthsObj[`${last_2month_year}_${last_2month}`] = last2MonData
          lastMonData = monthsObj[last_month_key]
          currentMonData = monthsObj[cur_month_key]
        }
        
        /********拼接当前月份上一个月末的数据和下一个月初的数据********/ 
        con_lastMonData = this.getConcatMonth(last2MonData, lastMonData, currentMonData) 
        const _lastMonData = this.getWeekData(Array.from(con_lastMonData))

        _savedMonkeys.unshift(last_month_key);
       
        // if (months_arr.length < 12) {
        //   monthsArr.unshift(_lastMonData)
        // }
        monthsArr.unshift(_lastMonData)
      }  

      if (t_type === 'next') { // 左滑

        if (savedMonkeys.includes(next_month_key)) return monthsArr;
        
        if (Array.from(Object.keys(monthsObj)).includes[next_2month_key]) {
          
          currentMonData = monthsObj[cur_month_key]
          nextMonData = monthsObj[next_month_key]
          next2MonData = monthsObj[next_2month_key]
         
        } else {
          currentMonData = monthsObj[cur_month_key]
          nextMonData = monthsObj[next_month_key]
          next2MonData = this.getNext2MonthData(next_2month_year, next_2month)
          this.globalData.monthsObj[`${next_2month_year}_${next_2month}`] = next2MonData
          

        }
         /********拼接当前月份上一个月末的数据和下一个月初的数据********/ 
         con_nextMonData = this.getConcatMonth(currentMonData, nextMonData, next2MonData) 
         const _nextMonData = this.getWeekData(Array.from(con_nextMonData))

         _savedMonkeys.push(next_month_key);
      
         // if (months_arr.length < 12) {
         //   monthsArr.unshift(_lastMonData)
         // }
         monthsArr.push(_nextMonData)
      }
      
    }

   

      
  
    

      this.globalData.months_arr = monthsArr
      this.globalData.savedMonkeys = _savedMonkeys;

      console.log('===this.globalData.monthsObj===>',this.globalData.monthsObj)
      console.log('_savedMonkeys=========666=====>', _savedMonkeys)
      console.log('monthsArr=========222===>',monthsArr)
      
      
      return monthsArr;
  },

  getConcatMonth (lastMonData, currentMonData, nextMonData) { // 合并当前月前后的数据
    let conData = Array.from(currentMonData);
    const last_show_days = currentMonData.firstWeek
    const next_show_days = 7- currentMonData.lastWeek -1

    console.log('last_show_days===>',last_show_days, next_show_days)

    if (last_show_days && parseInt(last_show_days) !== 0) {
      let _lastMonData = Array.from(lastMonData).slice(-last_show_days);
      _lastMonData = _lastMonData.map(item => {
        return {
          ...item,
          gray: true
        }
      })
      conData = _lastMonData.concat(conData)
    }
    if (next_show_days && parseInt(next_show_days) !== 0) {
      let _nextMonData = Array.from(nextMonData).slice(0, next_show_days + 1);
      _nextMonData = _nextMonData.map(item => {
        return {
          ...item,
          gray: true
        }
      })
      conData = conData.concat(_nextMonData)
    }
    return conData;
  },

  getWeekData (data) {
    let curArr = []
    let _currentMonData = []
    for(let i =0;i < data.length;i++) {
      curArr.push(data[i])
      if ((i + 1) % 7 === 0 && curArr.length === 7) {
        _currentMonData.push(curArr);
        curArr = [];
      }
    }
    _currentMonData = _currentMonData.map((rowItem, row) => {
      return rowItem.map((colItem, col) => {
        return {
          ...colItem,
          rowIndex: row,
          colIndex: col
        }
      })
     
    })
    console.log('_currentMonData===>',_currentMonData)
    return _currentMonData
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

  getBarInfo() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
       success: res => {
         //导航高度
         let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,
          navObjWid = res.windowWidth - menuButtonObject.right + menuButtonObject.width, // 胶囊按钮与右侧的距离 = windowWidth - right+胶囊宽度
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
          this.globalData.navHeight = navHeight; //导航栏总体高度
          this.globalData.navTop = navTop; //胶囊距离顶部距离
          this.globalData.navObj = menuButtonObject.height; //胶囊高度
          this.globalData.navObjWid = navObjWid; //胶囊宽度(包括右边距离)
          // console.log(navHeight,navTop,menuButtonObject.height,navObjWid)
       },
       fail(err) {
         console.log(err);
       }
     })
  },


  onLaunch: function () {
    var _this=this
    this.getBarInfo()
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
    monthsObj: {},
    months_arr: [],
    savedMonkeys:[],
    show_mask: false,
    pictures_arr: [],
    windowHeight: '',
    navObjWid:'',
    userInfo: null
  }


})