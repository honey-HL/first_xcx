// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const dbName = event.dbName;
  const filter = event.filter ? event.filter: null;
  const pageIndex = event.pageIndex ? event.pageIndex:1;
  const pageSize = event.pageSize ? event.pageSize: 20;
  const countResult = await db.collection(dbName).where(filter).count();
  const total = countResult.total;
  const totalPage = Math.ceil(total / pageSize);
  var hasMore;
  if (pageIndex > totalPage || pageIndex == totalPage) {
    hasMore = false;
  } else {
    hasMore = true;
  }
  let res = await db.collection(dbName).orderBy('date','desc').where(filter).skip((pageIndex - 1)*pageSize).limit(pageSize).get();
  res = {
    ...res,
    total,
    totalPage,
    hasMore,
    pageIndex,
    pageSize
  }

  return res;
}