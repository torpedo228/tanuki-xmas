<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once("./connect_tanuki-xmas.php");

try {
  $name = $_POST["name"] ?? null;
  $score = $_POST["score"] ?? null; 

  // parameters validation
  if ($name == null) {
    throw new InvalidArgumentException($name = "參數不足(請提供name)");
  }

  if ($score == null) {
    throw new InvalidArgumentException($score = "參數不足(請提供score)");
  }

  // create record
  $pdo->beginTransaction();

  $createSql = "insert into ranking(name, score) values(:name, :score)";
  $createStmt = $pdo->prepare($createSql);
  $createStmt->bindValue(":name", $name);
  $createStmt->bindValue(":score", $score);
  $createResult = $createStmt->execute();

  if (!$createResult) {
    throw new Exception();
  }

  $pdo->commit();

  $selectSql = "select * from ranking";
  $selectStmt = $pdo->query($selectSql);
  $newMessage = $selectStmt->fetch(PDO::FETCH_ASSOC);
  http_response_code(200);
  echo json_encode($newMessage);
} catch (InvalidArgumentException $e) {
  http_response_code(400);
  echo $e->getMessage();
  $pdo->rollBack();
} catch (UnexpectedValueException $e) {
  http_response_code(412);
  echo $e->getMessage();
  $pdo->rollBack();
} catch (Exception $e) {
  http_response_code(500);
  echo $e;
  $pdo->rollBack();
}
