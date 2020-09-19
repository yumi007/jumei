<?php
    # 怎么获取前端传过来的数据 跟前端传送过来的方式有关系
    #注册时前端用 POST传输  则用$_POST['属性']来获取
    $phone = $_POST['phone'];

    # 拿获取到的前端参数 去数据库中匹配
    $con = mysqli_connect('localhost','root','123456','jumei');
    
    #匹配用户名是否已经存在
    $sql = "SELECT * FROM `user` WHERE `phone` ='$phone' ";

    $res = mysqli_query($con,$sql);
    if(!$res){
        die('error' . mysqli_error());
    }
    // 把结果处理成PHP的数据
    $row = mysqli_fetch_assoc($res);

    // 判断处理的结果，如果一条结果都不满足 返回的数据为 0条 一套数据都没有，$row  = 空
    // 如果有一条数据满足，就会把这条满足条件的数据返回 $row  = 当前的这条数据
    if(!$row){
        echo json_encode(array(
            "code" => 0,
            "message" => "手机号不存在"
          ));
    }else{
        // setcookie('login',$phone,time()+7*24*60*60);
        echo json_encode(array(
            "code" => 1,
            "message" => "手机号存在"
            
          ));
         
    }

?>