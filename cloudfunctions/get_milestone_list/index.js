// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

const db = cloud.database()

const getDaysDistance = (year,month,day, dateEnd) => {     
  const isStr = typeof(dateEnd) === 'string'
  let d =  isStr? dateEnd.split('-'):dateEnd;
  let date1;
  if (!isStr) {
    date1 = dateEnd;
  } else {
    date1 = new Date(parseInt(d[0]),parseInt(d[1])-1,parseInt(d[2]));
    
  }
  const date2 = new Date(year,month-1,day);
  const date = (date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000);
  return isStr? Math.ceil(date) + 1 : Math.ceil(date);
}

// 云函数入口函数
exports.main = async (event, context) => {
  const filter = event.filter;
  let { data } = await db.collection('milestone_list').orderBy('create_time','desc').where(filter).get();

  const milestone_data = data.map(milestone => {
    if (milestone.status === 'pending') {
      const { start: { year, month, date } } = milestone;
      const new_days = getDaysDistance(year, month, date, new Date());
      return {
        ...milestone,
        days: new_days
      }
    }
    return milestone;
  })
  return milestone_data;
}