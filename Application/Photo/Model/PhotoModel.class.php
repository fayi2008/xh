<?php
namespace  Photo\Model;

class PhotoModel extends \Think\Model{
	protected $tabelName='photo';
	
	protected $_validate = array(
		array('FILE_URL','require','图片不能为空！'),
	);
}