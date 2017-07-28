<?php

namespace Gis\Controller;

class AdminController extends \Common\Controller\AdminController {
	function _init() {
		$this->logic = new \Gis\Logic\PoiLogic ();
		$this->tagLogic = new \Gis\Logic\TagLogic ();
		$this->mapLogic = new \Gis\Logic\MapLogic ();
	}

	/**
	 * Description: index 显示图层管理界面、获取图层列表
	 * Author: Jason
	 */
	public function map_get_html() {
        $this->display('map');
	}

	/**
	 * Description: map_get_json
	 * Author: Jason
	 * Date:
	 */
	public function map_get_json() {
		$result = $this->mapLogic->getmaplist();
		echo json_encode ( $result );
	}

    /**
     * Description: map_add_get_html 显示添加图层页面
     * Author: Jason
     * Date:
     */
    public function map_add_get_html() {
        $this->display('map_add');
    }

	/**
	 * Description: map_post 添加图层
	 * Author: Jason
	 */
	public function map_post() {
		$res = $this->mapLogic->addMap ();
		if ($res) {			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Gis/admin/map' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Gis/admin/map' ) 
			) );
		}
	}

	//上传文件
    public function Mapupload($dirname='map',$exts=array('zip'))
    {   
        header("Access-Control-Allow-Origin:*");
        $config = array(
            'maxSize'    =>    50*1024*1024,  //单位是b
            'savePath'   =>    $dirname.'/',
            'saveName'   =>    array('date','Y-m-d-H-i-s'.rand(1,100)),
            'rootPath'   =>   C('UPLOAD_PATH'),
            'autoSub'    =>    true,
            'subName'    =>    array('date','Ymd'),
        );
        $config['exts'] = $exts;
        $upload = new \Think\Upload($config);// 实例化上传类

        $info=$upload->upload();
        if(!$info) {// 上传错误提示错误信息
            $msg=APP_DEBUG?$upload->getError():'上传失败！';
            $this->ajaxReturn(array('status'=>0,'msg'=>$msg));
            exit;
        }else{
            $first=current($info);
            $filename=C('UPLOAD_PATH').$first['savepath'].$first['savename'];
            $imgArr=getimagesize($filename);
            $this->ajaxReturn(array('status'=>1,
                    'file'=>$first['savepath'].$first['savename']));
        }
    }

    /**
     * Description: map_edit_get_html 显示编辑图层页面
     * Author: lyndon
     * Date:2015.11.4
     */
    public function map_edit_get_html() {
        $id = I ('id');        
		$map = $this->mapLogic->getMapDetail ( $id );
		//未成功
		$opacity =$map['opacity'];
        $status = $map['post_status'];
		$this->assign('opacity',$opacity);
		$this->assign('status',$status);
		$this->assign('map',$map);
		$this->assign("id",$id);
        $this->display('map_edit');
    }
	
	/**
	 * Description: poi_put 修改map
	 * Author: Jason
	 * Date:
	 */
	public function map_put() {
		$res = $this->mapLogic->saveMap();
		if ($res) {			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Gis/admin/map' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Gis/admin/map' ) 
			) );
		}
	}
	
	/**
	 * Description: map_delete 删除图层
	 * Author: Jason
	 */
	public function map_delete() {
		$res = $this->mapLogic->deleteMap ();
		if ($res) {
			$arr ['success'] = true;
			echo json_encode ( $arr );
			die ();
		} else {
			$arr ['success'] = false;
			echo json_encode ( $arr );
			die ();
		}
	}
	
	/**
	 * Description: map_release_put 发布、取消发布图层
	 * Author: lyndon
	 * Date:2015.11.4
	 */
	public function map_release_put() {
		$res = $this->mapLogic->releaseMap ();
		if ($res) {		
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/map_get' )
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/map_get' )
			) );
		}
	}
	
	/**
	 * Description: poi_get 显示poi管理列表
	 * Author: Jason
	 */
	public function poi_get_html() {
		$this->display ( 'Admin/poi_get' );
	}
	
	/**
	 * Description: poi_post 添加poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_post() {
		$res = $this->logic->addPoi ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Gis/admin/poi_get' )
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Gis/admin/poi_get' ) ,
					'msg'=>$this->logic->getError(),
			) );
		}
	}

	/**
	 * Description: poi_add
	 * Author: Jason
	 * Date:
	 */
	public function poi_add() {
		$tag=$this->tagLogic->getOptions();
		$this->assign('tag',$tag);
		$this->display ( 'Admin/poi_add' );
	}

	/**
	 * Description: poi_edit
	 * Author: Jason
	 * Date:
	 */
	public function poi_edit() {
		$id = I ( 'id' );
		$poi = $this->logic->getPoiDetail ( $id );
		$poi['tag_ids']=explode(",", $poi['tag_ids']);
		if (empty ( $poi ['many_image'] )) {
			$poi ['many_image'] = 'null';
		}
		$this->assign ( 'poi', $poi );
		$tag=$this->tagLogic->getOptions();
		$this->assign('tag',$tag);
		$this->display ( 'Admin/poi_edit' );
	}
	
	/**
	 * Description: poi_put 修改poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_put() {
		$res = $this->logic->savePoi ();
		if ($res!==false) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Gis/admin/poi_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Gis/admin/poi_get' ) ,
					'msg'=>$this->logic->getError(),
			) );
		}
	}
	
	/**
	 * Description: poi_delete 删除poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_delete() {
		$res = $this->logic->poi_delete ();
		if ($res) {
			$arr ['success'] = true;
			echo json_encode ( $arr );
			die ();
		} else {
			$arr ['success'] = false;
			echo json_encode ( $arr );
			die ();
		}
	}
	
	/**
	 * Description: poi_release_put 发布poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_release_put() {
		$res = $this->logic->releasePoi ();
		if ($res) {
		
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( 'gis/admin/poi','','.html')
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( 'gis/admin/poi','','.html')
			) );
		}
	}

	/**
	 * Description: poi_get_json
	 * Author: Jason
	 * Date:
	 */
	public function poi_get_json() {
		$result = $this->logic->getlist ();
		echo json_encode ( $result );
	}
	public function city_json() {
		$result = $this->logic->getCity ();
		echo json_encode ( $result );
	}
	
	/**
	 * Description: tag_index 标签管理
	 * Author: Ward
	 * Date:
	 */
	function tag_get_html() {
		$this->display ( 'tag_index' );
	}
	/**
	 * Description: tag_index 标签管理
	 * Author: Ward
	 * Date:
	 */
	function tag_get_json() {
		$res = $this->tagLogic->getLists ();
		echo json_encode ( $res );
	}
	
	/**
	 * Description: tag_add 添加标签页面
	 * Author: Ward
	 * Date:
	 */
	function tag_add() {
		$this->display ();
	}
	
	/**
	 * Description: tag_update 编辑标签页面
	 * Author: Ward
	 * Date:
	 */
	function tag_update() {
		$data = $this->tagLogic->getOne ();
		$this->assign ( 'data', $data );
		$this->display ();
	}
	
	/**
	 * Description: tag_post 添加标签数据
	 * Author: Ward
	 * Date:
	 */
	function tag_post() {
		$res = $this->tagLogic->add ();
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Gis/admin/tag.html' ),
					'msg' => $this->tagLogic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Gis/admin/tag.html' ) 
			)
			 );
		}
	}
	
	/**
	 * Description: tag_put 编辑标签数据
	 * Author: Ward
	 * Date:
	 */
	function tag_put() {
		$res = $this->tagLogic->edit ();
		if (false === $res) {
			
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Gis/admin/tag.html' ),
					'msg' => $this->tagLogic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Gis/admin/tag.html' ) 
			)
			 );
		}
	}
	
	/**
	 * Description: tag_delete 删除标签数据
	 * Author: Ward
	 * Date:
	 */
	function tag_delete() {
		$res = $this->tagLogic->delete ();
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Gis/admin/tag.html' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Gis/admin/tag.html' ) 
			) );
		}
	}

	/**
	 * Description: find_poi
	 * Author: Jason
	 * Date:
	 */
	function find_poi(){
		$res = $this->tagLogic->getarea();	
		$this->assign('lon',$res['lon']);
		$this->assign('lat',$res['lat']);
		$this->assign('name',$res['name']);
		$this->assign('address',$res['address']);
		$this->display();
	
			
	}
}