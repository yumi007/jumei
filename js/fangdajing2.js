{
    /* <style>

    .box {
        width: 450px;
        margin: 50px;
        display: flex;
        flex-direction: column;
        position: relative;
        text-align: center;
    }

    .box1 {
        height: 418px;
        width: 418px;
        border: 1px solid black;
        text-align: center;
        position: relative;
    }

    .box .show {
        width: 314px;
        height: 417px;

        position: relative;
        left: 50%;
        transform: translateX(-50%);

    }

    /* 在这里可以先把图片按比例设置好，高度为418的图片 */
    // .box .show img {
    //     height: 418px;
    //     width: 314px;
    // }


    // .box .box1 .show .mask {
    //     background-color: yellow;
    //     opacity: .4;
    //     position: absolute;
    //     top: 0px;
    //     left: 0px;
    //     z-index: 9999;
    //     display: none;
    // }


    // .box>.list {
    //     width: 100%;
    //     flex: 1;
    //     display: flex;
    //     justify-content: flex-start;
    //     align-items: center;
    //     box-sizing: border-box;
    //     padding: 20px;
    // }

    // .box>.list>p {
    //     width: 60px;
    //     height: 60px;
    //     border: 2px solid #333;
    //     margin-right: 10px;
    //     text-align: center;
    // }

    // .box>.list>p.active {
    //     border-color: red;
    // }

    // .box>.enlarge {
    //     /* 容器 与背景图的比例为 1 ：2 */
    //     position: absolute;
    //     /* top: 40px; */
    //     left: 450px;
    //     /* background-size:750px  1000px; */
    //     background-position: 0 0;
    //     border: 1px solid #ccc;
    //     display: none;
    // }
    // </style> */
}
// 格式部分------------------------------

{
    /* <div class="box">
    <div class="box1">
        <div class="show">
            <!-- <img src="../images/img1_430x430.jpg"> -->
            <div class="mask"></div>
        </div>
    </div>

    <div class="list">
        <!-- <p class="active"><img src="../images/img1_60x60.jpg"></p>
        <p><img src="../images/img2_60x60.jpg"></p>
        <p><img src="../images/img3_60x60.jpg"></p>
        <p><img src="../images/img4_60x60.jpg"></p>
        <p><img src="../images/img5_60x60.jpg"></p> -->
    </div>
    <div class="enlarge"></div>
    </div> */
}

//   let goodlist = [{
//     small: '../images/img1_60x60.jpg',
//     medium: '../images/img1_430x430.jpg',
//     big: '../images/img1_750x1000.jpg'
// },
// {
//     small: '../images/img2_60x60.jpg',
//     medium: '../images/img2_430x430.jpg',
//     big: '../images/img2_750x1000.jpg'
// },
// {
//     small: '../images/img3_60x60.jpg',
//     medium: '../images/img3_430x430.jpg',
//     big: '../images/img3_750x1000.jpg'
// },
// {
//     small: '../images/img4_60x60.jpg',
//     medium: '../images/img4_430x430.jpg',
//     big: '../images/img4_750x1000.jpg'
// },
// {
//     small: '../images/img5_60x60.jpg',
//     medium: '../images/img5_430x430.jpg',
//     big: '../images/img5_750x1000.jpg'
// }
// ];


// 引用方法 ：new Enlarge('.box', goodlist)
let p=document.querySelector('.detail>p')

