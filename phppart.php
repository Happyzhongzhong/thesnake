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
    if($_POST['comments']!=""){
        $sql = "INSERT INTO snakecomments3 (comment,time)
        VALUES ('$_POST[comments]', '$showtime')";
        // 使用 exec() ，没有结果返回 
        $conn->exec($sql);
        header("refresh:0;url=htmlpart.html");
    }
    else
        echo "不要输入空的评论哦";
}
catch(PDOException $e)
{
    echo "Error:" . "<br>" . $e->getMessage();
}
 



