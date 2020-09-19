
 function dateCha(d1, d2, callback) {
    // 当调用 dateCha() 没有回调函数
    // callback = undefined
    var time1 = d1.getTime();
    var time2 = d2.getTime();

    if (time2 >= time1) {
        callback && callback();
        time2 = time1

    }
    var cha = Math.abs(time2 - time1);
    var day = parseInt(cha / 1000 / 60 / 60 / 24);
    day = day >= 10 ? day : '0' + day;
    var hours = parseInt(cha / 1000 / 60 / 60 - 24 * day);
    hours = hours >= 10 ? hours : '0' + hours;
    var min = parseInt(cha / 1000 / 60 - 60 * hours - 24 * day * 60);
    min = min >= 10 ? min : '0' + min;
    var sec = Math.floor(cha / 1000 - min * 60 - hours * 60 * 60 - day * 24 * 60 * 60);
    $("day").css("color", "red");
    sec = sec >= 10 ? sec : '0' + sec;

    return (`${day}<span>天</span>${hours}<span>时</span>${min}<span>分</span>${sec}<span>秒</span>`);

}