// component/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示
    show: {
      type: Boolean,
      value: false
    },
    text: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    alpha: [1,1,1,1,1]
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var self = this;
      var _index = 0;
      var _alpha = self.data.alpha;
      var _speed = 150;
      var timer = setInterval(function () {
        var an_show = wx.createAnimation({});
        var an_hide = wx.createAnimation({});
        an_show.opacity(1).step({ duration: _speed });
        an_hide.opacity(0).step({ duration: _speed });
        _alpha[_index] = an_show;
        _alpha[_index == 0 ? 4 : _index - 1] = an_hide;
        self.setData({
          alpha: _alpha
        })
        _index = _index == 4 ? 0 : _index + 1;
      }, _speed);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
