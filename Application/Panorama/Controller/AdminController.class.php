<?php
/**
 * @Copyright    : HQTEC
 * @Author       : jason
 * @Date         : 2015.10.22
 * @Description  : 全景管理控制器主要全景的数据操作
 */
namespace Panorama\Controller;

class AdminController extends \Common\Controller\AdminController {
    protected $grouplogic,$poilogic,$panologic,$hotlogic;

	function _init() {
		$this->grouplogic = new \Panorama\Logic\GroupLogic ();
		$this->poilogic = new \Gis\Logic\PoiLogic ();
		$this->panologic = new \Panorama\Logic\PanoLogic ();
		$this->hotlogic = new \Panorama\Logic\HotLogic ();
	}
	/**
	 * Description: index 显示全景管理界面、获取全景列表
	 * Author: Jason
	 * Date:
	 */
	public function index_get_html() {
		if(session('business'))
		{
			$_GET ['id']=session('business.poi_id');
		}
		if ($_GET ['id'] !== null) {
			$poi = $_GET ['id'];
			$hasPoi = '1';
			$poi_info=$this->poilogic->getPoiDetail($poi);
			$this->assign ( "poi_info", $poi_info );
			$this->assign ( "poi", $poi );
			$this->assign ( "hasPoi", $hasPoi );
		} else {
			$hasPoi = '0';
			$this->assign ( $hasPoi );
		}
		$this->display ( 'index' );
	}

    /**
     * Description: index_json 获取全景列表数据
     * Author: Jason
     * Date: 2015-11-26
     */
    public function index_json() {
        $start = intval ( I ( "get.start" ) );
        $length = intval ( I ( "get.limit" ) );
        $poi_id=intval ( I ( "get.id" ) );
		if(session('business'))
		{
			$poi_id=session('business.poi_id');
		}
        $where=array();
        if ($_GET ['suggest']) {
            $params['suggest']=$_GET ['suggest'];
        }
        if ($_GET ['pano']) {
            $params['pano_key']=$_GET['pano'];
        }

        if ($_GET ['status']) {
            $params['status']=$_GET['status'];
        }
		if($_GET['field'])
		{
			$params['sort_info']=$_GET['field'].' '.$_GET['direction'];
		}
        $result = $this->panologic->getListForJson ( $poi_id,$length,$start,'',$params);
        $this->ajaxReturn($result);
    }

    /**
     * Description: index_add_get_html 添加全景
     * Author: Jason
     * Date:
     */
	public function index_add_get_html() {
		$poi_id=intval(I('get.id'));
		if(session('business'))
		{
			$poi_id=session('business.poi_id');
		}
		$pois = $this->poilogic->getALLpoi ("ID,NAME,LAT,LON");
        $poi_arr=array();
        $suggest_data=array();
		$current_poi=array();

		if(session('business'))
		{
			foreach($pois as $poi)
			{
				if($poi['id']==$poi_id)
				{
					$current_poi=$poi;
					$poi_arr[$poi['name']]=$poi;
					$suggest_data[]=$poi['name'];
				}
			}
		}else{
			foreach($pois as $poi)
			{
				if($poi['id']==$poi_id)
				{
					$current_poi=$poi;
				}
				$poi_arr[$poi['name']]=$poi;
				$suggest_data[]=$poi['name'];
			}
		}
		$this->assign ( "items", json_encode($poi_arr,JSON_UNESCAPED_UNICODE) );
        $this->assign ( "suggest_data", json_encode($suggest_data,JSON_UNESCAPED_UNICODE) );
        $content = $this->fetch('upload_img');
        $this->assign('upload_template',html2js($content));
        $this->assign('poi',json_encode($current_poi,JSON_UNESCAPED_UNICODE));
		$this->display ( 'add' );
	}

