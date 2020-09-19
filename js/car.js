let login = getCookie('login');
if (!login) {
  // 没有登录就跳到登录页面
  window.location.href = './login.html?pathname=' + window.location.href;
}

let popimg = document.querySelector('.popimg')
let carlist = document.querySelector('.carlist');
fun()

getData();
async function getData() {
  let res = await pAjax({
    url: '../api/getCarData.php',
    data: {
      phone: login
    }
  });
  // 把获取出来的数据 存储在本地存储中
  localStorage.setItem('carData', JSON.stringify(res));
  console.log(res[0]);
  renderHtml(res)
}

function renderHtml(data) {
  let str;
  if (!data[0]) {
    str = ` <div class="cartip">
    <img class="car_icon fl" src="http://s0.jmstatic.com/assets/images/jumei/cart_v2/empty_icon.jpg" alt="">
    <div class="carbox fl">
        <h2>您的购物车中没有商品，请先去挑选心爱的商品吧！</h2>
        <p class="content"> 您可以 <a class="btn" href="../index.html"> 返回首页 </a> 挑选喜欢的商品,或者
              </p>
       <input type="text" placeholder="搜搜您想要的商品">
   </div>
</div>`
    carlist.innerHTML = str;
    return;
  }
  // 渲染数据的时候 ，如果每一条的数据 is_select  都为1 的是，表示全选按钮被选上
  // 如果数组中的所有数据 都满足 item.is_select == '1'条件
  // allSelect = true，那么有其中一个不满足条件就为false

  let allSelect = data.every(item => {
    return item.is_select == '1';
  });

  let obj = selectShop(data);

  str =
    `
     <table class="tablebox">
        <tr style=" height: 34px;line-height: 16px;background-color:#efefef">
            <td style="width: 520px;font-weight: bold;padding-left:20px">名品特卖</td>
            <td>聚美价（元）</td>
            <td>数量</td>
            <td>小计（元）</td>
            <td>操作</td>
        </tr>`;
  data.forEach(item => {
    str += `
          <tr>
          <td>
              <input style="margin-right: 10px;margin-top: 35px;" class="fl" type="checkbox"  data_id="${item.goods_id}"  name="" ${item.is_select == 1 ? 'checked' : ''}  id="select">
              <img class="fl"
                  src="${item.goods_img}"
                  alt="">
              <p><a href="">${item.goods_name}</a></p>
              &nbsp;&nbsp;<span>容量：${item.type}</span>
          </td>
          <td><span>${item.goods_price}</span> <br><span style="text-decoration: line-through;
              color: #929292;">${item.goods_reprice}</span></td>
          <td>
              <div class="btn-group" role="group" data_id="${item.goods_id}" aria-label="...">
                  <button id="reduce" class="btn btn-default btn-xs">-</button>
                  <button class="btn btn-default btn-xs">${item.cart_number}</button>
                  <button id="add" class="btn btn-default btn-xs">+</button>
              </div>
          </td>
          <td><span style="color: #ed145b;">${item.goods_price*item.cart_number}</span><br><span style="font-weight: normal;">省${(item.goods_reprice-item.goods_price)*item.cart_number}元</span>
          </td>
          <td><a href="javascript:"><i id="delete" data_id="${item.goods_id}" style="color: #ccc;" class="iconfont icon-shanchu"></i></a></td>
      </tr>`;
  })

  str += `
         
        <tr>                   
        <td class="total" colspan="5">商品金额：<span
                style="font-size: 14px; color: #ed145b;font-weight: bold;">￥${obj.totalPrice.toFixed(2)}</span></td>
    </tr>
</table>
<div class="cartotal">
    <div class="fl">
        <span style="margin-right:20px;font-weight: normal;cursor: pointer"><input style="margin: 5px 10px; ;" type="checkbox"  ${allSelect ? 'checked' : ''} id="allChecked">全选</span>
        <a style="padding-right: 10px; border-right: 1px solid #ccc;" href="../index.html">继续购物</a>
        <a id="deleteSelect" style="padding-left: 10px;" href="javascript:">清空选中商品</a>
    </div>
    <div class="fr">
        <p>共<span>${obj.count}</span>件商品</p>
        <p>商品应付总额：<span style="font-size: 18px;color: #ed145b;font-weight: bold;">￥${obj.totalPrice.toFixed(2)}</span></p>
        <button id="pay">去结算</button>
    </div>
</div>
        `;

  carlist.innerHTML = str;
}

