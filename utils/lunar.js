
var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
var nStr2 = new Array('初', '十', '廿', '三');
var solarTerm = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至");
var solarMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var weekString = "日一二三四五六";
var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
var tgString = "甲乙丙丁戊己庚辛壬癸";
var dzString = "子丑寅卯辰巳午未申酉戌亥";
var cYear, cMonth, cDay, TheDate;
var lunarInfo = new Array(
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0)
  var sTermInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758);
  
  // 放假的节气
  const ofd = {
    '清明': 3
  }
  //公历节日
 var sFtv = new Array(
  "0101 元旦",
  "0214 情人节",
  "0308 妇女节",
  "0312 植树节",
  "0315 消费者权益日",
  "0401 愚人节",
  "0501 劳动节",
  "0504 青年节",
  "0512 护士节",
  "0601 儿童节",
  "0701 建党节",
  "0801 建军节",
  "0910 教师节",
  "0928 孔子诞辰",
  "1001 国庆节",
  "1006 老人节",
  "1024 联合国日",
  "1224 平安夜",
  "1225 圣诞节")
//农历节日
var lFtv = new Array(
  "0101 春节",
  "0115 元宵节",
  "0505 端午节",
  "0707 七夕情人节",
  "0715 中元节",
  "0815 中秋节",
  "0909 重阳节",
  "1208 腊八节",
  "1224 小年")

  // if (solarTerms === '清明' || this.solarFestival === '劳动节') {
  //   this.offday = true;
  // }

 //返回某年的第n个节气为几日(从0小寒起算)
  function sTerm(y, n) {
    var offDate = new Date((31556925974.7 * (y - 1900) + sTermInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
    return (offDate.getUTCDate())
  }

 //记录公历和农历某天的日期
 function calElement(sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, lunarDate, zodiacSign) {
  this.zodiacSign = zodiacSign // 生肖
  this.isToday = false;
  //公历
  this.sYear = sYear;
  this.sMonth = sMonth;
  this.sDay = sDay;
  this.week = week;
  //农历
  this.lYear = lYear;
  this.lMonth = lMonth;
  this.lDay = lDay;
  this.isLeap = isLeap;
  this.lunarDate = lunarDate // 农历日期
  //节日记录
  this.lunarFestival = ''; //农历节日
  this.solarFestival = ''; //公历节日
  this.solarTerms = ''; //节气
  // 休假
  this.offday = ''
  this.workday = ''
}

 //返回农历y年m月的总天数
 function monthDays(y, m) {
  return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
}

//判断y年的农历中那个月是闰月,不是闰月返回0
function leapMonth(y) {
  return (lunarInfo[y - 1900] & 0xf);
}

//返回农历y年闰月的天数
function leapDays(y) {
  if (leapMonth(y)) return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
  else return (0);
}

//返回公历y年m+1月的天数
function solarDays(y, m) {
  if (m == 1)
      return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
  else
      return (solarMonth[m]);
}

 //算出当前月第一天的农历日期和当前农历日期下一个月农历的第一天日期
 function Dianaday(objDate) {
  var i, leap = 0, temp = 0;
  var baseDate = new Date(1900, 0, 31);
  var offset = (objDate - baseDate) / 86400000;
  this.dayCyl = offset + 40;
  this.monCyl = 14;
  for (i = 1900; i < 2050 && offset > 0; i++) {
      temp = lYearDays(i)
      offset -= temp;
      this.monCyl += 12;
  }
  if (offset < 0) {
      offset += temp;
      i--;
      this.monCyl -= 12;
  }
  this.year = i;
  this.yearCyl = i - 1864;
  leap = leapMonth(i); //闰哪个月
  this.isLeap = false;
  for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i == (leap + 1) && this.isLeap == false) {    //闰月
          --i; this.isLeap = true; temp = leapDays(this.year);
      }
      else {
          temp = monthDays(this.year, i);
      }
      if (this.isLeap == true && i == (leap + 1)) this.isLeap = false;    //解除闰月
      offset -= temp;
      if (this.isLeap == false) this.monCyl++;
  }
  if (offset == 0 && leap > 0 && i == leap + 1)
      if (this.isLeap) { this.isLeap = false; }
      else { this.isLeap = true; --i; --this.monCyl; }
  if (offset < 0) { offset += temp; --i; --this.monCyl; }
  this.month = i;
  this.day = offset + 1;
}

//返回农历y年的总天数
function lYearDays(y) {
  var i, sum = 348;
  for (i = 0x8000; i > 0x8; i >>= 1)sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
  return (sum + leapDays(y));
}

