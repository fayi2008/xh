#!/bin/bash
basepath=$(cd `dirname $0`; pwd)
workpath=${basepath}'/../Public'
cd $workpath
#echo $workpath
php index.php panorama/exe/produce &
php index.php business/index/order_close &
php index.php service/exe/close &
php index.php system/check/web &
php index.php system/check/db &
php index.php system/check/webservice &