// 利用事件委托绑定点击事件
carlist.onclick = function (e) {
  e = e || window.event;
  e.stopPropagation()

  let t = e.target;
  let goods_id, goods_num;
  switch (t.id) {
    case 'add':
      // 需要把用户名 商品id 和 商品的数量传递给后端
      goods_id = t.parentNode.getAttribute('data_id');
      goods_num = t.previousElementSibling.innerHTML * 1 + 1;
      if (goods_num > 10) {
        goods_num = 10;
        alert('该商品一次最多能购买10个')
      }
      addQty(login, goods_id, goods_num);
      break;

    case 'reduce':
      goods_id = t.parentNode.getAttribute('data_id');
      goods_num = t.nextElementSibling.innerHTML * 1 - 1;
      //判断 goods_num的值不能小于1
      if (goods_num <= 1) {
        goods_num = 1;
      }
      console.log(goods_num);
      addQty(login, goods_id, goods_num);
      break;

    case 'allChecked':
      let carData = JSON.parse(localStorage.getItem('carData'));
      carData.forEach(item => {
        item.is_select = t.checked ? 1 : 0
      });
      renderHtml(carData);
      localStorage.setItem('carData', JSON.stringify(carData));
      break;

    case 'select':
      // 把当前的这商品选上 改变当前这个商品的is_select 
      goods_id = t.getAttribute('data_id');
      let carData1 = JSON.parse(localStorage.getItem('carData'));
      carData1.forEach(item => {
        if (item.goods_id == goods_id) {
          item.is_select = t.checked ? 1 : 0
        }
      });
      renderHtml(carData1);
      localStorage.setItem('carData', JSON.stringify(carData1));
      break;

    case 'pay':
      // 获取总价格进行支付（暂时只是获取总价格）
      // 把结算的 过的商品从购物车中删除（如果is_selelct = 1 表示被结算的商品）
      // 把本地的数据也要更新（结算的也要删除）
      let data = JSON.parse(localStorage.getItem('carData'));
      alert('你已经成功支付' + selectShop(data).totalPrice);
      data.forEach(item => {
        // 表示被结算的商品
        if (item.is_select == 1) {
          removeData(login, item.goods_id)
        }
      })
      break;

    case 'delete':
      goods_id = t.getAttribute('data_id');
      removeData(login, goods_id)
      break;
    case 'deleteSelect':
      let data1 = JSON.parse(localStorage.getItem('carData'));
      confirm('你确定要清除选中的所有商品吗？')
      data1.forEach(item => {
        // 表示被选中要清除的商品
        if (item.is_select == 1) {
          removeData(login, item.goods_id)
        }
      })
      window.location.href = './car.html' ;

  }
}

async function addQty(phone, goods_id, goods_num) {
  let res = await pAjax({
    url: '../api/updCarData.php',
    data: {
      phone,
      goods_id,
      goods_num
    }
  });
  // 更改完数据库中的数据之后，也需要更改本地存储中的数据
  let carData = JSON.parse(localStorage.getItem('carData'));
  carData.forEach(item => {
    if (item.goods_id === goods_id) {
      item.cart_number = goods_num;
    }
  });
  // 把当前的数据 传递给渲染页面的函数尽心数据的渲染
  renderHtml(carData);
  //把更改的数据存入本地
  localStorage.setItem('carData', JSON.stringify(carData));
  // getData();
}

async function removeData(phone, goods_id) {
  await pAjax({
    url: '../api/removeCarData.php',
    data: {
      phone,
      goods_id
    }
  })
  // 更新本地存储中的数据
  let carData = JSON.parse(localStorage.getItem('carData'));
  // 过滤出没有删除的数据
  carData = carData.filter(item => {
    // 当item.goods_id === goods_id 这条数据被删除
    return item.goods_id !== goods_id
  });
  renderHtml(carData);
  // 重新把数据存入本地存储
  localStorage.setItem('carData', JSON.stringify(carData));
}

function selectShop(data) {
  // 过滤出本地存储中 is_select:1的数据
  // let carData = JSON.parse(localStorage.getItem('carData'));
  let selectData = data.filter(item => {
    return item.is_select == 1
  });

  let obj = {
    count: 0,
    totalPrice: 0
  };
  // 根据过滤出来的数据 计算商品的总数量 和总价格
  selectData.forEach(item => {
    obj.count += item.cart_number * 1
    obj.totalPrice += item.cart_number * item.goods_price;
  })
  return obj
}



// 判断登录，修改用户名
let phone = getCookie('login');
console.log(phone);
if (phone) {
  $('.p1')[0].innerHTML = `欢迎您，<a style="color: #ed145b;" href="">${phone}</a>&nbsp;<span><a class='exit'  href="">[退出]</a></span><a style="display: inline-block;padding-left: 10px;border-left: 1px solid #cccccc;margin-left: 10px;" href="">订单查询</a>`

  let exit = document.querySelector('.exit')
  exit.onclick = function () {
    setCookie('login', login, -1)
  }

  $('.exit').hover(function () {
    $('.exit')[0].style.color = '#ed145b';
  }, function () {
    $('.exit')[0].style.color = '#999';
  })



}


function fun() {
  let xhr = new XMLHttpRequest();
  xhr.open("get", "http://localhost/project/api/list.json")
  xhr.send();
  xhr.onload = function () {
    let res = JSON.parse(xhr.responseText);
    render(res)
  }
}


// 渲染每日欢迎部分的数据
function render(data) {
  data.forEach(item => {
    popimg.innerHTML +=
      `
          <li>
          <img src="${item.img}" alt="">
          <p class="tit">${item.name}</p>
          <p class="price">${item.price}</p>
          <button>加入购物车</button>
          </li>
          `
  })
}