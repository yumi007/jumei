/**
 * @param {string} key  cookie的属性
 * @param {string} value cookie属性对应的值
 * @param {number } expires 过期时间的 秒数 当expires的值为负数的时候，那么就表示是删除
 */
function setCookie(key, value, expires) {
    /* 当前的+8时区的当前时间 */
    let time = new Date();
    let t = time.getTime() - 8 * 60 * 60 * 1000 + expires * 1000;
    time.setTime(t);
    document.cookie = `${key}=${value};expires=` + time + ';path=/';
}

/**
 * @param {string} key  你要获取cookie那哪个属性的属性值
 */
function getCookie(key) {
    let str = document.cookie.split('; ');
    // ["b=10", "a=20", "c=30"]
    let value = '';
    str.forEach(item => {
        let arr = item.split('=');
        // ["a",10]
        if (arr[0] === key) {
            value = arr[1];
        }
    })

    return value;
}