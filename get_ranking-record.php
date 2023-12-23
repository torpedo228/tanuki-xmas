<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once("./connect_tanuki-xmas.php");

try{
  $sql = "select * from ranking order by score";
  $ranking = $pdo->prepare($sql);
  $ranking->execute();
  
  if( $ranking->rowCount() == 0 ){ //找不到
    //傳回空的JSON字串
      echo"{}";
  }else{ //找得到
    //取回一筆資料
    $ranking_row=$ranking->fetchAll(PDO::FETCH_ASSOC);
    //送出json字串
    echo json_encode($ranking_row);
  }	
}catch(PDOException $e){
  echo $e->getMessage();
}
?>