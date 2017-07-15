<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
include('connect.php');
if($_GET['function'] == 'getMenu') getMenu();
if($_GET['function'] == 'addItem') addItem();
//getmenu
function getMenu(){

$category = $_GET['category'];
$result  = mysql_query('SELECT * FROM menu WHERE category = "'.$category.'" ORDER BY name DESC');
$row     = mysql_fetch_array($result);
$count  = mysql_num_rows($result);
$i = 1;
//start json file
echo '{';

echo '"'.$category.'" : {';
//startloop
	if ($count > 0) {
	mysql_data_seek($result, 0);

		while($row = mysql_fetch_array($result)) {
			//start item loop
		echo '"'.$row["id"].'" : {';

		echo '"id" : "'.$row["id"].'",';
		echo '"name" : "'.$row["name"].'",';
		echo '"price" : "'.$row["price"].'",';
		echo '"addon" : "'.$row["addon"].'"';
		if ($i < $count) {
		echo '},';
		}
		else {
		echo '}';
		}
		$i++;
			//end item loop
		}
	}
//endloop
echo '}';

echo '}';
//end json file
}


?>