<?php
namespace  Panorama\Model;

class PanoModel extends \Think\Model{
	protected  $tableName='panorama';//全景表
    protected  $_auto=array(
        array('CREATE_DATE','toDate',1,'function'),
        array('UPDATE_DATE','toDate',2,'function')
    );
}