const app = getApp();

Page({
    data: {
      list: [
        { create_time: '2018_4_6', finish_time: '2018_15-29', date: 12, items: [
            { item: '洗了头' }, { item: '逛街' }
        ]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 13,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 14,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 15,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 16,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 17,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 18,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 19,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 20,items: [{item:'洗了头'}]},
        {create_time: '2018_4_6', finish_time: '2018_15-29',date: 21,items: [{item:'洗了头'}]}
      ],
      malTitle: '您正在删除',
      showModal: false,
      lastX: '',
      lastY: '',
      y:100,
      total_scroll: 0,
      scrollTopEnd: '',
      scrollTop: 0,
      top_height: '',
      mid_height: '',
      btm_height: '',
      defaut_top: 0,
      is_tuo: false,
      is_stop: true,
      timer1: '',
      timer2: '',
      will_delete_item: {},
      windowHeight: ''
    },

    getList () {
      const _this = this;
      const db = wx.cloud.database();
      db.collection('todo_list').get({
          success: function(res) {
            console.log(res)
            const results = res.data.reverse();;
            // debugger
            console.log('results', results);
            _this.setData({
              list: results
            })
          }
      })
        // wx.request( {
        //   url: app.globalData.url + "api/events/list/reverse",
        //   headder: {
        //     "Content-Type": "application/x-www-form-urlencoded"
        //   },
        //   method: "get", 
        //   success: function( res ) {
        //     if (res.statusCode == 200) {
        //         let results = res.data.data.reverse();
        //         _this.setData({
        //             list: results
        //         })
        //     }
        //   }
        // })
    },

    upper(e) {
        console.log(e)
    },
    lower(e) {
    console.log(e)
    },
    onPageScroll:function(e){ // 获取滚动条当前位置
        console.log(e)
    },
    ballClickEvent (e) {
        this.setData({defaut_top: e.detail.y})
        console.log(e)
    },

    dateFormat (date, type) {
        var dates = date.split('-');
        if (type == 'month') {
          return dates[1].charAt(1);
        } else if (type == 'day') {
          return dates[2];
        }
    },
      
    timeFormat (start_time, end_time) { 
        if (start_time && end_time) {
          if (start_time.length > 5) {
            return start_time.split(' ')[1] + ' ~ ' + end_time.split(' ')[1]
          } else {
            return start_time + ' ~ ' + end_time
          }
        }
    },

    getWillDelete (item) { // will_delete_item
        let obj = {};
        let time = this.timeFormat(item.start_time, item.end_time);
        let content = item.content;
        let id = item.id;
        let month = this.dateFormat(item.date,'month');
        let day = this.dateFormat(item.date,'day');
        obj = {
            id: id,
            date: month + '月' + day + '日',
            time: time,
            content: content
        }
        this.setData({
            will_delete_item: obj
        })
    },

    yesDelete () {
        let _this = this
        wx.request( {
          url: app.globalData.url +"api/events/delete",
            headder: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "get", 
            data: {id: _this.data.will_delete_item.id},
            success: function( res ) {
              if (res.data.status == 200) {
                wx.showToast({
                    title: '删除成功',
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
                _this.getList();
              } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
              }
            } 
        })
    },

    delete (event) {
        let _this = this
        this.setData({
            showModal: true
        })
        let id = event.currentTarget.dataset.id;
        let item = event.currentTarget.dataset.item;
        this.getWillDelete(item);
    },

    edit (event) {
        let item = event.currentTarget.dataset.item;
        let id = item.id;
        let time = this.timeFormat(item.start_time, item.end_time).split('~');
        let start_time = time[0];
        let end_time = time[1];
        let content = item.content;
        let arr = item.date.split('-');
        let year = arr[0];
        let month = parseInt(arr[1].charAt(1));
        let day = parseInt(arr[2]);
        let type = item.type;
        if (item.cost) {
            var cost = item.cost;
        }
        wx.navigateTo({
            url: '../publish/publish?' + 'id=' + id + '&cost=' + cost + '&end_time=' + end_time + '&start_time=' + start_time + '&content=' + content + '&cur_date=' + day + '&cur_month=' + month + '&full_year=' + year + '&data_type=' + type
        })
    },

    getInnerContentHeight () { // 获取滚动内容总高度
        //创建节点选择器
        var query = wx.createSelectorQuery();
        query.select('.y').boundingClientRect()
        let that = this
        query.exec(function (res) {
            console.log(res);  
            console.log(res[0].height);
            that.setData({
                total_scroll: res[0].height
            })
        })
    },

    onPageScroll:function(e){
        console.log(e);//{scrollTop:99}
    },

    touchStart:function(e) {
        this.setData({
            lastX: e.touches[0].pageX, // 获取触摸时的原点
            lastY: e.touches[0].pageY
          })
        // 使用js计时器记录时间    
        this.data.interval = setInterval(() => {
        this.setData({
            time: this.data.time++
        })
        }, 100);
    },
    touchEnd (e) {
        let currentY = e.touches[0].pageY;
        let ty = currentY - this.data.lastY
        if (Math.abs(tx) < Math.abs(ty)) {
            if (ty < 0){
                let text = "向上滑动";
                this.data.flag= 3
                console.log(text)
            }
            else if (ty > 0) {
                let text = "向下滑动";
                this.data.flag= 4
                console.log(text)
            }
        }
    },

    onShow () {
        this.getList();
    },

    onLoad: function() {
        wx.setNavigationBarTitle({
            title: '我的日程'
        })
        this.getInnerContentHeight()
        this.setData({
            windowHeight: wx.getSystemInfoSync().windowHeight + 'px'
        })
        console.log('设备高度',wx.getSystemInfoSync().windowHeight);
        wx.createSelectorQuery().select('.finished').fields({
            dataset: true,
            size: true,
            scrollOffset: true,
            properties: ['scrollX', 'scrollY']
          }, function (res) {
            console.log(res);
            res.scrollLeft = 200;
          }).exec()
    }
})
