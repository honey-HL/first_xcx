function calculateDays(year, month, day) {

    var totaldays = 0;

    // 计算一年多少天
    for(var i = 1900;i < year;i++) {
        if((i % 4 == 0 && i % 100 != 0) || (i % 400 == 0)) {
            totaldays += 366;
        }else{
            totaldays += 365;
        }
    }

    // 是否是闰年 是1 否0
    var isrun = ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) ? 1 : 0;

    switch(month - 1) {
        case 11:
            totaldays += 30;
        case 10:
            totaldays += 31;
        case 9:
            totaldays += 30;
        case 8:
            totaldays += 31;
        case 7:
            totaldays += 31;
        case 6:
            totaldays += 30;
        case 5:
            totaldays += 31;
        case 4:
            totaldays += 30;
        case 3:
            totaldays += 31;
        case 2:
            isrun ? (totaldays += 29) : (totaldays +=28);
        case 1:
            totaldays += 31;
    }

    totaldays += day;

    switch(totaldays % 7) {
        case 1:
            return("周一");
            // break;
        case 2:
            return("周二");
            // break;
        case 3:
            return("周三");
            // break;
        case 4:
            return("周四");
            // break;
        case 5:
            return("周五");
            // break;
        case 6:
            return("周六");
            // break;
        case 0:
            return("周日");
            // break;
    }

}

module.exports.calculateDays = calculateDays