<?php

namespace Panorama\Logic;

class PanoLogic extends \Think\Model {
	protected $model;
	public function _initialize() {
		$this->model = new \Panorama\Model\PanoModel ();
		$this->poiModel = new \Gis\Model\PoiModel ();
	}
	
	
	/**
	 * Description: list_get 获取全景详细数据
	 * Author: ward
	 * Param: $panokey('id'=>'全景的key')
	 * Date:2015-12-04
     * recoder:jason
	 */
	public function getPano($panokey) {
        $where ['A.PANO_KEY'] = $panokey;
        if(!session('admin'))
        {
            $where ['A.POST_STATUS'] = 1;
        }
        $where ['A.STATUS'] = 1;
		$field = 'A.*,B.NAME,B.IMAGE,B.DESCRIPTION,B.LAT,B.LON,B.ADDRESS';
		$res = $this->model->alias ( 'A' )->join ("LEFT JOIN __POI__ B ON A.POI_ID=B.ID")->where ( $where )->field ( $field )->find ();
		
		if (! empty ( $res ['poi_id'] )) {
			$map = array (
					'ID' => intval ( $res ['poi_id'] ) 
			);
			$arr = $this->poiModel->where ( $map )->find ();
			$res ['poi_data'] = $arr;
		}
		return $res;
	}

    /**
     * Description: getPanoSeason 获取全景季节
     * @param $panokey
     * @return mixed
     * Author: Jason
     * Date:2016-02-22
     */
    function getPanoSeason($panokey) {
        $where ['PANO_KEY'] = $panokey;
        $where ['STATUS'] = 1;
        $field = 'SEASON';
        $res = $this->model->where ( $where )->getField ( $field );
        if($res==0)
        {
            $month=date('m');
            if($month<3)
            {
                $month=+12;
            }
            $season=ceil(($month-2)/3);
            return $season;
        }
        return $res;
    }
	
	/**
	 * Description: list_get 获取poi点下面全景列表数据
	 * Author: ward
	 * Param: $poi_id int  poi点id
	 * Date: 2015-12-04
     * recoder:jason
	 */
	public function getDataByPoi($poi_id=0,$season=0){
	
		if($poi_id){
			$where ['POI_ID'] = intval($poi_id);
		}else{
			return false;
		}
        if(!$season)
        {
            $month=date('m');
            if($month<3)
            {
                $month=+12;
            }
            $season=ceil(($month-2)/3);
            $where['STATUS']=1;
            $where['POST_STATUS']=1;
            $list=$this->model->field('ID,PANO_KEY,SEASON')->where($where)->order('LISTORDER DESC')->select();
            if(!$list)
            {
                return false;
            }else{
                $tmp_arr=array();
                foreach($list as $item)
                {
                    if($item['season']==$season||$item['season']==0)
                    {
                        $data=$item;
                        $data['current_season']=$season;
                        break;
                    }
                    if(!isset($tmp_arr[$item['season']]))
                    {
                        $tmp_arr[$item['season']]=$item;
                    }
                }
                if(isset($data))
                {
                    return $data;
                }
                //不存在当季数据，顺延
                for($i=1;$i<4;$i++)
                {
                    $season++;
                    if($season>4)
                    {
                        $season=$season-4;
                    }
                    if(isset($tmp_arr[$season]))
                    {
                        $data=$tmp_arr[$season];
                        $data['current_season']=$season;
                        break;
                    }
                }
                if(isset($data))
                {
                    return $data;
                }else{
                    $data=$list[0];
                    $data['current_season']=$list[0]['season'];
                }
            }
            return $data;
        }else{
            $where['STATUS']=1;
            $where['POST_STATUS']=1;
            $where['SEASON']=array('in',array(0,$season));
            $data=$this->model->where($where)->order('LISTORDER DESC')->find();
            if(!$data)
            {
                return false;
            }
            $data['current_season']=$season;
            return $data;
        }
	}
	
