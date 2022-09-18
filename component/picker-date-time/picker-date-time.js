const {bus} = require('../../utils/bus.js');
const util = require('../../utils/util.js')

const date = new Date();

const thisYear = date.getFullYear();
const thisMonth = date.getMonth() + 1;
const thisDay = date.getDate();
const curHour = date.getHours();
const curMinute = date.getMinutes();
const thisHour = curHour >= 10 ? curHour + '': '0'+curHour;
const thisMinute = curMinute >= 10 ? curMinute +'': '0'+curMinute;

const years = []
const months = []
const days = []

for(let i = (thisYear-10); i < (thisYear + 10); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
let hours = [];
for (let i = 0; i <= 24; i++) {
  if (i<10) {
    hours.push('0' + i)
  } else {
    hours.push(i + '')
  }
}
let minutes = [];
for (let i = 0; i <= 59; i++) {
  if (i<10) {
    minutes.push('0' + i)
  } else {
    minutes.push(i + '')
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pickerType: {
      type: String
    },
    getPicker: {
      type: Function
    },
    picker: {
      type: Object,
    },
    pickerArr: {
      type: Array
    },
    pickerLabel: {
      type: String,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    initialPicker: {
      year: thisYear,
      month: thisMonth,
      date: thisDay,
      hour: thisHour,
      minute: thisMinute
    },
    show: false,
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    year: date.getFullYear(),
    value: [10, 0, 1], // index
  },

  lifetimes: {
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log(this.properties.picker)
  },
    attached: function() {
    
      const { years, months, days,  hours, minutes, picker, initialPicker } = this.properties;

      let pickerCur = {};
      if (picker == null) { // 之前没有设置过年月日时分
        pickerCur = initialPicker
      } else {
        pickerCur = picker
      }
      const { year, month, date, hour, minute } = pickerCur
     console.log(this.properties.picker)
       
     
      const yearIndex = years.indexOf(year);
      const monthIndex = months.indexOf(month);
      const dateIndex = days.indexOf(date);
      const hourIndex = hours.indexOf(hour);
      const minuteIndex = minutes.indexOf(minute);
      const dataIndexArr = [yearIndex, monthIndex, dateIndex, hourIndex, minuteIndex];
      console.log(dataIndexArr, this.properties)
      
      this.setData({ value: dataIndexArr });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function (e) {
      const val = e.detail.value
      
      this.setData({
        value: val,
        picker: {
          year: this.data.years[val[0]],
          month: this.data.months[val[1]],
          date: this.data.days[val[2]],
          hour: this.data.hours[val[3]],
          minute: this.data.minutes[val[4]],
        }
      }, () => {
        const { picker, pickerType } = this.data;
        console.log(this.data)
        console.log(this.properties)

        const param = {
          pickerType,
          picker
        }
        bus.emit('onGetPicker', param)
        
        // this.properties.getPicker(this.data.picker)
      })
    },
    onExpandPicker () {
      const { show } = this.data;
      this.setData({show: !show})
    }
  }
})