    /**
     * Description: upload_img 上传全景图片
     * Author: Jason
     * Date:2015-12-03
     */
    function upload_img()
    {
        $file = $_FILES ['Filedata'];
        if (substr ( $file ['name'], - 4, 4 ) !== '.jpg') {
            $this->ajaxReturn ( array (
                'status' => 0,
                'msg' => '上传文件类型必须为jpg格式'
            ) );
            exit ();
        }
        $name = substr ($file['name'],0,-4);
        $img_info = getimagesize ( $file ['tmp_name'] );
        if ($img_info ["0"] != 8192 || $img_info ["1"] != 4096) {
            $this->ajaxReturn ( array (
                'status' => 0,
                'msg' => '上传文件大小必须为宽8192px高4096px'
            ) );
        }
        unset($img_info);
        $data ['POI_ID']=I('post.POI_ID');
		if(session('business'))
		{
			$data ['POI_ID']=session('business.poi_id');
		}
        $data ['TITLE']=$name;
        $res=$this->panologic->addPanoImage($data);
        if(!$res)
        {
            $this->ajaxReturn ( array (
                'status' => 0,
                'msg' => $this->panologic->getError ()
            ) );
        }

        $exts = array (
            'jpg'
        );
		if(!is_dir(C ( 'PANO_IMAGES_PATH' )))
		{
			mkdir(C ( 'PANO_IMAGES_PATH' ));
		}
        //$info ['pano_key']=$id;
        header ( "Access-Control-Allow-Origin:*" );
        $config = array (
            'maxSize' => 100 * 1024 * 1024, // 单位是b
            'savePath' => $res['PANO_KEY'] . '/',
            'saveName' => 'pano_origin',
            'rootPath' => C ( 'PANO_IMAGES_PATH' ),
            'autoSub' => false,
            // 'subName' => array('date','Ymd'),
            'replace' => true
        );
        $config ['exts'] = $exts;
        $upload = new \Think\Upload ( $config ); // 实例化上传类

        $info = $upload->upload ();
        if (! $info) { // 上传错误提示错误信息
            $this->panologic->deleteOne($res['ID']);
            $this->ajaxReturn ( array (
                'status' => 0,
                'msg' => $upload->getError ()
            ) );
            exit ();
        } else {
            $first = current ( $info );
            $file=$first ['savepath'] . $first ['savename'];
            $full_file=$config['rootPath'].$file;
            $thumb_file=$config['rootPath'].$first ['savepath'].'pano_origin_s.jpg';
            //内存不够用了
            unset($_FILES);
            unset($info);
            unset($first);
            $image=new \Think\Image();
            ini_set("memory_limit", "512M");
            $image->open($full_file)->thumb(160,80)->save($thumb_file);
            $this->panologic->saveOriginImg ( $res['ID'], $file );
            $this->ajaxReturn ( array (
                'status' => 1,
                'file' => $file,
                'id'=>$res['ID'],
                'title'=>$name
            ) );
        }
    }



