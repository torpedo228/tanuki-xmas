<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


$dbname = "tanuki-xmas";
$user = "mimi";
$password = "0228";
$port = 3306;

$dsn = "mysql:host=localhost;port=$port;dbname=$dbname;charset=utf8";

$options = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_CASE => PDO::CASE_NATURAL);

try {
  $pdo = new PDO($dsn, $user, $password, $options);
  $dbh = null;
} catch (PDOException $e) {
  die("Error!: " . $e->getMessage() . "<br/>");
}
