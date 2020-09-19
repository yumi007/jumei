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


// 排序部分点击的背景色改变事件
$('.paixu li').click(function () {
    $(this).toggleClass('active').siblings().removeClass('active')
})



let page = document.querySelector('.page');
let uls = document.querySelector('.list');
let smallCar = document.querySelector('.smallCar')


let goods_id;
let login = getCookie('login');
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



// console.log(localStorage.getItem('n'));

let defInfo = {
    pagenum: localStorage.getItem('n') || 1,
    pagesize: 20,
    total: '',
    totalpage: ''
}


// 第一次请求数据 ajax调用
pAjax({
    url: `../api/getData.php`,
    data: {
        start: defInfo.pagenum,
        len: defInfo.pagesize
    },
}).then(function (list) {
    defInfo.total = list.total.count;
    defInfo.totalpage = Math.ceil(defInfo.total / defInfo.pagesize);
    console.log(defInfo);
    renderPage(defInfo);
    // renderHtml(list.list);
    // 渲染数据。浏览器一打开时候渲染数据
})

async function getData() {
    let list = await pAjax({
        url: `../api/getData.php`,
        data: {
            start: defInfo.pagenum,
            len: defInfo.pagesize
        }
    });
    defInfo.total = list.total.count;
    defInfo.totalpage = Math.ceil(defInfo.total / defInfo.pagesize);
    // 渲染数据
    console.log(list.list);
    renderHtml(list.list);

    let list_price = document.querySelector('#list_price')
    list_price.onclick = function () {
        list.list.sort(function (a, b) {
            return a.goods_reprice - b.goods_reprice
        })
        renderHtml(list.list)

    }
}

let moren = document.querySelector('#moren')
moren.onclick = function () {
    getData()

}



function renderPage(info) {
    // console.log(info);
    new Pagination(page, {
        pageInfo: {
            pagenum: info.pagenum,
            pagesize: info.pagesize,
            total: info.total,
            totalpage: info.totalpage
        },
        textInfo: {
            first: '第一页',
            prev: '上一页',
            next: '下一页',
            last: '最后一页'
        },
        change(n) {
            localStorage.setItem('n', n);
            defInfo.pagenum = n;
            // n = 1 的时候不需要调用
            // if (n === 1) return
            getData();
            scrollTo({
                top: 0
            })
        }
    })
}

function renderHtml(data) {
    // console.log('在这里渲染数据');
    // console.log(data);
    let str = '';
    data.forEach(item => {
        str += `
        <li class="imgbox">
        <a href="./detail.html?id=${item.goods_id}">
            <img src="${item.goods_img}" alt="">
        </a>
        <div class="detail">
            <p class="title"><a href="./detail.html?id=${item.goods_id}">${item.goods_name}</a> </p>
            <div>
                <div class="price"><em>¥</em>&nbsp;<span class="num">${item.goods_price}</span><span
                        class="mnum">¥${item.goods_reprice}</span></div>
                <span id="box"></span>
            </div>
            <button id="addCar" data_id="${item.goods_id}" class="carbtn fl">加入购物车</button>
            <button class="collect fl">收藏</button>
        </li>
`;

    })
    uls.innerHTML = str;
    // 商品列表划过事件
    $('.imgbox').hover(function () {
        $(this).addClass('shadow')
    }, function () {
        $(this).removeClass('shadow')
    })
}






// 添加购物车
uls.onclick = function (e) {
    e = e || window.event;
    let t = e.target;
    login = getCookie('login') * 1;

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

                window.location.href = './login.html?pathname=' + window.location.href;

            }

            addCarData(login, goods_id);
            // console.log(login);
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


            break;


    }
}

// 将加入购物车的数据添加到数据库中
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

}