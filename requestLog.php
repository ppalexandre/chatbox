<?php
require "../sql.php";

$lastMsgIdUser = $_GET["lastMsgId"];
$lastMsgIdDatabaseQuery = mysqli_query($mysqli,
    "SELECT msg_id FROM messages ORDER BY msg_id DESC LIMIT 1");
$lastMsgIdDatabase = $lastMsgIdDatabaseQuery->fetch_assoc();
$lastMsgIdDatabase = $lastMsgIdDatabase["msg_id"];

if($lastMsgIdUser < $lastMsgIdDatabase){
    $msgQuery = mysqli_query($mysqli, 
        "SELECT msg_id, msg_content, user_id FROM messages WHERE msg_id > $lastMsgIdUser ORDER BY msg_id ASC;");

    $counter = 0;
    while($row = $msgQuery->fetch_assoc()) {
        $msgId = $row["msg_id"];
        $msgContent = $row["msg_content"];
        $userId = $row["user_id"];

        $userNameQuery = mysqli_query($mysqli, 
            "SELECT user_name FROM users WHERE user_id='$userId';");
        while($row = $userNameQuery->fetch_assoc()) {
            $userName = $row["user_name"];
        }

        $msg = array("msgId" => $msgId, "msgContent" =>  $msgContent, "userName" => $userName);
        $log[$counter] = $msg;
        $counter++;
    }

    class JsonClass{}
    $jsonObject = new JsonClass();
    $jsonObject->log = $log;
    $jsonObject = json_encode($jsonObject);
    echo $jsonObject;
}

?>
