<?php

namespace Gis\Logic;

class MapLogic extends \Think\Model {
    function _initialize() {
        $this->model = new \Gis\Model\MapModel ();
    }

    /**
     * Description: 获取map列表
     * Author: lyndon
     * Date:2015.11.4
     */
    function getmaplist() {
        $field = "ID,TITLE,POST_STATUS,OPACITY,BOUND_LB_LON,BOUND_LB_LAT,BOUND_RT_LON,BOUND_RT_LAT";
        $maplist = $this->model->field($field)->select ();
        return $maplist;
    }

    /**
     * Description: 添加map记录
     * Author: lyndon
     * Date:2015.11.4
     */
    function addMap() {
        if ($data = $this->model->create ( $_POST )) {
            $data ['CREATE_DATE'] = date ( "Y-m-d H:i:s", time () );
            $data ['UPDATE_DATE'] = date ( "Y-m-d H:i:s", time () );
            $res = $this->model->add ( $data );
            AdminLog ( $res, 1, json_encode ( $data ), "添加图层" );
            return $res;
        }
    }
    
    /**
     * Description: 删除map记录
     * Author: lyndon
     * Date:2015.11.4
     */
    function deleteMap() {
        $id = I ( 'ids' );
        $where ['ID'] = array (
                'in',
                $id 
        );
        $res = $this->model->where ( $where )->delete ();
        AdminLog ($id, 3, json_encode ( $data ), "删除图层" );
        return $res;
    }

    /**
     * Description: 编辑map-保存
     * Author: lyndon
     * Date:2015.11.4
     */
    function saveMap() {
        if ($data = $this->model->create ( I ( 'put.' ) ) ) {
            $res = $this->model->where( $where )->save ( $data );
            AdminLog ( $data['ID'], 2, json_encode ( $data ), "编辑图层" );
            return $res;
        } else {            
            return false;
        }
    }
    
    /**
     * Description: 编辑map-填充
     * Author: lyndon
     * Date:2015.11.4
     */
    function getMapDetail($id) {
        $where ['ID'] = $id;
        $map = $this->model->where ( $where )->find ();        
        return $map;
    }

    /**
     * Description: 发布、取消发布map
     * Author: lyndon
     * Date:2015.11.4
     */
    function releaseMap() {
        $where ['ID'] = intval ( I ( 'put.id' ) );
        if (I ( 'put.unrel' )) {
            $data ['POST_STATUS'] = 0;
            AdminLog ($where ['ID'], 5, json_encode ( $data ), "取消发布图层" );
        } else {
            $data ['POST_STATUS'] = 1;
            AdminLog ($where ['ID'], 4, json_encode ( $data ), "发布图层" );
        }
        $res = $this->model->where ( $where )->save ( $data );
        return $res;
    }
}