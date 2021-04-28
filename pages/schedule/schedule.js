const app = getApp();

Page({
    data: {
      slideButtons: [{
        text: '编辑',
        extClass: 'finished_btn'
      },
      // {
      //   text: '未完成',
      //   extClass: 'unfinished_btn',
      //   // src: '/page/weui/cell/icon_star.svg', // icon的路径
      // },
      {
        type: 'warn',
        text: '删除',
        extClass: 'delete_btn',
          // src: '/page/weui/cell/icon_del.svg', // icon的路径
      }],
      pageIndex: 1,
      pageSize: 20,
      hasMore: false,
      list: [],
      changed_list: [],
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
      const {list, pageIndex, pageSize} = this.data;
      const _this = this;
      let temp = [];
      let end_res = []
      const openid = wx.getStorageSync('openid')
      wx.cloud.callFunction({
        name: 'get_schedule_list',
        data: {
          filter: {
            event_type: 'schedule',
            _openid: openid,
          },
          dbName: 'todo_list',
          pageIndex,
          pageSize
        }
      }).then((res) => {
        console.log('res===>',res)
            const results = res.result.data;
            results.map((item, i) => {
              if (temp.indexOf(item.date) === -1) {
                temp.push(item.date);
                end_res.push({
                  date: item.date,
                  dt: [item]
                })
              } else {
                end_res.forEach((end, j) => {
                  if (end.date === item.date) {
                      end_res[j].dt.push(item);
                  }
                })
              }
            })
            console.log('after==end_res==>',end_res)
            _this.setData({
              pageIndex: !res.result.hasMore ? pageIndex: pageIndex + 1,
              hasMore: res.result.hasMore,
              list: !list.length ? end_res: list.concat(list)
            })
      })
    },

    onReachBottom () {
      const {hasMore} = this.data;
      if (hasMore) {
        this.getList()
      } else {
        wx.showToast({
          title: '已经到底部了',
        })
      }
      wx.showToast({
        title: '触发上拉加载',
      })
    },

    onPullDownRefresh(){ 
      this.setData({pageIndex: 1});
      getList()
      wx.showToast({
        title: '下拉刷新',
      })
      wx.stopPullDownRefresh()
    },

    upper(e) {
        console.log(e)
    },
    lower(e) {
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

    updateList () {
      const db = wx.cloud.database();
      const changed_list = this.data.changed_list;
      console.log('changed_list==>',changed_list)
      const need_update = changed_list.filter(item => (item.schedule_type + '') !== (item.origin_schedule_type + ''));
      console.log('need_update==>',need_update)
      need_update.forEach(cur_item => {
        db.collection('todo_list').where({
          _openid: wx.getStorageSync('openid'),
          _id: cur_item._id
        }).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            schedule_type: cur_item.schedule_type,
          },
          success: function(res) {
            console.log(res.data)
            // _this.getList()
          }
        })
      })
    },

    goDetail (item) {
      console.log('detail',item)
    },

    onScheduleChange (event) {
      const _this = this;
      const cur_item = event.currentTarget.dataset.item;
      const _origin_schedule_type = cur_item.schedule_type;
      const changed_list = this.data.changed_list || [];
      console.log('_cur==>',cur_item)
      const _new_list = this.data.list.map(item => {
        if (item.date === cur_item.date) {
          const dt = item.dt.map(day => {
            if (day._id == cur_item._id) {
              const new_item = {
                ...day,
                schedule_type: cur_item.schedule_type == 1 ? 0: 1,
              }
              changed_list.push({
                origin_schedule_type: _origin_schedule_type,
                ...new_item
              })
              return new_item;
            }
            return day;
          })
          return {
            date: cur_item.date,
            dt: dt
          };
        }
        return item;
      })
      console.log('_new_list==>',_new_list)
      console.log('changed_list==>',changed_list)
      this.setData({list: _new_list, changed_list})
   

      // const db = wx.cloud.database();
      // db.collection('todo_list').where({
      //   _openid: wx.getStorageSync('openid'),
      //   _id: cur_item._id
      // }).update({
      //   // data 传入需要局部更新的数据
      //   data: {
      //     // 表示将 done 字段置为 true
      //     schedule_type: cur_item.schedule_type == 1 ? 0: 1,
      //     done: true
      //   },
      //   success: function(res) {
      //     console.log(res.data)
      //     _this.getList()
      //   }
      // })
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

    // onPageScroll:function(e){
    //     console.log(e);//{scrollTop:99}
    // },

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

    onHide () {
      this.updateList()
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
