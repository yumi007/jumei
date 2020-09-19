// 页头部分‘更多’的划过事件
$('.more').hover(function () {
    $('.more ul').show()
}, function () {
    $('.more ul').hide()
})

// lis1的划入划出事件
$('.lis1').hover(function () {
    $('.lis1 ul').show()
}, function () {
    $('.lis1 ul').hide()
})

// 导航部分 lis2 的下拉事件
$('.lis2').hover(function () {
    $('.lis2>.con').finish().slideDown()
}, function () {
    $('.lis2>.con').finish().slideUp()
})
$('.lis2 li').slice(1, 4).css("borderBottom", "1px #ddd solid");

// 购物车的下拉列表
$('.car').hover(function () {
    $('.smallCar').show()
}, function () {
    $('.smallCar').hide()
})

let text = document.querySelector('.text')
let detailimg = document.querySelector('.detailimg')
let introduce = document.querySelector('.introduce')
let login_1 = document.querySelector('.login_1')




login_1.onclick = function () {
    window.location.href = './login.html?pathname=' + window.location.href;
}

// 登录传上用户号码
let login = getCookie('login');
let smallCar = document.querySelector('.smallCar')
let totalNum, totalPrice

// 当登录后，获取本地储存中购物车的数据


if (login) {
    let carData = JSON.parse(localStorage.getItem('carData'));
    renderCar(carData)
    fun(carData)

    $('.dl')[0].innerHTML = `欢迎来到聚美！
    <a style="color: #ed145b;" href="">${login}</a>&nbsp;<span><a class='exit'  href="">[退出]</a></span>`

    let exit = document.querySelector('.exit')
    exit.onclick = function () {
        setCookie('login', login, -1)
    }
}

// 判断url地址是否携带id参数
let reg = /id=(\d+)/;
let goods_id;



// // 获取传过来的id
goods_id = reg.exec(window.location.search)[1] * 1;
// console.log(goods_id);
getData(goods_id)

async function getData(id) {
    let res = await pAjax({
        url: 'http://localhost/project/api/data.json',
        data: {
            id
        }
    })
    console.log(res.list[goods_id - 1]);
    render(res.list[goods_id - 1])
}

function render(data) {
    text.innerHTML =
        `   
    <p class="title">${data.deal_tit}</p>
    <p class="price"> ￥ <span>${data.price_home} </span></p>
    <p class="time"><i class="iconfont icon-naozhong
  "></i> <span id="box" style="font-size: 12px;"></span></p>
    <p class="yunfei">运费<span>新人包邮</span></p>
    <ul class="serve">
      <li>服务</li>
      <li><a href="">质量保险</a></li>
      <li><a href="">本商品不支持退货</a></li>
      <li><a href="">本商品不支持换货</a></li>
      <li><a style="border-right: none;" href="">闪电发货</a></li>
    </ul>
    <p class="type">型号<span>${data.type}</span> </p>
    <p class="button"> <button id="reduce">-</button><span class="carnum">1</span><button id="add">+</button></p>
    <button id="addCar"><i class="iconfont icon-gouwuchekong"></i>加入购物车</button>
    <p class="num"><i class="iconfont icon-geren"></i><span style="color: red;">1019</span><span style="color: black;"> 人已购买</span></p>
    <p class="tip">本商品非自营，由<span style="color: red;">鸿蒙电子商务 (营业执照)</span> 直接发货并提供售后服务，您在购买过程中有任何疑问可咨询聚美客服。</p>`



    introduce.innerHTML = data.deal_tit;
    detailimg.innerHTML = data.detail;

    let goodlist = [{
        small: data.smallimg,
        medium: data.smallimg,
        big: data.bigimg
    }]
    new Enlarge('.box', goodlist)

    // 调用倒计时函数
    var date1 = new Date('2020-10-06 16:39:00');
    var date2 = new Date();
    var box = document.querySelectorAll('#box');
    box.forEach(item => {
        item.innerHTML = dateCha(date1, date2)
    })

    var timer = setInterval(function () {
        date2 = new Date();
        box.forEach(item => {
            item.innerHTML = dateCha(date1, date2, function () {
                clearInterval(timer);
            });
        })
    }, 1000)
}


