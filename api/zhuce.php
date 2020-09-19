<?php
      #链接数据库
      $con = mysqli_connect('localhost','root','123456','jumei');
      #从注册页面中获取电话号码
      $phone = $_POST['phone'];
      $password = $_POST['password'];
      
      
      // 判断用户名是否存在
      $sql = "SELECT * FROM `user` WHERE `phone` ='$phone' ";
    #执行sql语句
     $res = mysqli_query($con,$sql);
    
     if(!$res){
        die('error' . mysqli_error());
    }
    // 把结果处理成PHP的数据
    $row = mysqli_fetch_assoc($res);

    // 判断处理的结果，如果一条结果都不满足 返回的数据为 0条 一套数据都没有，$row  = 空
    // 如果有一条数据满足，就会把这条满足条件的数据返回 $row  = 当前的这条数据
    if(!$row){
        // echo "注册成功";
        #注册成功是将注册的和密码手机号码添加到数据中
         $sql1 = "INSERT INTO `user` VALUES (NULL, '$phone', '$password');";
    echo json_encode(array(
            "code" => 1,
            "message" => "不含手机号，可以继续注册"
          ));       #执行sql语句
         $res1 = mysqli_query($con,$sql1);
       
        // #跳转到登录页面
        //  header("location:./2,login.html");
    }else{
        // echo "注册失败";
        // 注册失败跳转回注册页面
        echo json_encode(array(
            "code" => 0,
            "message" => "含手机号，可以直接登录"
          ));
    }


?>