	/**
	 * Description: 后台全景list
     * @$poi_id  位置点的id
	 * recoder: Jason
	 * Date: 2015-11-26
	 */
    /**
     * Description: getListForJson 后台全景list
     * @param int $poi_id 位置点的id
     * @param int $length 长度 0表示不限长度
     * @param int $start 开始位置
     * @param string $field 获取字段
     * @return mixed
     * Author: Jason
     * Date:2015-12-08
     */
	public function getListForJson($poi_id = 0,$length=0,$start=0,$field='',$params=array()) {
        if(!$field)
        {
            $field = 'A.*,B.NAME as bname,B.ID as bid, C.NAME as cname';
        }
        $where=array();
		if ($poi_id) {
			$where ['A.POI_ID'] = $poi_id;
		}
        if(isset($params['suggest']))
        {
            $where ['B.NAME'] = array (
                "like",
                "%" . $params ['suggest'] . "%"
            );
        }

		if (isset($params ['pano_key'])){
			$where ['A.PANO_KEY'] = array(
					"eq",
                $params ['pano_key']
			);
		}

        if (isset($params ['status'])){
            if($params ['status']==1)
            {
                $where ['A.PANO_STATUS'] = 0;
            }
            if($params ['status']==2)
            {
                $where ['A.PANO_STATUS'] = array('in',array(1,4));
            }
            if($params ['status']==3)
            {
                $where ['A.PANO_STATUS'] = 3;
            }
            if($params ['status']==4)
            {
                $where ['A.PANO_STATUS'] = 2;
                $where ['A.POST_STATUS'] = 0;
            }
            if($params ['status']==5)
            {
                $where ['A.PANO_STATUS'] = 2;
                $where ['A.POST_STATUS'] = 1;
            }

        }

        if (isset($params ['forhot'])){
            if($params ['forhot']==1)
            {
                $where ['A.PANO_STATUS'] = 2;
            }
        }

        if (isset($params ['formake'])){
            if($params ['formake']==1)
            {
                $where ['A.PANO_STATUS'] = array('in',array(0,3));
            }
        }

        if (isset($params ['forrelease'])){
            if($params ['forrelease']==1)
            {
                $where ['A.PANO_STATUS'] = 2;
            }
        }
        if(isset($params['sort_info'])&&$params['sort_info'])
        {
            $order=$params['sort_info'].',A.LISTORDER DESC,A.ID DESC';
        }else{
            $order='A.LISTORDER DESC,A.ID DESC';
        }

		
		$where ['A.STATUS'] = 1;
		$join = " LEFT JOIN __POI__ B ON A.POI_ID=B.ID LEFT JOIN __PANORAMA_GROUP__ AS C ON A.GROUP_ID=C.ID";
        if($length)
        {
            $list = $this->model->alias ( 'A' )->join ( $join )->where ( $where )->field ( $field )->limit ( $start . ',' . $length )->order($order)->select ();
            $count = $this->model->alias ( 'A' )->join ( $join )->where ( $where )->field ( $field )->count ();
        }else{
            $list = $this->model->alias ( 'A' )->join ( $join )->where ( $where )->field ( $field )->select ();
            $count = count($list);
        }


		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}

    /**
     * Description: getPanosOfPoi
     * @param $poi_id 位置点ID
     * Author: Jason
     * Date:2015-11-26
     */
    function getPanosOfPoi($poi_id)
    {
        $where ['POI_ID'] = $poi_id;
        $where ['STATUS'] = 1;
        return $this->model->where ( $where )->select();
    }
	
