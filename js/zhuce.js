$('.ok').click(function () {
    $('.zc').hide()
    $('.zc1').hide()
})

let phone = document.querySelector('#phone')
let password = document.querySelector('#password')
let tet2 = document.querySelector('#tet2')
let repassword = document.querySelector('#repassword')
let yanz = document.querySelector('#yanzheng')
let btn = document.querySelector('.btn')
let form = document.querySelector('form')



window.load = function () {
    elsee.preventDefault();
}
tet2.onclick = function (e) {
    var e = e || window.event
    e.cancelBubble = true;
    num = parseInt(Math.random() * 900000 + 100000);
    tet2.innerHTML = num

}
yanz.onclick = function (e) {
    var e = e || window.event
    e.cancelBubble = true;
}

window.onclick = function () {
    let str2 = phone.value;
    let str3 = password.value;
    let str1 = repassword.value;
    

    fn3()
    function fn2() {
        if (str2) {
            var reg2 = /^1[35789]\d{9}$/
            if (reg2.test(str2) === false) {
                tx1.style.display = 'block'
            } else if (reg2.test(str2) === true) {
                tx1.style.display = 'none'
            }

            return reg2.test(str2)
        }
    }

    function fn3() {
        if (str3) {
            var reg3 = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,14}$/
            if (reg3.test(str3) === false) {
                tx3.style.display = 'block'

            } else if (reg3.test(str3) === true) {
                tx3.style.display = 'none'
            }
            // console.log(reg3.test(str3));
            return reg3.test(str3)
        }
    }


    if (yanz.value) {
        if (yanz.value != tet2.innerHTML) {
            $('#tx2').show()
        } else {
            $('#tx2').hide()
        }
    }


    if (str1) {
        if (str1 != str3) {
            $('#tx4').show()
        } else {
            $('#tx4').hide()
        }
    }


    if (fn2() == true && fn3() == true && yanz.value == tet2.innerHTML && str1 == str3) {
        btn.disabled = false

        form.onsubmit = async function (e) {
            e = e || window.event;
            e.returnValue = false;
            e.preventDefault();

            // 发送ajax请求判断手机号是否存在
            let res = await pAjax({
                url: '../api/zhuce.php',
                type: 'POST',
                data: {
                    phone: phone.value,
                    password: password.value
                }
            })
            console.log(res);
            if (res.code === 1) {
                // 表示注册成功,跳转到登录页面
                $('#tx5').hide()
                alert('注册成功，可以直接登录')
                window.location.href = './login.html'
            } else if (res.code === 0) {
                // alert('该手机号已经注册，请直接登录')
                $('#tx5').show()
            }
        }
    }



}