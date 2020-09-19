var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal', // 垂直切换选项
    loop: true, // 循环模式选项
    autoplay: true,
    autoplay: {
        delay: 3000, //3秒切换一次

    },
    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

})

for (i = 0; i < mySwiper.pagination.bullets.length; i++) {
    mySwiper.pagination.bullets[i].onmouseover = function () {
        this.click();
    };
}



// 获取元素
let imgbox = document.querySelector('.imgbox')
let asidel = document.querySelector('.asidel')
let asider = document.querySelector('.asider')
let itop = document.querySelector('.i-top')
let container = document.querySelector('.container')

asidel.style.left = ((window.innerWidth - 1002) / 2 - 85) + "px"
asider.style.height = window.innerHeight + 'px'

// 修改登录的后用户名
let goods_id;
let login = getCookie('login');

if (login) {
    $('.dl')[0].innerHTML = `欢迎来到聚美！
    <a style="color: #ed145b;" href="">${login}</a>&nbsp;<span><a class='exit'  href="">[退出]</a></span>`

    let exit = document.querySelector('.exit')
    exit.onclick = function () {
        setCookie('login', login, -1)
    }
}


fun()

// 返回顶部
$('.i-top').click(function () {
    scrollTo(0, 0)
})

// 导航部分 lis2 的下拉事件
$('.lis2').hover(function () {
    $('.lis2>.con').finish().slideDown()
}, function () {
    $('.lis2>.con').finish().slideUp()
})
$('.lis2 li').slice(1, 4).css("borderBottom", "1px #ddd solid");


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


// 购物车的下拉列表
$('.car').hover(function () {
    $('.smallCar').show()
}, function () {
    $('.smallCar').hide()
})

// input框的聚焦和失焦事件
$('.inp input').click(function (e) {
    e.cancelBubble = true
    e.stopPropagation()
    $('.dowmlist').show()

})
// 下拉搜索框，点击需要搜索的内容让其显示在搜索框中
$('.dowmlist li').click(function () {
    $('.inp input').val($('.dowmlist li a')[$(this).index()].innerHTML)
})
// 下拉搜索框隐藏事件
$('body').click(function () {
    $('.dowmlist').hide()
})



// 获取main的部分需要渲染的商品数据
function fun() {
    let xhr = new XMLHttpRequest();
    // data
    xhr.open("get", "http://localhost/project/api/data.json")
    xhr.send();
    xhr.onload = function () {
        // let res = xhr.responseText;
        // console.log(JSON.parse(res));
        let res = JSON.parse(xhr.responseText);
        console.log(res.list);
        render(res.list)

    }
}

// 渲染数据
function render(data) {
    data.forEach(item => {
        imgbox.innerHTML +=
            `
        <div class="img">
        <a href="./html/detail.html?id=${item.id}">
              <div class="img1"></div>
            </a>
        <button   data_id="${item.id}" id="addCar"  class="carbtn">加入购物车</button>
        <div class="tip">海外直采 海外价格 闪电发货</div>
        <img src=${item.deal_img} alt="">
        <a href="./html/detail.html?id=${item.id}">
        <div class="detail">
          <p class="title">${item.deal_tit}</p>
          <div>
            <div class="price"><em>¥</em>&nbsp;<span class="num">${item.price_home}</span><span class="mnum">${item.price_ref}</span></div>
            <span id="box" class="fr"></span>
          </div>
        </div>
      </a>
      </div>
        `
    });



    // 添加购物车部分
    imgbox.onclick = function (e) {
        e = e || window.event;
        let t = e.target;
        let login = getCookie('login') * 1;

        switch (t.id) {
            case 'addCar':
                goods_id = t.getAttribute('data_id');
                // 判断是否有登录
                // 如果有登录 了的情况直接把数据 添加到 购物车
                // 如果没有登录，提示先登录在加入购物车
                // 获取cookie值，是否有登录的属性
                if (!login) {
                    // 进入这条代码的时候说明没有登录。提示进行登录，并且取到login.html
                    alert('您还没有登录，请登录之后再加入购物车！')

                    window.location.href = './html/login.html?pathname=' + window.location.href;

                }

                addCarData(login, goods_id);
                if (login) {
                    getData()
                }


        }
    }

    // 将加入购物车的数据添加到数据库中
    async function addCarData(phone, goods_id) {
        // 发送ajax请求
        let res = await pAjax({
            url: "./api/addCarData.php",
            data: {
                phone,
                goods_id
            }
        });
    }


    let smallCar = document.querySelector('.smallCar')
    // 当登录后，将购物车的数据存在本地储存中
    if (login) {
        getData();
    }
    async function getData() {

        let res = await pAjax({
            url: './api/getCarData.php',
            data: {
                phone: login
            }
        });
        // 把获取出来的数据 存储在本地存储中
        localStorage.setItem('carData', JSON.stringify(res));
        console.log(res);
        renderHtml(res)
    }
    let totalNum, totalPrice
    // 渲染购物车部分
    function renderHtml(data) {
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
            <a class="" style="display:block;height:34px;line-height: 17px;" href="./html/detail.html?id=${item.goods_id}">${item.goods_name}</a><br>
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
      height: 20px;background-color:#ed145b;color: white;" href="./html/car.html">去购物车结算</a>
      </div>
    </ul>
        `;

        smallCar.innerHTML = str
        $('.car_num')[0].innerHTML = totalNum
        $('#car_num')[0].innerHTML = totalNum
    }





    // 商品框上的tip carbtn img1划过时出现
    $('.img').hover(function () {
        $($('.tip')[$(this).index()]).show()
        $($('.carbtn')[$(this).index()]).show()
        $($('.img1')[$(this).index()]).show()

    }, function () {
        $($('.tip')[$(this).index()]).hide()
        $($('.carbtn')[$(this).index()]).hide()
        $($('.img1')[$(this).index()]).hide()
    })

    // 倒计时部分
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




// 左边侧边栏滚动条滚动事件
window.onscroll = function () {
    if (scrollY >= 600) {
        asidel.style.display = 'block'
        itop.style.display = 'block'

    } else if (scrollY < 600) {
        asidel.style.display = 'none'
        itop.style.display = 'none'
    }

}
// 左边侧边栏点击事件
$('.li2').click(function () {
    scrollTo(0, 538)
})
$('.li3').click(function () {
    scrollTo(0, 588)
})