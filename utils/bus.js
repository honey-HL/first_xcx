let bus = {};
// 添加一个事件
bus.on = function (key, func) {
    if(!bus[key]){
        bus[key] = [func];
    }else{
        bus[key].push(func)
    }
}
// 触发一个事件
bus.emit = function (key, params) {
    if(!bus[key]) return;
    for(let v of bus[key]){
      v(params)
    }
  }
  // 移除一个事件
  bus.off = function (key) {
    bus[key] && delete bus[key];
  }
  
  module.exports.bus = bus