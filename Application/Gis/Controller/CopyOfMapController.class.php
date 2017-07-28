<?php
namespace Gis\Controller;

class MapController extends \Common\Controller\BaseController {

    function _init()
    {
        C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/Gis/');
    }

    /**
     * Description: index 显示地图(景区导览)
     * Author: Jason
     */
    public function index_get_html(){
        //todo
        $this->display('index');
    }

    /**
     * Description: index 获取图层列表数据
     * Author: Jason
     * Date:
     */
    public function index_get(){
        
    }
}