// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const dbName = event.dbName;
  const isSearch = event.isSearch;
  const searchKey = event.searchKey;
  const _key = event.key;
  let filter = event.filter ? event.filter: null;
  if (isSearch && searchKey) {
    filter = {
      ...filter,
      [_key]: db.RegExp({
        regexp: searchKey,
        options: 'i',
      })
    }
  }
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
  console.log('filter=====>',filter)
  
  
  let res = await db.collection(dbName).orderBy('date','desc').where(filter).skip((pageIndex - 1)*pageSize).limit(pageSize).get();
  
  // console.log('get_schedule_list res===>',res)

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