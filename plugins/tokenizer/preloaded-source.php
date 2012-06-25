<?php

require_once '../../javelin/support/php/JavelinHelper.php';

$list = file_get_contents('animals.txt');
$list = explode("\n", trim($list));

$response = array();
foreach ($list as $id => $animal) {
  $response[] = array(
    ucfirst($animal),
    'http://www.google.com/search?q='.$animal,
    $id);
}

echo JavelinHelper::renderAjaxResponse($response);
