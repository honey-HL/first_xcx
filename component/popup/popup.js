/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
     <view>你自己需要展示的内容</view>
  </modal>

  属性说明：
  show： 控制modal显示与隐藏
  height：modal的高度
  bindcancel：点击取消按钮的回调函数
  bindconfirm：点击确定按钮的回调函数

  使用模块：
  场馆 -> 发布 -> 选择使用物品
 */

const {bus} = require('../../utils/bus.js');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: false
    },
    //modal的高度
    height: {
      type: String,
      value: '80%'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: '',
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
     // 动画函数
    chooseSezi (e) {
      // 用that取代this，防止不必要的情况发生
      var that = this;
      // 创建一个动画实例
      var animation = wx.createAnimation({
        // 动画持续时间
        duration: 100,
        // 定义动画效果，当前是匀速
        timingFunction: 'linear'
      })
      // 将该变量赋值给当前动画
      that.animation = animation
      // 先在y轴偏移，然后用step()完成一个动画
      animation.translateY(500).step()
      // 用setData改变当前动画
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
        // 改变view里面的Wx：if
        show: true
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动 滑动时间
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          clearcart: false
        })
      }, 0)
    },
    // 隐藏
    hideModal (e) {
      var that = this;
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'linear'
      })
      that.animation = animation
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          show: false
        })
      }, 200)
      wx.showTabBar();
      bus.emit('onShowOperation')
    },
    clickMask() {
      // this.setData({show: false})
    },

    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    confirm() {
      this.setData({ show: false })
      this.triggerEvent('confirm')
    }
  }
})