	/**
	 * Description: 得到全景详情
	 * Author: Jason
	 * Date:
	 */
	function getPanoDetail($id) {
		$where ['ID'] = $id;
		$pano = $this->model->where ( $where )->find ();
		return $pano;
	}
    /**
     * Description: addPano 添加全景
     * @param string $data
     * @return bool
     * Author: Jason
     * Date:2015-12-03
     */
	function addPano($data='') {
        if($data)
        {
            $data=$_POST;
        }
		if ($data = $this->model->create ($data)) {
            $data['CREATE_DATE']=toDate();
			$res = $this->model->add ( $data );
			AdminLog($res, 1, json_encode($data), "添加全景");
			if (! $res) {
				echo $this->model->getDbError ();
				return false;
			}
			if($data ['POI_ID'])
            {
                $arr = $this->poiModel->where ( array (
                    'id' => intval ( $data ['POI_ID'] )
                ) )->find ();
                $str = $arr ['area'] . 'AA' . date ( 'ymd' ) . sprintf ( "%09d", $res );
                $this->model->save ( array (
                    'ID' => $res,
                    'PANO_KEY' => $str
                ) );
            }
			return $res;
		} else {
			$this->model->getError ();
			return false;
		}
	}

    /**
     * Description: addPanoImage 新增全景图片获取全景ID
     * @param string $data
     * @return mixed
     * Author: Jason
     * Date:2015-11-23
     */
    function addPanoImage($data='')
    {
        if(!$data)
        {
            $data=$_POST;
        }
        $data['CREATE_DATE']=toDate();
        if(!$data ['POI_ID'])
        {
            $this->setError('POI_ID不存在');
            return false;
        }
        $res=$this->model->add ( $data );
        AdminLog($res, 1, json_encode($data), "新增全景图片");
        if (!$res) {
            $this->setError($this->model->getDbError());
            return false;
        }

        $arr = $this->poiModel->where ( array (
            'id' => intval ( $data ['POI_ID'] )
        ) )->find ();
        $str = $arr ['area'] . 'AA' . date ( 'ymd' ) . sprintf ( "%09d", $res );
        $data=array (
            'ID' => $res,
            'PANO_KEY' => $str
        );
        $r=$this->model->where(array('ID'=>$res))->save (array ('PANO_KEY' => $str));
        if($r!==false)
        {
            return $data;
        }else{
            $this->setError('保存panokey数据失败');
            return false;
        }

    }
	
	/**
	 * Description: 编辑全景
	 * 
	 * @param $data 修改的全景数据
	 * @return mixed
     * Author: Jason
	 * Date:2015-11-30
	 */
	function savePano($data) {
        $last_poi_id=$data['LAST_POI_ID'];
		if ($data = $this->model->create ( $data )) {
            $data['UPDATE_DATE']=toDate();
			$res = $this->model->save ( $data );
            AdminLog($data['ID'], 2, json_encode($data), "编辑全景");
			if ($res===false) {
                $this->setError($this->model->getDbError ());
				return false;
			}
            //修改全景后如果poi点变化设置
            if($last_poi_id&&$last_poi_id!=$data['POI_ID'])
            {
                $res=$this->model->field('max(POST_STATUS) as post_status')->where ( array('POI_ID'=>$last_poi_id,'STATUS'=>1) )->group('POI_ID')->find();
                if($res['post_status']==0)
                {
                    $this->poiModel->save(array('ID'=>$last_poi_id,'HAVE_PANO'=>0));
                }
                if($data['POST_STATUS']==1)
                {
                    $this->poiModel->save(array('ID'=>$data['POI_ID'],'HAVE_PANO'=>1));
                }
            }
			return $res;
		} else {
			$this->setError($this->model->getError ());
			return false;
		}
	}

    /**
     * Description: updateAll 更新所有数据的分组信息
     * @param $data
     * @return bool
     * Author: Jason
     * Date:2015-11-30
     */
    function updateAllGroup($data)
    {
        foreach($data as $key=>$value)
        {
            $this->model->save (array('ID'=>$value['id'],'GROUP_ID'=>$value['group_id'],'UPDATE_DATE'=>toDate()));
        }
        return true;
    }
	