class Enlarge {
    constructor(ele, data) {
        this.ele = document.querySelector(ele);
        this.data = data;

        this.init();
    }
    init() {
        this.show = document.querySelector('.show')
        this.showImg = document.createElement('img')
        //  默认情况下，显示第一张图片
        this.showImg.src = this.data[0].medium
        this.show.appendChild(this.showImg)
        this.list = document.querySelector('.list')
        // 通过循环获得小图片
        this.list.innerHTML = this.renderList()
        // 创建mask标签
        this.mask = document.createElement('div');
        this.mask.classList.add('mask');
        this.show.appendChild(this.mask);
        this.enlarge = document.querySelector('.enlarge')
        this.enlarge.style.backgroundImage = `url(${this.data[0].big})`;

        this.setStyle();

        // 给showImg绑定鼠标移入事件，显示遮罩层和放大镜
        // console.log(this.showImg);
        this.show.onmouseover = () => {
            this.mask.style.display = this.enlarge.style.display = 'block';
        }

        // 鼠标移出showImg，隐藏遮罩层和放大镜
        this.show.onmouseleave = () => {         
            this.mask.style.display = this.enlarge.style.display = 'none';
        }

        // 使用事件驱动调用 this.move 函数
        this.showImg.onmousemove = this.move;

        this.p = this.list.querySelectorAll('p');
        this.p.forEach((item, index) => {
            item.onclick = () => {
                this.change(item, index)
            }
        })
    }
    renderList() {
        // 创建一个class名为list的div标签
        let lists = this.data.map((item, index) => {
            return index === 0 ? `<p class="active"><img src=${this.data[index].small}></p>` :
                `<p><img src=${this.data[index].small}></p>`
        }).join('')
        return lists
    }
    setStyle() {
        // 求mask盒子的大小
        this.maskWidth = this.showImg.offsetWidth / 2;
        // console.log(this.showImg.offsetWidth);
        this.maskHeight = this.showImg.offsetHeight / 2;
        this.mask.style.width = this.maskWidth + 'px'
        this.mask.style.height = this.maskHeight + 'px'

        // 设置放大镜宽高
        this.enlarge.style.width = this.showImg.offsetWidth + 'px'
        this.enlarge.style.height = this.showImg.offsetHeight + 'px'

        // 设置背景图宽高
        // 背景图的大小=图片的大小/mask的大小*放大镜的大小
        this.bgWidth = this.showImg.offsetWidth / this.maskWidth * this.showImg.offsetWidth
        this.bgHeihgt = this.showImg.offsetHeight / this.maskHeight * this.showImg.offsetHeight
        this.enlarge.style.backgroundSize = this.bgWidth + 'px', this.bgHeihgt + 'px'
    }
    move = (e) => {
        this.mask.style.display = this.enlarge.style.display = 'block'
        let maskLeft = e.pageX - this.ele.offsetLeft - this.mask.offsetWidth / 2-(window.innerWidth-960)/2;
        let maskTop = e.pageY - this.ele.offsetTop - this.mask.offsetHeight -p.offsetHeight;

        if (maskLeft <= 0) {
            maskLeft = 0;
        }
        if (maskTop <= 0) {
            maskTop = 0;
        }
        if (maskLeft >= this.showImg.offsetWidth - this.mask.offsetWidth) {
            maskLeft = this.showImg.offsetWidth - this.mask.offsetWidth;
        }
        if (maskTop >= this.showImg.offsetHeight - this.mask.offsetHeight) {
            maskTop = this.showImg.offsetHeight - this.mask.offsetHeight;
        }
        this.mask.style.left = parseInt(maskLeft) + 'px';
        this.mask.style.top = parseInt(maskTop) + 'px';


        // 背景图移动的距离 = 背景图的大小 *遮罩层移动的距离/showImg的大小
        let bgpX = parseInt(this.bgWidth * maskLeft / this.showImg.offsetWidth);
        let bgpY = parseInt(this.bgHeihgt * maskTop / this.showImg.offsetHeight);

        // 遮罩层往右移动，背景图需要往左移动
        this.enlarge.style.backgroundPosition = `${-bgpX}px ${-bgpY}px`;
    }
    change(ele, idx) {
        // 当前点击的这个元素 添加active，其他元素移出
        for (let i = 0; i < this.p.length; i++) {
            this.p[i].classList.remove('active');
        }
        ele.classList.add('active');

        // 给show盒子设置 当前点击的这个元素的对应的中图
        this.showImg.src = this.data[idx].medium;

        // 给放大镜设置当前点击的这个元素的 对应的大图
        this.enlarge.style.backgroundImage = `url(${this.data[idx].big})`;
    }

}