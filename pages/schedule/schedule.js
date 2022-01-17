const app = getApp();

Page({
    data: {
      /***即将删除的***/
      willDeleteItem: "",
      navHeight: app.globalData.navHeight + 10, //导航栏高度
      modal: {
        show: false,
        cancelColor: '#fff',
        confirmColor: '#fff',
        showCancel: true,
        content: [{text: '删除了就再也找不回来了～'}],
        title: '确定删除此记录?'
      },
      isSearch: false,  // 是不是搜索功能
      searchKey: '', // 搜索框输入的关键字
      delPopShow: true, // 删除确认弹窗显示
      slideButtons: [{
        text: '编辑',
        extClass: 'edit_btn'
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
      hasMore: true,
      raw_list: [],
      list: [],
      isNewUser: false,
      showLoading: false,
      showPullDown: false,
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

    bindKeyInput: function (e) {
      this.setData({
        searchKey:  e.detail.value,
       })
    },

    /********搜索数据********/
    onSearch () {
      this.setData({isSearch: true, raw_list: [], list: [],pageIndex: 1}, () => {
        this.getList()
      })
    },

    async getList () {
      const {isSearch, searchKey, raw_list, pageIndex, pageSize} = this.data;
      const db = wx.cloud.database;
      const _this = this;
      let temp = [];
      let end_res = []
      let _raw_list = []
      let results= []
      const openid = wx.getStorageSync('openid')
      let filters = {
        event_type: 'schedule',
        _openid: openid,
      }
    
      wx.cloud.callFunction({
        name: 'get_schedule_list',
        data: {
          filter: filters,
          dbName: 'todo_list',
          isSearch,
          searchKey,
          pageIndex,
          pageSize
        }
      }).then((res) => {
        console.log('res===>',res)
        if (!res.result.total) {
          // this.setData({isNewUser: true})
          return
        } else {
          if (raw_list.length === 0 || isSearch) {
            _raw_list =  res.result.data
            results = _raw_list
          } else {
            _raw_list = raw_list.concat(res.result.data)
            results = _raw_list
          }
            console.log('results===>',results)
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
              isNewUser: false,
              showLoading: false,
              showPullDown: false,
              raw_list:_raw_list,
              pageIndex: !res.result.hasMore ? pageIndex: pageIndex + 1,
              hasMore: res.result.hasMore,
              list: end_res
            })
        }
      })
    },

    onReachBottom () {
      const {hasMore} = this.data;
      if (hasMore) {
        this.setData({
          showLoading: true,
        }, () => {
          this.getList()
        })
      } 
      // else {
        // wx.showToast({
        //   title: '已经到底部了',
        // })
      // }
      // wx.showToast({
      //   title: '触发上拉加载',
      // })
    },

    goCreate () {
      const type = 'schedule';
      const date = new Date();
      const cur_date = date.getDate();
      const cur_month = date.getMonth() + 1;
      const full_year = date.getFullYear();
      wx.navigateTo({
        url: '../new_schedule/new_schedule?cur_date=' + cur_date + '&cur_month=' + cur_month + '&' + 'full_year=' + full_year + '&type=' + type
      })
    },

    onPullDownRefresh(){ 
      const _this = this;
      if (!this.data.isNewUser) {
        this.setData({pageIndex: 1, showPullDown: true, raw_list: []}, () => {
          _this.getList()
        });
      }
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

    slideButtonTap (data) {
      const {slideButtons} = this.data;
      const cur_item = data.currentTarget.dataset.item;
      const index = data.detail.index;
      const text = slideButtons[index].text;
      if (text === '编辑'){
        this.onEdit(cur_item)
      } else if (text === '删除'){
        this.onDelete(cur_item)
      }
    },

    /********编辑*******/
    onEdit (cur_item) {
      debugger
    },

    /**
   * 打开弹框
   */
  showDelConfirmModal () {
    let objModal = {
      show: true,
      showCancel: true,
      cancelColor: '#fff',
      confirmColor: '#fff',
      title: '确定删除此记录?',
      content: [{text: '删除了就再也找不回来了～'}]
      // height: '70%',
      // confirmText: '我知道了'
    }
    this.setData({
      modal: objModal
    })
  },

    /**
   * 弹框按钮操作事件
   * @res 取消/确定按钮的相关信息
   */
  modalOperate (res) {
    if (res.detail.res == 'confirm') {
      this.sureToDelete()
    } else if (res.detail.res == 'cancel') {
      console.log('cancel')
    }
  },

  async sureToDelete() {
    const {willDeleteItem, list, raw_list} = this.data;
    const _this = this;
    let _list = list
    let _raw_list = raw_list
    const db = wx.cloud.database();
    await db.collection('todo_list').where({
      _openid: wx.getStorageSync('openid'),
      _id: willDeleteItem._id
    }).remove().then(res => {
      _raw_list = _raw_list.filter(it => it._id !== willDeleteItem._id)
      _list= _list.map(item => {
        if (item.date === willDeleteItem.date) {
          if (item.dt.length > 1) {
            const remain = item.dt.filter(it => it._id !== willDeleteItem._id)
            return {date: willDeleteItem.date, dt: remain}
          } else {
            return
          }
        } else {
          return item
        }
      }).filter(item => item)
      _this.setData({
        list: _list,
        raw_list: _raw_list
      })
    })
  },

     /********删除*******/
     onDelete (cur_item) {
       this.showDelConfirmModal()
       this.setData({willDeleteItem: cur_item})
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
      this.getList()
      // const _this = this;
      // this.setData({pageIndex: 1, raw_list: []}, () => {
      //   _this.getList()
      // });
    },

    onHide () {
      this.updateList()
      this.setData({
        searchKey: '',
        isSearch: false,
        pageIndex: 1,
        raw_list: [],
        list: [],
        hasMore: true,
      })
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