	/**
	 * Description: 全部全景
	 * Author: liuzhaojun
	 * Date:
	 */
	function getALLPano() {
		$poi = $this->model->select ();
		return $poi;
	}
	function getOnePano($id) {
		$poi = $this->model->where ( "id=" . $id )->select ();
		return $poi;
	}
	function getPanoPoi($id) {
		$where ['ID'] = intval ( $id );
		$poi = $this->model->where ( $where )->getField ( 'POI_ID' );
		return $poi;
	}
	
	/**
	 * Description: 删除pano
	 * 
	 * @param
	 *        	$id
	 * @param
	 *        	$img_path
	 * @return mixed Author: Jason
	 *         Date:
	 */
	function panoDelete($ids) {

		$where ['ID'] = array (
				'in',
                $ids
		);
		$data ['STATUS'] = 0;
		$res = $this->model->where ( $where )->save ( $data );
		return $res;
	}

    /**
     * Description: deleteOne 逻辑删除一条全景数据
     * @param $id 全景ID
     * Author: Jason
     * Date:2015-11-27
     */
    function deleteOne($id)
    {
        $where ['ID'] = $id;
        $data ['STATUS'] = 0;
        return $this->model->where( $where )->save( $data );
    }
	/**
	 * Description: saveOriginImg 保存上传原图
	 * 
	 * @param
	 *        	$id
	 * @param
	 *        	$img_path
	 * @return mixed
     * Author: Jason
	 * Date:2015-09-15
	 */
	function saveOriginImg($id, $img_path) {
		
		return $this->model->save ( array (
				'ID' => $id,
				'ORIGIN_IMG' => $img_path,
				'PANO_STATUS' => 0 
		) );
		
	}
	
	/**
	 * Description: makePano创建全景
	 * 
	 * @param $id Author:
	 *        	Jason
	 *        	Date:2015-09-15
	 */
	function makePano($id) {
		$info = $this->model->find ($id);
        if($info['pano_status']==2||$info['pano_status']==1)
        {
            $this->setError('全景已生成或正在制作中');
            return false;
        }
		$data ['ID'] = $info ['id'];
        $img = C ( 'PANO_IMAGES_PATH' ) . $info ['origin_img'];
        if(!file_exists($img))
        {
            $data ['PANO_STATUS'] = 3;
            $this->setError('全景原文件不存在');
            $this->model->save ( $data );
            return false;
        }
		$data ['PANO_STATUS'] = 4;
		$this->model->save ( $data );
		AdminLog($data['ID'], 2, json_encode($data), "制作全景排队");
        return true;
	}

    /**
     * Description: makePanos 批量制作全景 EXE后台执行,请勿随意调用
     * Author: Jason
     * Date:2015-12-03
     */
    function makePanos()
    {
        $where['STATUS']=1;
        $where['PANO_STATUS']=4;
        $panos=$this->model->where($where)->select ();
        foreach($panos as $pano)
        {
            $data ['ID'] = $pano ['id'];
            $data ['PANO_STATUS'] = 1;
            $this->model->save ( $data );
            $img = C ( 'PANO_IMAGES_PATH' ) . $pano ['origin_img'];
            if(file_exists($img))
            {
                $res = exec ( C ( 'PANO_TOOLS_PATH' ) . ' makepano -config=templates/hqt.config ' . $img, $output, $status );

                if ($status == 0) {
                    tp_log ( 'ID:'.$pano ['id'].' 操作状态:' . $status,'INFO','makepano');
                    $thumb=str_replace('pano_origin.jpg','thumb.jpg',$pano ['origin_img']);
                    if(file_exists(C ( 'PANO_IMAGES_PATH' ).$thumb))
                    {
                        $data['IMAGE_URI']=$thumb;
                    }else{
                        $data['IMAGE_URI']='';
                    }
                    $data ['PANO_STATUS'] = 2;
                    $this->model->save ( $data );
                } else {
                    tp_log ('ID:'.$pano ['id'].' 操作状态:' . $status,'ERR','makepano');
                    $data ['PANO_STATUS'] = 3;
                    $this->model->save ( $data );
                }
            }else{
                $data ['PANO_STATUS'] = 3;
                tp_log('全景原文件不存在','ERR','makepano');
                $this->model->save ( $data );
            }
        }
    }


