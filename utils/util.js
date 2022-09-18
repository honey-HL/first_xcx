const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getInitialPicker = () => {
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
  const initialPicker = {
    year: thisYear,
    month: thisMonth,
    date: thisDay,
    hour: thisHour,
    minute: thisMinute
  }
  return initialPicker;
}

const daysDistance = (startDate, endDate) => {     
  const end = new Date(endDate.year, endDate.month-1,endDate.date);
  const start = new Date(startDate.year, startDate.month-1,startDate.date);
  const days = (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil(days);
}

module.exports = {
  daysDistance: daysDistance,
  getInitialPicker: getInitialPicker,
  formatTime: formatTime
}
