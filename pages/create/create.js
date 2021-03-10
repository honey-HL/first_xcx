// pages/create/create.js
const app = getApp()
const that = this

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // opacity_camera: 1,
    device_position: 'back',
    is_camera_show: false,
    photo_container: false,
    type: '',
    windowHeight: '1000px',
    src: '',
    hasuserinfo: "未获取",
    videoSrc: ''
  },
  goBack () {
    wx.navigateBack({
      delta: 2
    })
  },
  savePhoto() {
    console.log('chufale')
    let arr = new Array()
    for (let i = 0; i < app.globalData.pictures_arr.length; i++) {
      arr[i] = app.globalData.pictures_arr[i]
    }
    arr.push(this.data.src)
    app.globalData.pictures_arr = arr;
    console.log(JSON.stringify(app.globalData.pictures_arr));
    if (app.globalData.pictures_arr.length <= 9) {
      wx.redirectTo({
        url: '/pages/publish/publish'
      })
    }
  },
  switchCamera () {
    if (this.data.device_position === 'back') {
      this.setData({
        device_position: 'front'
      })
    } else {
      this.setData({
        device_position: 'back'
      })
    }
  },
  backToCamera () {
    this.setData({
      photo_container: false,
      is_camera_show: true
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          photo_container: true,
          is_camera_show: false,
          // opacity_camera: 0,
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  allowTakePhoto() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              const ctx = wx.createCameraContext()
              ctx.takePhoto({
                quality: 'high',
                success: (res) => {
                }
              })
            }
          })
        }
      }
    })
  },
  startRecord() {
    const ctx = wx.createCameraContext()
    ctx.startRecord({
      success: () => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    const ctx = wx.createCameraContext()
    ctx.stopRecord({
      success: (res) => {
        // debugger
        console.log(res);
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  watch: {
    type: {
      handler(newValue) {
        console.log(newValue);
        // this.getSetting()
      },
      deep: true
    },
    windowHeight: {
      handler(newValue) {
        console.log(newValue);
        // this.getSetting()
      },
      deep: true
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.type) {
      this.setData({
        type: options.type,
        windowHeight: wx.getSystemInfoSync().windowHeight + 'px'
      })
    } else {
      this.setData({
        windowHeight: wx.getSystemInfoSync().windowHeight + 'px',
        photo_container: false,
        is_camera_show: true
      })
      return
    }
    app.setWatcher(this);
    let that = this;
    console.log(options)
    if (options.type == 1) { // 1拍摄   // 2从相册选择   // 3发表文字
      this.setData({
        is_camera_show: true
      })
      this.allowTakePhoto()
    }
    wx.setNavigationBarTitle({
      title: '新建日程'
    })
    wx.getUserInfo({
      success: function (getuserinfo) {
        that.data.hasuserinfo = true;
        that.setData(that.data);
      },
      fail: function (fres) {
        that.data.hasuserinfo = false;
        that.setData(that.data);
      }
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
  onShow: function (options) {
    console.log(options);
    this.onLoad() 
    if (app.globalData.show_mask) {
      wx.navigateTo({
        url: '../publish/publish'
      })
    }
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