	/**
	 * Description: catelist_get_json 获得分组
	 * Author: frima
	 * Date:2015-09-23
	 */
	public function cateList_get_json() {
		$group = $this->grouplogic->getGroup ( intval ( $_GET ['id'] ) );
		$this->ajaxReturn ( json_encode ( $group, JSON_UNESCAPED_UNICODE ) );
	}
	/**
	 * Description: map_post 添加全景
	 * Author: Jason
	 * Date:
	 */
	public function index_post() {
		$res = $this->panologic->addPano ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/index_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/index_get' ) 
			) );
		}
	}
	
	/**
	 * Description: map_put 修改全景
	 * Author: Jason
	 * Date:
	 */
	public function index_put() {

        $data=I('put.');
		$res = $this->panologic->savePano ($data);
		if ($res!==false) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/index_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/index_get' ) 
			) );
		}
	}


	public function index_update() {
		$id = I ( 'id' );
		$pano = $this->panologic->getPanoDetail ( $id );
		$this->assign ( "pano", $pano );
		$poi = $this->poilogic->getALLpoi ();
		$this->assign ( "poi", $poi );
		$group = $this->grouplogic->getGroup ( intval ( $pano ['poi_id'] ) );
		$this->assign ( "group", $group );
		$this->display ( "Admin/index_update" );
	}

    /**
     * Description: update_get_html 批量编辑全景
     * Author: Jason
     * Date:2015-12-08
     */
    function update_get_html()
    {
        $poi_id=intval(I('get.poi_id'));
		if(session('business'))
		{
			$poi_id=session('business.poi_id');
		}
        $pois = $this->poilogic->getALLpoi ("ID,NAME,LAT,LON");
        $poi_arr=array();
        $suggest_data=array();
        $current_poi=array();
        foreach($pois as $poi)
        {
            if($poi['id']==$poi_id)
            {
                $current_poi=$poi;
            }
            $poi_arr[$poi['name']]=$poi;
            $suggest_data[]=$poi['name'];
        }
        $this->assign('poi',json_encode($current_poi,JSON_UNESCAPED_UNICODE));
        $this->assign ( "items", json_encode($poi_arr,JSON_UNESCAPED_UNICODE) );
        $this->assign ( "suggest_data", json_encode($suggest_data,JSON_UNESCAPED_UNICODE) );
        $this->display('add');
    }
	
	/**
	 * Description: map_delete 删除全景
	 * Author: Jason
	 * Date:
	 */
	public function index_delete() {
        $id = I ( 'put.ids' );
		$res = $this->panologic->panoDelete ($id);
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Panorama/admin/index.html' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Panorama/admin/index.html' ) 
			) );
		}
	}

    /**
     * Description: map_delete 删除全景
     * Author: Jason
     * Date:
     */
    public function pano_delete_json() {
        $id = I ( 'put.id' );
        $res = $this->panologic->deleteOne($id);
        if (false === $res) {
            $this->ajaxReturn ( array (
                'status' => 0,
                'info' => $this->logic->getError ()
            ) );
        } else {
            $this->ajaxReturn ( array (
                'status' => 1
            ) );
        }
    }
	
	/**
	 * Description: map_release_put 发布全景
	 * Author: Jason
	 * Date:
	 */
	public function index_release_put() {

        $id=I('put.id');
        if($id)
        {
            $ids=array($id);
        }else{
            $ids=I('put.ids');
            if(!$ids)
            {
                $this->ajaxReturn ( array (
                    'status' => 0,
                    'msg'=>'参数错误'
                ) );
                exit();
            }
        }
        $unrel=I('put.unrel');
		$res = $this->panologic->releasePano ($ids,$unrel);
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		}
	}
	
	/**
	 * Description: cate_index 分组管理
	 * Author: Jason
	 * Date:
	 */
	function cate_index() {
		if ($_GET ['id'] !== null) {
			$poi = $_GET ['id'];
			$hasPoi = '1';
			$this->assign ( "poi", $poi );
			$this->assign ( "hasPoi", $hasPoi );
		} else {
			$hasPoi = '0';
			$this->assign ( $hasPoi );
		}
		$this->display ( 'Admin/cate_index' );
	}
	
	/**
	 * Description: cate_add 添加分组页面
	 * Author: Jason
	 * Date:
	 */
	function cate_add() {
		if ($_GET ['id'] !== null) {
			$poi = $this->poilogic->getOnepoi ( intval ( $_GET ['id'] ) );		
			$this->assign ( "poi", $poi );
		} else {
			$poi = $this->poilogic->getALLpoi ();
			$this->assign ( "poi", $poi );
		}
		$group = $this->grouplogic->getALLGroup ();
		$this->assign ( "group", $group );
		$this->display ( 'Admin/cate_add' );
	}
	
	/**
	 * Description: cate_update 编辑分组页面
	 * Author: Jason
	 * Date:
	 */
	function cate_update() {
		$id = I ( 'id' );
		$poi = $this->poilogic->getALLpoi ();
		$this->assign ( "poi", $poi );
		$group = $this->grouplogic->getGroupDetail ( $id );
		$this->assign ( 'group', $group );
		$this->display ( 'Admin/cate_update' );
	}
	
	/**
	 * Description: cate_post 添加分组数据
	 * Author: Jason
	 * Date:
	 */
	function cate_post_json() {
		$res = $this->grouplogic->addGroup ();
		if ($res) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/cate_index'),
                    'id'=>$res
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/cate_index' ),
                    'info'=>'添加分组失败'
			) );
		}
	}
	
	/**
	 * Description: cate_put 编辑分组数据
	 * Author: Jason
	 * Date:
	 */
	function cate_put()
	{
		$res = $this->grouplogic->saveGroup ();
		if ($res !== false) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/cate_index' )
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/cate_index' ) 
			) );
		}
	}

    /**
     * Description: step3 添加全景第三步操作数据保存
     * Author: Jason
     * Date:2015-11-30
     */
    function step3_post_json()
    {
        $groupdata=$_POST['groups'];
        $panodata=$_POST['panos'];
        $res = $this->grouplogic->updateGroupAll ($groupdata);
        $res = $this->panologic->updateAllGroup ($panodata);
        if ($res !== false) {

            $this->ajaxReturn ( array (
                'status' => 1,
                'info' => '操作完成'
            ) );
        } else {
            $this->ajaxReturn ( array (
                'status' => 0,
                'info' => '更新失败'
            ) );
        }
    }
	
	/**
	 * Description: cate_delete 删除分组数据
	 * Author: Jason
	 * Date:
	 */
	function cate_delete() {
		$res = $this->grouplogic->cate_delete ();
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
     * Description: cate_delete_json
     * Author: Jason
     * Date:2015-12-01
     */
    function cate_delete_json() {
        $res = $this->grouplogic->cate_delete ();
        if ($res) {
            $this->ajaxReturn ( array (
                'status' => 1,
                'info' => '删除成功'
            ) );
        } else {
            $this->ajaxReturn ( array (
                'status' => 0,
                'info' =>'删除失败'
            ) );
        }
    }

    /**
 * Description: list_hot_get_html 全景列表（用于热点管理）
 * Author: Jason
 * Date:2015-12-08
 */
    function list_hot_get_html()
    {
        $this->display('list_hot');
    }

    /**
     * Description: index_json 获取全景列表数据（用于热点管理）
     * Author: Jason
     * Date: 2015-12-09
     */
    public function list_hot_get_json() {
        $start = intval ( I ( "get.start" ) );
        $length = intval ( I ( "get.limit" ) );
        $poi_id=intval ( I ( "get.id" ) );
        $where=array();
        if ($_GET ['suggest']) {
            $params['suggest']=$_GET ['suggest'];
        }
        if ($_GET ['pano']) {
            $params['pano_key']=$_GET['pano'];
        }
		if($_GET['field'])
		{
			$params['sort_info']=$_GET['field'].' '.$_GET['direction'];
		}
        $params['forhot']=1;
        $result = $this->panologic->getListForJson ( $poi_id,$length,$start,'',$params);
        $this->ajaxReturn($result);
    }

    /**
     * Description: list_hot_get_html 全景列表（用于批量制作全景）
     * Author: Jason
     * Date:2015-12-08
     */
    function list_make_get_html()
    {
        $this->display('list_make');
    }

    /**
     * Description: index_json 获取全景列表数据（用于批量制作全景）
     * Author: Jason
     * Date: 2015-12-09
     */
    public function list_make_get_json() {
        $start = intval ( I ( "get.start" ) );
        $length = intval ( I ( "get.limit" ) );
        $poi_id=intval ( I ( "get.id" ) );

        $where=array();
        if ($_GET ['suggest']) {
            $params['suggest']=$_GET ['suggest'];
        }
        if ($_GET ['pano']) {
            $params['pano_key']=$_GET['pano'];
        }
		if($_GET['field'])
		{
			$params['sort_info']=$_GET['field'].' '.$_GET['direction'];
		}
        $params['formake']=1;
        $result = $this->panologic->getListForJson ( $poi_id,$length,$start,'',$params);
        $this->ajaxReturn($result);
    }

    /**
     * Description: list_hot_get_html 全景列表（用于批量发布全景）
     * Author: Jason
     * Date:2015-12-08
     */
    function list_release_get_html()
    {
        $this->display('list_release');
    }

    /**
     * Description: index_json 获取全景列表数据（用于批量发布全景）
     * Author: Jason
     * Date: 2015-12-09
     */
    public function list_release_get_json() {
        $start = intval ( I ( "get.start" ) );
        $length = intval ( I ( "get.limit" ) );
        $poi_id=intval ( I ( "get.id" ) );
        $where=array();
        if ($_GET ['suggest']) {
            $params['suggest']=$_GET ['suggest'];
        }
        if ($_GET ['pano']) {
            $params['pano_key']=$_GET['pano'];
        }
		if($_GET['field'])
		{
			$params['sort_info']=$_GET['field'].' '.$_GET['direction'];
		}

		if($_GET['status'])
		{
			$params['status']=$_GET['status'];
		}
		//$params['sort_info']

        $params['forrelease']=1;
        $result = $this->panologic->getListForJson ( $poi_id,$length,$start,'',$params);
        $this->ajaxReturn($result);
    }



	/**
	 * Description: hot_get 显示某个全景的热点管理列表
	 * Author: Jason、
	 * Date:
	 */
	public function hot_get() {
		if ($_GET ['id'] !== null) {
			$pano = $_GET ['id'];
			$hasPano = '1';
			$this->assign ( "pano", $pano );
			$this->assign ( "hasPano", $hasPano );
			$poi = $this->panologic->getPanoPoi ( $pano );
			$this->assign ( "poi", $poi );
		} else {
			$hasPano = '0';
			$this->assign ( $hasPano );
		}
		// updated by frima
		$this->display ( 'hot_get' );
	}
	
	/**
	 * Description: hot_post 添加热点
	 * Author: Jason
	 * Date:
	 */
	public function hot_post() {
		$res = $this->hotlogic->addHot ();
		if ($res) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		}
	}
	
	/**
	 * Description: hot_put 修改热点
	 * Author: Jason
	 * Date:
	 */
	public function hot_put() {
		$res = $this->hotlogic->saveHot ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		}
	}

	public function hot_release() {
		$res = $this->hotlogic->releaseHot ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		}
	}
	/**
	 * Description: hot_delete 删除热点
	 * Author: Jason
	 * Date:
	 */
	public function hot_delete() {
		$res = $this->hotlogic->deleteHot ();
		if ($res) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		}
	}
	function hot_add() {
		if ($_GET ['id'] !== null) {
			$pano = $this->panologic->getOnePano ( intval ( $_GET ['id'] ) );
		} else {
			$pano = $this->panologic->getALLPano ();
		}
		$this->assign ( "pano", $pano );
		$this->display ( 'Admin/hot_add' );
	}
	function hot_update() {
		$id = I ( 'id' );
		$pano = $this->panologic->getALLPano ();
		$detail = $this->hotlogic->getHotDetail ( $id );
		$this->assign ( "pano", $pano );
		$this->assign ( "detail", $detail );
		$this->display ( 'Admin/hot_update' );
	}
	
	/**
	 * Description: hot_copy_put 复制热点
	 * Author: Jason
	 * Date:
	 */
	public function hot_copy_post() {
	}

	/**
	 * Description: cate_json 获取某个poi点的全景分组数据
	 * Author: Jason
	 * Date:2015-11-26
	 */
	public function cate_json() {
		$poi_id=intval ( I ( "get.poi_id" ) );
		if(!$poi_id)
		{
			$this->ajaxReturn(array('status'=>0,'info'=>'参数不存在'));
		}
		$result = $this->grouplogic->getListOfPoi ( intval ( $_GET ['poi_id'] ) );
		$this->ajaxReturn(array('status'=>1,'data'=>$result));

	}



    /**
     * Description: pano_put_json更新单个全景
     * Author: Jason
     * Date:2015-11-30
     */
    function pano_put_json()
    {
        $data=I('put.data');
        $data=array(
            'ID'=>$data['id'],
            'TITLE'=>$data['title'],
            'LAT'=>$data['lat'],
            'LON'=>$data['lon'],
            'INTRODUCTION'=>$data['introduction'],
            'LISTORDER'=>$data['listorder'],
            'SEASON'=>$data['season']
        );
        $res = $this->panologic->savePano ($data);
        if ($res!==false) {

            $this->ajaxReturn ( array (
                'status' => 1,
                'info' => '保存成功'
            ) );
        } else {
            $this->ajaxReturn ( array (
                'status' => 0,
                'info' => $this->panologic->getError()
            ) );
        }
    }
    /**
     * Description: pano_put_json更新所有全景
     * Author: Jason
     * Date:2015-11-30
     */
    function panos_put_json()
    {
        $panos=I('put.panos');
        foreach($panos as $data)
        {
            $save_data=array(
                'ID'=>$data['id'],
                'TITLE'=>$data['title'],
                'LAT'=>$data['lat'],
                'LON'=>$data['lon'],
                'INTRODUCTION'=>$data['introduction'],
                'LISTORDER'=>$data['listorder'],
                'SEASON'=>$data['season']
            );
            if(isset($data['pano_status']))
            {
                if($data['pano_status']==1||$data['pano_status']==2)
                {
                    $save_data['PANO_STATUS']=$data['pano_status'];
                }else{
                    $save_data['PANO_STATUS']=4;
                }
            }else{
                $save_data['PANO_STATUS']=4;
            }
            $res = $this->panologic->savePano ($save_data);
        }

        if ($res!==false) {

            $this->ajaxReturn ( array (
                'status' => 1,
                'info' => '保存成功'
            ) );
        } else {
            $this->ajaxReturn ( array (
                'status' => 0,
                'info' => $this->panologic->getError()
            ) );
        }
    }

    /**
     * Description: poi_pano_get_json 获取某个poi点的全景数据
     * Author: Jason
     * Date:2015-11-26
     */
    public function poi_pano_get_json()
    {
        $poi_id=intval ( I ( "get.poi_id" ) );
		if(session('business'))
		{
			$poi_id=session('business.poi_id');
		}
		if(!$poi_id)
		{
			$this->ajaxReturn(array('status'=>0,'info'=>'参数不存在'));
		}
        $result = $this->panologic->getPanosOfPoi ( $poi_id);
        $this->ajaxReturn(array('status'=>1,'data'=>$result));
    }

	public function select_json() {
		$suggest = $_POST ['suggest'];		
		$poi = $this->poilogic->getPoiName ( $suggest );
		//var_dump($poi);
		$str = json_encode($poi);
		$callback = $_GET ['callback'];
		echo $callback . "(" . $str . ")";
		die ();
	}
	public function hot_json() {
		if ($_GET ['id'] !== null) {
			$result = $this->hotlogic->getListForJson ( intval ( $_GET ['id'] ) );
		} else {
			$result = $this->hotlogic->getListForJson ();
		}
		
		echo json_encode ( $result );
	}

	
	/**
	 * Description: upload 上传全景
	 * Author: Jason
	 * Date:
	 */
	function upload() {
		$id = I ( 'get.id' );
		$info = $this->panologic->getPanoDetail ( $id );
		if (! $info) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => '上传参数错误' 
			) );
			exit ();
		}
		$file = $_FILES ['Filedata'];
		if (substr ( $file ['name'], - 4, 4 ) !== '.jpg') {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => '上传文件类型必须为jpg格式,大小必须为宽8192px高4096px' 
			) );
			exit ();
		}
		$img_info = getimagesize ( $file ['tmp_name'] );
		if ($img_info ["0"] != 8192 || $img_info ["1"] != 4096) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => '上传文件大小必须为宽8192px高4096px,类型必须为jpg格式' 
			) );
		}
		$exts = array (
				'jpg' 
		);
		header ( "Access-Control-Allow-Origin:*" );
		$config = array (
				'maxSize' => 100 * 1024 * 1024, // 单位是b
				'savePath' => $info ['pano_key'] . '/',
				'saveName' => 'pano_origin',
				'rootPath' => C ( 'PANO_IMAGES_PATH' ),
				'autoSub' => false,
				
				// 'subName' => array('date','Ymd'),
				'replace' => true 
		);
		$config ['exts'] = $exts;
		$upload = new \Think\Upload ( $config ); // 实例化上传类
		
		$info = $upload->upload ();
		if (! $info) { // 上传错误提示错误信息
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $upload->getError () 
			) );
			exit ();
		} else {
			$first = current ( $info );
            $image = new \Think\Image ();
            $image->open ( $config ['rootPath'] . $first ['savepath'] . $first ['savename'] );
            $image->thumb ( 160, 80 )->save ( $config ['rootPath'] . $first ['savepath'] . 'pano_origin_s.jpg' );

			$this->panologic->saveOriginImg ( $id, $first ['savepath'] . $first ['savename'] );
			$this->ajaxReturn ( array (
					'status' => 1,
					'file' => $first ['savepath'] . $first ['savename'] 
			) );
		}
	}

    function uploadthumb()
    {
        $dirname='pano';
        $pano_key=$_GET['pano_key'];
        header("Access-Control-Allow-Origin:*");
        $config = array(
            'maxSize'    =>    100*1024*1024,  //单位是b
            'savePath'   =>    $pano_key.'/',
            'saveName'   =>    array('date','Y-m-d-H-i-s'.rand(1,100)),
            'rootPath'   =>   C ( 'PANO_IMAGES_PATH' ),
            'autoSub'    =>    true,
            'subName'    =>    array('date','Ymd'),
        );
        $config['exts'] = array('jpg', 'jpeg', 'png');
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
                'file'=>$first['savepath'].$first['savename'],'size'=>$first['size'],
                'width'=>$imgArr[0],'height'=>$imgArr[1]));
        }
    }

    /**
     * Description: creation_post_json 生成全景
     * Author: Jason
     * Date:
     */
	function creation_post_json() {
		ignore_user_abort ( true );
		$id = $_POST ['id'];
        if($id)
        {
            $res = $this->panologic->makePano ( $id );
        }else{
            $ids = $_POST ['ids'];
            if($ids)
            {
                foreach($ids as $id)
                {
                    $this->panologic->makePano ( $id );
                }
                $res=true;
            }else{
                $res=false;
            }
        }
		if (! $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $this->panologic->getError () 
			) );
			exit ();
		} else {
			$this->ajaxReturn ( array (
					'status' => 1 
			) );
		}
	}

	/**
	 * Description: reset_poi 重置poi点的全景状态
	 * Author: Jason
	 * Date:2016-03-02
	 */
	function reset_poi()
	{
		$this->panologic->checkAllPoiPanos ();
		echo "重新调整poi点全景状态完成";
	}

}