	/**
	 * Description: releasePano发布全景
	 * 
	 * @param $id Author:
	 *        	frima
	 *        	Date:2015-12-08
     * recoder： jason
	 */
	function releasePano($ids,$unrel=false) {
		$where ['ID'] = array('in',$ids);
		if ($unrel) {
			$data ['POST_STATUS'] = 0;
		} else {
			$data ['POST_STATUS'] = 1;
		}
		$res = $this->model->where ( $where )->save ( $data );
		AdminLog(implode(',',$ids), 2, json_encode($data), "发布全景");
        if($unrel)
        {
            $where['STATUS']=1;
            $poi_list=$this->model->field('POI_ID')->where ( $where )->group('POI_ID')->select();
            foreach($poi_list as $poi)
            {
                $res=$this->model->field('max(POST_STATUS) as post_status')->where ( array('POI_ID'=>$poi['poi_id'],'STATUS'=>1) )->group('POI_ID')->find();
                if($res['post_status']==0)
                {
                    $this->poiModel->save(array('ID'=>$poi['poi_id'],'HAVE_PANO'=>0));
                }
            }
        }else{
            $where['POST_STATUS']=1;
            $where['STATUS']=1;
            $poi_list=$this->model->field('POI_ID')->where ( $where )->group('POI_ID')->select();
            foreach($poi_list as $poi)
            {
                $this->poiModel->save(array('ID'=>$poi['poi_id'],'HAVE_PANO'=>1));
            }
        }

		if (! $res) {
			$this->setError($this->model->getError ());
			return false;
		}
		return $res;
	}

    /**
     * Description: poiHasPano 更改poi点是否有全景的状态
     * @param $poi_id
     * Author: Jason
     * Date:2016-03-02
     */
    function poiHasPano($poi_id)
    {
        $res=$this->model->field('max(POST_STATUS) as post_status')->where ( array('POI_ID'=>$poi_id,'STATUS'=>1) )->group('POI_ID')->find();
        if($res['post_status']==0)
        {
            $this->poiModel->save(array('ID'=>$poi_id,'HAVE_PANO'=>0));
        }else{
            $this->poiModel->save(array('ID'=>$poi_id,'HAVE_PANO'=>1));
        }
    }

    /**
     * Description: comingCall
     * @param $data
     * @return bool|mixed
     * Author: Jason
     * Date:2016.02.22
     */
    function comingCall($data)
    {
        if(!C('PANO_API_WEBSERVICE'))
        {
            return false;
        }
        $option=array(
            'soap_version'=>SOAP_1_1,
            'exceptions'=>true,
            'trace'=>1,
            'cache_wsdl'=>WSDL_CACHE_NONE
        );
        $soap = new \SoapClient(C('PANO_API_WEBSERVICE'),$option);
        $infos=array(
            'yhzh'=>$data['yhzh'],
            'dhhm'=>$data['dhhm'],
            'x'=>$data['x'],
            'y'=>$data['y'],
            'qjid'=>$data['qjid'],
            'jd'=>$data['jd'],
            'address'=>$data['address'],
            'ptlx'=>'hqtec',
        );
        $xml=$this->arrayToZrXml($infos);
        $params=array(
            'interfaceKey'=>C('INTERFACE_KEY'),
            'methodName'=>'comingCall',
            'xml'=>$xml
        );
        //$result = $soap->execute(C('INTERFACE_KEY'),'comingCall',$xml);
        $result = $soap->__soapCall('execute',array('parameters'=>$params));
        $str = base64_decode($result->return);
        $result=gzdecode($str);
        return $result;
    }

