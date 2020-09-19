// 切换不同的登录版块
$('#radio1').click(function () {
    $('.tab1').show()
    $('.tab2').hide()
})
$('#radio2').click(function () {
    $('.tab2').show()
    $('.tab1').hide()
})


// 打开登录页面，如果已经登录过，应该直接去首页
let login = getCookie('login');
console.log(login);
if (login) {
    window.location.href = '../index.html'

}

// 获取元素
let phone1 = document.querySelector('#phone1');
let phone2 = document.querySelector('#phone2');
let password = document.querySelector('#password');
let tab1 = document.querySelector('.tab1')
let tab2 = document.querySelector('.tab2')
let tet2 = document.querySelector('#tet2')
let yanz = document.querySelector('#yanzheng')
let btn1 = document.querySelector('.btn1')
let btn2 = document.querySelector('.btn2')

// 点击页面时的验证
window.load = function (e) {
    e.preventDefault();
}
// 获取随机验证码
tet2.onclick = function (e) {
    var e = e || window.event
    // e.cancelBubble = true;
    num = parseInt(Math.random() * 9000 + 1000);
    tet2.innerHTML = num
}

window.onclick = function () {
    let str1 = phone1.value;
    let str2 = phone2.value;
    let str3 = password.value;

    // 验证版块1手机号
    function fn1() {
        if (str1) {
            var reg1 = /^1[35789]\d{9}$/
            if (reg1.test(str1) === false) {
                $('#tx1').show()
            } else if (reg1.test(str1) === true) {
                $('#tx1').hide()
            }

            return reg1.test(str1)
        }
    }

    // 验证版块2手机号
    function fn2() {
        if (str2) {
            console.log(str2);
            var reg2 = /^1[35789]\d{9}$/
            if (reg2.test(str2) === false) {
                console.log($('#tx6'));
                $('#tx6').show()
            } else if (reg2.test(str2) === true) {
                $('#tx6').hide()
            }
            console.log(reg2.test(str2));
            return reg2.test(str2)
        }
    }
    // 验证密码
    function fn3() {
        if (str3) {
            var reg3 = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,14}$/
            console.log(str3);
            console.log(reg3.test(str3));
            if (reg3.test(str3) === false) {
                tx3.style.display = 'block'

            } else if (reg3.test(str3) === true) {
                tx3.style.display = 'none'
            }
            return reg3.test(str3)
        }
    }
    // 验证验证码啊部分
    if (yanz.value) {
        if (yanz.value != tet2.innerHTML) {
            $('#tx2').show()
        } else {
            $('#tx2').hide()
        }
    }

    // 该部分为手机动态登录验证，通过数据库验证
    if (fn1() == true && yanz.value == tet2.innerHTML) {
        tab1.onsubmit = async function (e) {
            e = e || window.event;
            e.returnValue = false;
            e.preventDefault();
            let res = await pAjax({
                url: '../api/login1.php',
                type: 'POST',
                data: {
                    phone: phone1.value,
                }
            })

            if (res.code === 1) {
                // 表示注册成功,跳转到登录页面
                $('#tx7').hide()
                setCookie('login', phone1.value)
                // 还需把url地址切回刚刚来的页面
                let reg = /pathname=(.*)/;
                if (reg.test(window.location.search)) {
                    console.log(5);
                    window.location.href = reg.exec(window.location.search)[1];
                } else {
                    console.log(3);
                    setCookie('login', phone1.value)
                    window.location.href = '../index.html'
                }
            } else if (res.code === 0) {
                $('#tx7').show()
            }
        }
    }

    // 该部分为手机普通登录，通过数据库验证
    if (fn2() == true && fn3() == true) {
        tab2.onsubmit = async function (e) {
            console.log(7);
            e = e || window.event;
            e.returnValue = false;
            e.preventDefault();

            let res = await pAjax({
                url: '../api/login2.php',
                type: 'POST',
                data: {
                    phone: phone2.value,
                    password: password.value
                }
            })
            console.log(res);
            if (res.code === 1) {
                // 表示注册成功,跳转到登录页面
                $('#tx6').hide()
                setCookie('login', phone1.value)
                // 还需把url地址切回刚刚来的页面
                let reg = /pathname=(.*)/;
                if (reg.test(window.location.search)) {
                    window.location.href = reg.exec(window.location.search)[1];
                } else {
                    setCookie('login', phone2.value)
                    window.location.href = '../index.html'
                }
            } else if (res.code == 0) {
                $('#tx6').show()
                $('#tx6')[0].innerHTML = '手机号或密码不正确,重新输入'

            }
        }
    }

}