// 添加到购物车
text.onclick = function (e) {
    e = e || window.event;
    let t = e.target;
    let login = getCookie('login') * 1;
    switch (t.id) {

        case 'addCar':
            // 判断是否有登录
            // 如果有登录 了的情况直接把数据 添加到 购物车
            // 如果没有登录，提示先登录在加入购物车
            // 获取cookie值，是否有登录的属性
            if (!login) {
                // 进入这条代码的时候说明没有登录。提示进行登录，并且取到login.html
                alert('您还没有登录，请登录之后再加入购物车！')
                window.location.href = './login.html?pathname=' + window.location.href;
            }

            addCarData(login, goods_id);

            if (login) {
                getData();
                // console.log(6);
            }
            async function getData() {

                let res = await pAjax({
                    url: '../api/getCarData.php',
                    data: {
                        phone: login
                    }
                });
                // 把获取出来的数据 存储在本地存储中
                localStorage.setItem('carData', JSON.stringify(res));

                fun(res)
            }
    }
}

async function addCarData(phone, goods_id) {
    // 发送ajax请求
    let res = await pAjax({
        url: "../api/addCarData.php",
        data: {
            phone,
            goods_id
        }

    });
    if (res.code == true) {
        let carData = JSON.parse(localStorage.getItem('carData'));
        console.log(carData);
        getData();
        alert("添加购物车成功")
    }
}


function fun(data) {
    let totalNum = 0
    data.forEach(item => {
        totalNum += item.cart_number * 1
    })
    $('.car_num')[0].innerHTML = totalNum
    $('#car_num')[0].innerHTML = totalNum

}


function renderCar(data) {
    totalNum = 0;
    totalPrice = 0
    let str;
    if (!data[0]) {
        str = `
        <div style="width: 100%;padding: 20px;">
        <P style="text-align: center;">购物车中还没有商品，</P>
        <p  style="text-align: center;">快去挑选心爱的商品吧！</p>
      </div>
`
        smallCar.innerHTML = str;
        return;
    }
    str =
        `
    <ul class="cardata">
    <div style="font-size: 12px;padding:10px 10px;width: 100%;">购物车即将被清空，请及时结算</div>`;
    data.forEach(item => {
        str +=
            `
        <li>
        <img src="${item.goods_img}"
          alt="">
        <a style="display:block;height:34px;line-height: 17px;" href="./detail.html?id=${item.goods_id}">${item.goods_name}</a><br>
        <p style="display: inline-block;"><i class="price" style="color:#ed145b;">￥${item.goods_price}</i> x <i class="num">${item.cart_number}</i>
        </p>
      </li>
        `;

        totalNum += item.cart_number * 1
        if (totalNum > 99) {
            totalNum = '99+'
        }
        totalPrice += item.cart_number * item.goods_price
    })

    str += `
    <div style="width: 100%;height:70px; padding: 10px;background-color: #efefef;">
    <div class="fl">
      <p style="line-height: 20px;font-size: 12px;">共<i class="totalNum">${totalNum}</i>件商品</p><br>
      <p style="line-height: 28px;font-size: 14px;">共计<i class="totalPrice"
          style="font-size: 20px;color: red;">${totalPrice}</i></p>
    </div>
    <a class="fr" style="margin-top: 5px;line-height: 20px;padding: 10px;height: 40px !important;
  height: 20px;background-color:#ed145b;color: white;" href="./car.html">去购物车结算</a>
  </div>
</ul>
    `;

    smallCar.innerHTML = str
    $('.car_num')[0].innerHTML = totalNum
    $('#car_num')[0].innerHTML = totalNum
}