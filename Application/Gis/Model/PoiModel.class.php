<?php

namespace Gis\Model;

class PoiModel extends \Think\Model {
    protected $tableName="poi";
    protected $_validate=array(
        array('NAME', 'require', '位置点名称不能为空！', 0, 'regex', 3),
        array('NAME','','位置点名称已经存在！',0,'unique',3),
    );

}
