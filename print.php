<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "snakecomments2";


try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // 设置 PDO 错误模式，用于抛出异常
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $showtime = date("Y-m-d H:i",time());
    $stmt = $conn->prepare("SELECT * FROM snakecomments3"); 
    $stmt->execute(); 
    $num = $stmt->fetchAll();
    $js_num = json_encode($num);
    echo $js_num;
    // header("refresh:0;url=htmlpart.html");
}
catch(PDOException $e)
{
    echo "Error:" . "<br>" . $e->getMessage();
}