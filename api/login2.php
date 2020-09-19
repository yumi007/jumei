<?php

$con = mysqli_connect('localhost','root','123456','jumei');

  $phone = $_POST['phone'];
  $password = $_POST['password'];

  
  $sql = "SELECT * FROM `user` WHERE `phone`='$phone' AND `password`='$password'";
  $res = mysqli_query($con,$sql);

  if (!$res) {
    die('error for mysql: ' . mysqli_error());
  }

  $row = mysqli_fetch_assoc($res);

  if (!$row) {
    // 没有匹配的数据 登录失败
    echo json_encode(array(
      "code" => 0,
      "message" => "登录失败"
    ));
  } else {
    // setcookie('login',$phone,time()+7*24*60*60);
    // 有匹配的数据 登录成功
    echo json_encode(array(
      "code" => 1,
      "message" => "登录成功"
    ));
    
  }

?>