    /**
     * Description: subscribeCall
     * @param $data
     * @return bool|mixed
     * Author: Jason
     * Date:
     */
    function subscribeCall($data)
    {
        if(!C('PANO_API_WEBSERVICE'))
        {
            return false;
        }
        $soap = new \SoapClient(C('PANO_API_WEBSERVICE'),array("trace" =>true,"connection_timeout"=>800));
        //non-wsdl方式调用web service
        //在non-wsdl方式中option location系必须提供的,而服务端的location是选择性的，可以不提供
        //$soap = new SoapClient(null,array('location'=>"http://localhost/Test/MyService/Server.php",'uri'=>'Server.php'));
        //两种调用方式，直接调用方法，和用__soapCall简接调用
        $infos=array(
            'yylb'=>$data['yylb'],
            'dhhm'=>$data['dhhm']
        );
        $params=array(
            'interfaceKey'=>C('INTERFACE_KEY'),
            'methodName'=>'subscribeCall',
            'xml'=>$this->arrayToZrXml($infos)
        );
        //$result = $soap->execute(C('INTERFACE_KEY'),'subscribeCall',$this->arrayToZrXml($infos));
        $result = $soap->__soapCall('execute',array('parameters'=>$params));
        $str = base64_decode($result->return);
        $result=gzdecode($str);
        return $result;
    }

    /**
     * Description: processingMessage
     * @param $data
     * @return bool|mixed
     * Author: Jason
     * Date:
     */
    function processingMessage($data)
    {
        if(!C('PANO_API_WEBSERVICE'))
        {
            return false;
        }
        $soap = new \SoapClient(C('PANO_API_WEBSERVICE'),array("trace" =>true,"connection_timeout"=>800));
        //non-wsdl方式调用web service
        //在non-wsdl方式中option location系必须提供的,而服务端的location是选择性的，可以不提供
        //$soap = new SoapClient(null,array('location'=>"http://localhost/Test/MyService/Server.php",'uri'=>'Server.php'));
        //两种调用方式，直接调用方法，和用__soapCall简接调用
        $infos=array(
            'yhzh'=>$data['yhzh'],
            'ptlx'=>'hqtec'
        );
        $params=array(
            'interfaceKey'=>C('INTERFACE_KEY'),
            'methodName'=>'ProcessingMessage',
            'xml'=>$this->arrayToZrXml($infos)
        );
        //$result = $soap->addZlInfo($params);
        $result = $soap->__soapCall('execute',array('parameters'=>$params));
        $str = base64_decode($result->return);
        $result=gzdecode($str);
        return $result;
    }

    /**
     * Description: arrayToZrXml 中软数组转xml
     * @param $array
     * @return string
     * Author: Jason
     * Date:2016-02-23
     */
    public function arrayToZrXml($array)
    {
        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE infos SYSTEM \"CLBIRD.dtd\">";
        $xml .= "<infos>";
        foreach ( $array as $key => $val ) {
            if (is_numeric ( $val )) {
                $xml .= "<property id=\"$key\" >" . $val . "</property>";
            } else
                $xml .= "<property id=\"$key\" ><![CDATA[" . $val . "]]></property>";
        }
        $xml .= "</infos>";
        return $xml;
    }

    /**
     * Description: checkAllPoiPanos 检查所有全景的状态，同时修改poi点的是否有全景的状态
     * Author: Jason
     * Date:2016-03-02
     */
    function checkAllPoiPanos()
    {
        $this->poiModel->where(array('STATUS'=>1))->save(array('HAVE_PANO'=>0));
        $list=$this->model->field('max(POST_STATUS) as post_status,POI_ID')->where ( array('STATUS'=>1) )->group('POI_ID')->select();
        foreach($list as $item)
        {
            if($item['post_status']==0)
            {
                $this->poiModel->save(array('ID'=>$item['poi_id'],'HAVE_PANO'=>0));
            }else{
                $this->poiModel->save(array('ID'=>$item['poi_id'],'HAVE_PANO'=>1));
            }
        }
        return true;

    }
}