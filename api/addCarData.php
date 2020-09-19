<?php
    # 用户名 商品id
    $phone = $_GET['phone'];
    $goods_id = $_GET['goods_id'];
    // $username = '婧婧';
    // $goods_id = '8';
    $con = mysqli_connect('localhost','root','123456','jumei');


    $sql = "SELECT * FROM `car` WHERE `phone`='$phone' AND `goods_id`='$goods_id'";
    $res = mysqli_query($con,$sql);

    if(!$res){
        die('error for mysql' . mysqli_error());
    }
    $row = mysqli_fetch_assoc($res);
     # 如果购物车表中存在该条数据，让这个条数据中的goods_num 值加 1
    if($row){
        $goodsNum = $row['goods_num']+1;
       $res2= mysqli_query($con,"UPDATE `car` SET `goods_num` = '$goodsNum' WHERE `car`.`goods_id` = ' $goods_id'");
    }else{
        # 如果不存在，就往car表中 添加数据
        $res2= mysqli_query($con,"INSERT INTO `car` (`goods_id`, `phone`, `goods_num`) VALUES ($goods_id, '$phone', '1')");
    }
    if($res2){
        echo json_encode(array("code"=>true,"msg"=>"添加数据成功"));
    }

?>