//用中文显示农历的日期
function nongliDay(lM, lD, SM, SD, sD, fat, mat) {
  // lM 农历月份
  // lD 农历日期
  // SM 公历月份
  // SD 公历日期
  let s;
  // var i, sD, s, size;
  let _d = parseInt(lD);
  let Slfw;let Ssfw;

  if ((SM + 1) == 5) {    //母亲节
      if (fat == 0) {
          if ((sD + 1) == 7) { Ssfw = "母亲节"; return  Ssfw;}
      }
      else if (fat < 9) {
          if ((sD + 1) == ((7 - fat) + 8)) { Ssfw = "母亲节"; return  Ssfw; }
      }
  }
  if ((SM + 1) == 6) {    //父亲节
      if (mat == 0) {
          if ((sD + 1) == 14) { Ssfw = "父亲节"; return  Ssfw;}
      }
      else if (mat < 9) {
          if ((sD + 1) == ((7 - mat) + 15)) { Ssfw = "父亲节"; return  Ssfw;}
      }
  }

  for (let ipp = 0; ipp < lFtv.length; ipp++) {    //农历节日
    if (parseInt(lFtv[ipp].substr(0, 2)) === parseInt(lM)) {
        if (parseInt(lFtv[ipp].substr(2, 4)) === parseInt(lD)) {
            Slfw = lFtv[ipp].substr(5);
            return Slfw;
        }
    }
    if (12 == (lM)) {    //判断是否为除夕
      if (eve == parseInt(lD)) {Slfw = "除夕"; return Slfw}
    }
  }
  
  for (let ipp = 0; ipp < sFtv.length; ipp++) {    //公历节日
    if (parseInt(sFtv[ipp].substr(0, 2)) == (SM + 1)) {
      if (parseInt(sFtv[ipp].substr(2, 4)) == SD) {
          Ssfw = sFtv[ipp].substr(5);
          s = Ssfw
          return s;
      }
    }
  }
  

  switch (_d) {
      case 10:
          s = '初十';
          break;
      case 20:
          s = '二十';
          break;
      case 30:
          s = '三十';
          return s;
          break;
      default:
          s = nStr2[Math.floor(lD / 10)];
          // s += nStr1[d % 10];
          s += nStr1[parseInt(lD % 10)];
          break;
  }
  return (s);
}

function drawCld(SY, SM) {
  let cld = new calendar(SY, SM);
  console.log('cld===>',cld)
   return cld
}

//保存y年m+1月的相关信息
var mat;
var fat = mat = 9;
var eve = 0;
function calendar(y, m) {
  fat = mat = 0;
  var sD, sDObj,lastDateObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2;
  var lDPOS = new Array(3);
  var n = 0;
  var firstLM = 0;
  sDObj = new Date(y, m, 1);    //当月第一天的日期
  lastDateObj = new Date(y, m + 1, 0);;//获得当月最后一天的日期
  this.length = solarDays(y, m);    //公历当月天数
  this.firstWeek = sDObj.getDay();    //公历当月1日星期几
  this.lastWeek = lastDateObj.getDay();    //公历当月最后一天星期几

  if ((m + 1) == 5) { fat = sDObj.getDay() }
  if ((m + 1) == 6) { mat = sDObj.getDay() }
  for (let i = 0; i < this.length; i++) {
    sD = i - this.firstWeek;
  // debugger
    let lunarDate;
    let  zodiacSign='';
      if (lD > lX) {
          sDObj = new Date(y, m, i + 1);    //当月第一天的日期
          lDObj = new Dianaday(sDObj);     //农历
          lY = lDObj.year;           //农历年
          lM = lDObj.month;          //农历月
          lD = lDObj.day;            //农历日
          lL = lDObj.isLeap;         //农历是否闰月
          lX = lL ? leapDays(lY) : monthDays(lY, lM); //农历当月最后一天
          if (lM == 12) { eve = lX }
          if (n == 0) firstLM = lM;
          lDPOS[n++] = i - lD + 1;
      }
      zodiacSign += tgString.charAt((lY - 4) % 10);
      zodiacSign += dzString.charAt((lY - 4) % 12);
      zodiacSign += sx.charAt((lY - 4) % 12);
      lunarDate = nongliDay(lM, lD,m, i + 1, sD, fat, mat)
      this[i] = new calElement(y, m + 1, i + 1, nStr1[(i + this.firstWeek) % 7], lY, lM, lD++, lL, lunarDate, zodiacSign);
      if ((i + this.firstWeek) % 7 == 0) {
          this[i].color = 'red';  //周日颜色
      }
      // 劳动节
      if (this[i].sMonth == 5 && parseInt(this[i].sDay)+1 <= 5) {
        this[i].offday = true
      }
  }
  //节气
  tmp1 = sTerm(y, m * 2) - 1;
  tmp2 = sTerm(y, m * 2 + 1) - 1;
  this[tmp1].solarTerms = solarTerm[m * 2];
  this[tmp2].solarTerms = solarTerm[m * 2 + 1];
  console.log('this[tmp1].solarTerms==>',this[tmp1].solarTerms)
  console.log('this[tmp2].solarTerms===>',this[tmp2].solarTerms)
  // 24节气的放假
  if (this[tmp1].solarTerms === '清明') {
    this[tmp1].offday = true;
    this[tmp1-1].offday = true;
    this[tmp1-2].offday = true;
    this[tmp1-3].workday = true;
  }

  if ((this.firstWeek + 12) % 7 == 5) {//黑色星期五
      this[12].solarFestival += '黑色星期五';
  }
  if (y == tY && m == tM) {
      this[tD - 1].isToday = true;    //今日
  }
}

//在下拉列表中选择年月时,调用自定义函数drawCld(),显示公历和农历的相关信息
function changeCld() {
  var y, m;
  y = CLD.SY.selectedIndex + 1900;
  m = CLD.SM.selectedIndex;
  drawCld(y, m);
}

var Today = new Date();
var tY = Today.getFullYear();
var tM = Today.getMonth();
var tD = Today.getDate();
function showCal(cur_year, cur_month) {
  return drawCld(cur_year, cur_month - 1)
}

module.exports.showCal = showCal