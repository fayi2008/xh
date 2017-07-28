<?php

namespace Culture\Logic;

class CultureLogic extends \Think\Model {
	protected $model;
	public function _initialize() {
		$this->model = new \Culture\Model\CultureModel ();
		$this->categorymodel = new \Culture\Model\CultureCategoryModel ();
		$this->culturecategoryattrmodel = new \Culture\Model\CultureCategoryAttrModel ();
		$this->indexlogic = new \Culture\Logic\IndexLogic ();
	}
	
	/**
	 * Description: 后台文化list
	 * Author: Jason
	 * Date:
	 */
	public function getListForJson($id = -1) {
		$selectArr = $_GET;
		$field = 'A.*,B.NAME as bname';
		$where = array ();
		$where['DEL']=1;
		$title = I ( "title" );
		if ($title) {
			$where ['A.TITLE'] = array (
					"like",
					"%" . $title . "%" 
			);
		}
		$from = I ( 'from' );
		if ($from != 100) {
            if(C('DB_TYPE')=='mysql')
            {
                $where ['A.FROM'] = $from;
            }else{
                $where ['A."FROM"'] = $from;
            }

		}
		
		// 排序条件
		$order = '';
		if (! empty ( $selectArr ['field'] )) {
			$order = '' . strtoupper ( $selectArr ['field'] ) . ' ' . $selectArr ['direction'] . ',';
		}
		if ($selectArr ['field'] !== 'id') {
			$order .= ' ID DESC';
		}
		$order = rtrim ( $order, ',' );
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$join = " LEFT JOIN __CULTURE_CATEGORY__ B ON A.CATE_ID=B.ID ";
		$list = $this->model->alias ( 'A' )->join ( $join )->where ( $where )->field ( $field )->limit ( $start . ',' . $length )->order ( $order )->select ();
		$count = $this->model->alias ( 'A' )->join ( $join )->where ( $where )->field ( $field )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}

    /**
     * Description: delete 删除文化
     * @return bool
     * Author: Jason
     * Date:2016-01-26
     */
	function delete() {
		$id = I ( 'ids' );
		$where ['ID'] = array (
				'in',
				$id 
		);
		$data['DEL']=0;
		$data['STATUS']=0;
		$res = $this->model->where ( $where )->save ($data);
		AdminLog ( $id, 3, '', "删除文化" );
        if($res!==false)
        {
            $lists=$this->model->where ( $where )->getField('zr_code',true);
            foreach($lists as $code)
            {
                if($code)
                {
                    $res_code=$this->deleteCultureToZr($code);
                    if($res_code<0)
                    {
                        switch($code)
                        {
                            case -1:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，该知识编码不存在');
                                break;
                            case -2:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，数据处理异常');
                                break;
                            case -9:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，接口名称或者密码错误');
                                break;
                            default:
                                tp_log('同步中软知识库失败：error:'.$code.' 未知错误编码');
                                break;
                        }
                    }
                }
            }
        }
		if($res===false){
			return false;
		}else{
			return true;
		}
		
	}
	function release() {
		if(is_array(I ( 'put.id' ))){
			$where ['ID'] = array (
					'in',
					I ( 'put.id' )
			);
		}else{
			$where ['ID'] =  I ( 'put.id' ) ;
		}
		
		if (I ( 'put.unrel' )) {
			$data ['STATUS'] = 0;
		//	AdminLog ( $where ['ID'], 5, '', "取消文化" );
		} else {
			$data ['STATUS'] = 1;
		//	AdminLog ( $where ['ID'], 4, '', "发布文化" );
		}
		$res = $this->model->where ( $where )->save ( $data );
	
		if ( $res===false) {
			echo $this->model->getError ();
			return false;
		}
		return true;
	}
	function firstmemu() {
		$cate = $this->categorymodel->where ( 'PARENTID=0' )->select ();
		return $cate;
	}
	function twoMemu($parentid) {
		$cate = $this->categorymodel->where ( "PARENTID=$parentid" )->select ();
		return $cate;
	}
	/**
	 * 获取文化分类下的要素
	 *
	 * @param unknown $type_id        	
	 * @return unknown
	 */
	function cultureAttr($type_id) {
		$where ['a.CATEGORYID'] = $type_id;
		$field = "b.ID,b.NAME,b.IS_NEED,b.LISTORDER,b.TYPE";
		$join = "left join __CULTURE_ATTR__ as b on a.ATTRID=b.ID";
		$attr = $this->culturecategoryattrmodel->alias ( 'a' )->join ( $join )->where ( $where )->field ( $field )->order ( "b.LISTORDER DESC, b.ID ASC" )->select ();
		return $attr;
	}
	function cultureAttr2($type_id) {
		$where ['a.CATEGORYID'] = $type_id;
		$where ['b.TYPE'] = 1;
		$field = "b.ID,b.NAME,b.IS_NEED,b.LISTORDER,b.TYPE";
		$join = "left join __CULTURE_ATTR__ as b on a.ATTRID=b.ID";
		$attr = $this->culturecategoryattrmodel->alias ( 'a' )->join ( $join )->where ( $where )->field ( $field )->order ( "b.LISTORDER DESC, b.ID ASC" )->select ();
		return $attr;
	}
	
	/**
	 * 获取文化详情
	 * @param unknown $id
	 */
	function getDetailCulture($id) {
        $where['ID']=$id;
		$res = $this->model->where ($where)->find ();
		return $res;
	}
	
	/**
	 * Description: 添加信息（后台）
	 * Author: bill
	 * Date:
	 */
	public function addCulture() {
		$data = $this->model->create ($_POST);
		$user = session ( 'admin' );
		$data ['AUTHOR'] = $user ['account'];
		if ($data ['MANY_IMAGE']) {
			$data ['MANY_IMAGE'] = json_encode ( $data ['MANY_IMAGE'] );
		}
        if($data['ATTRS'])
        {
            $data ['ATTRS'] = json_encode ( $data ['ATTRS'],JSON_UNESCAPED_UNICODE);
        }else{
            $data ['ATTRS']=null;
        }
		$data ['CREATE_TIME'] = toDate ( time () );
		$data ['UPDATE_TIME'] = toDate ( time () );
		if ($data) {
			$res = $this->model->add ( $data );
			AdminLog ( $res, 1, json_encode ( $data ), "添加文化" );
            if($res)
            {
            	$attrs=json_decode($data['ATTRS'],true);// ward 2016-03-24
                //同步到中软知识库
                $data=array(
                    'ZR_CODE'=>'',
                    'TITLE'=>$data['TITLE'],
                    'CATE_ID'=>$data['CATE_ID'],
                    'CONTENT'=>$data['CONTENT']
                );
               // $attrs=json_decode($data['ATTRS'],true); //注释 ward 2016-03-24
                $attr_str='<div class="item-list">';
                foreach($attrs as $attr)
                {
                    $attr_str.='<div class="item-list-wh"><h1>'.$attr['name'].'</h1><div class="item-list-wh-desc">'.$attr['value'].'</div></div>';
                }
                $attr_str.='</div>';
                $data['CONTENT']=html_entity_decode($data['CONTENT']);
                $preg = '/(<img.*?src=[\"|\']?)(\/.*?)([\"|\']?\s.*?>)/i';
                $data['CONTENT']=preg_replace($preg,"$1http://".C('WEB_HOST')."$2$3",$data['CONTENT']);
                $data['CONTENT']=$attr_str.$data['CONTENT'];
                $code=$this->sendCultureToZr($data);
                if($code>3)
                {
                    $this->model->save ( array('ID'=>$res,'ZR_CODE'=>$code));
                }else{
                    if($code<0)
                    {
                        switch($code)
                        {
                            case -1:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，该知识编码不存在');
                                break;
                            case -2:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，数据处理异常');
                                break;
                            case -9:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，接口名称或者密码错误');
                                break;
                            default:
                                tp_log('同步中软知识库失败：error:'.$code.' 未知错误编码');
                                break;
                        }
                    }
                }

                return $res;
            }else{
                return false;
            }

		} else {
			return false;
		}
	}
	
	/**
	 * Description: 编辑文化信息（后台）
	 * Author: bill
	 * Date:
	 */
	public function editCulture() {
		$data = $this->model->create ( I ( 'put.' ) );
		
		$relation=$this->indexlogic->relation_culture($data['RELATION_CULTURE'],$data['CATE_ID'],$data['ID']);
		
		$data['RELATION_CULTURE2']=json_encode($relation);
		
		if ($data ['MANY_IMAGE']) {
			$data ['MANY_IMAGE'] = json_encode ( $data ['MANY_IMAGE'] );
		}else{
			$data ['MANY_IMAGE']=null;
		}
        if($data['ATTRS'])
        {
            $data ['ATTRS'] = json_encode ( $data ['ATTRS'],JSON_UNESCAPED_UNICODE);
        }else{
            $data ['ATTRS']=null;
        }
		$data ['UPDATE_TIME'] = toDate ( time () );
		if ($data) {
			$res = $this->model->save ( $data );
			AdminLog ( $data ['ID'], 2, json_encode ( $data ), "编辑文化" );
			
            if($res)
            {
                $id=$data ['ID'];
                $code=$this->model->where(array('ID'=>$id))->getField('ZR_CODE');
                if(!$code)
                {
                    $code='';
                }
                $attrs=json_decode($data['ATTRS'],true);//2016-03-24 ward 
                $data=array(
                    'ZR_CODE'=>$code,
                    'TITLE'=>$data['TITLE'],
                    'CATE_ID'=>$data['CATE_ID'],
                    'CONTENT'=>$data['CONTENT']
                );
              //  $attrs=json_decode($data['ATTRS'],true);//注释 ward 2013-03-24
               
                $attr_str='<div class="item-list">';
                foreach($attrs as $attr)
                {
                    $attr_str.='<div class="item-list-wh"><h1>'.$attr['name'].'</h1><div class="item-list-wh-desc">'.$attr['value'].'</div></div>';
                }
                $attr_str.='</div>';
                $data['CONTENT']=html_entity_decode($data['CONTENT']);
                $preg = '/(<img.*?src=[\"|\']?)(\/.*?)([\"|\']?\s.*?>)/i';
                $data['CONTENT']=preg_replace($preg,"$1http://".C('WEB_HOST')."$2$3",$data['CONTENT']);
                $data['CONTENT']=$attr_str.$data['CONTENT'];
				
                $code=$this->sendCultureToZr($data);
                if($code>3)
                {
                    $this->model->save ( array('ID'=>$id,'ZR_CODE'=>$code) );
                }else{
                    if($code<0)
                    {
                        switch($code)
                        {
                            case -1:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，该知识编码不存在');
                                break;
                            case -2:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，数据处理异常');
                                break;
                            case -9:
                                tp_log('同步中软知识库失败：error:'.$code.' 失败，接口名称或者密码错误');
                                break;
                            default:
                                tp_log('同步中软知识库失败：error:'.$code.' 未知错误编码');
                                break;
                        }
                    }
                }
            }
			return $res;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: getMenusSelect 获取父菜单选择框
	 *
	 * @param string $parent_id
	 *        	父菜单id
	 * @return string Author: Jason
	 *         Date: 2015.09.09
	 */
	function getMenusSelect($parent_id = '') {
		$tree = new \Common\Lib\Util\Tree ();
		$result = $this->get_class ();
		$str = "<option value='\$id' \$selected>\$spacer \$name</option>";
		$tree->init ( $result );
		return $tree->get_tree ( 0, $str, $parent_id );
	}
	public function get_class() {
		$data = $this->categorymodel->where ( array (
				'STATUS' => 1 
		) )->order ( 'LISTORDER DESC' )->getField ( 'ID,NAME,REMARK,LISTORDER,PARENTID' );
		return $data;
	}
	/**
	 * 得到某一个分类下的文化
	 *
	 * @param unknown $cate_id
	 *        	分类id
	 * @return \Think\mixed
	 */
	public function GetCultureByCate($cate_id) {
		$res = $this->model->where ( "CATE_ID=$cate_id" )->select ();
		return $res;
	}
	/**
	 * 最热推荐
	 *
	 * @return unknown
	 */
	public function getHotCulture() {
		$join = "left join __CULTURE_CATEGORY__  as b on a.CATE_ID=b.ID";
		$field = "a.TITLE,a.ID,a.THUMB,b.NAME as class_name";
		$where ['a.STATUS'] = 1;
		$res = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->field ( $field )->limit ( 4 )->order ( 'a.CLICK DESC' )->select ();
		return $res;
	}
	public function suggest_culture($name) {
		$where = array ();
		$where['STATUS']=1;
		$where['DEL']=1;
		if ($name) {
			$where ['TITLE'] = array (
					"like",
					"%" . $name . "%" 
			);
		}
		$res = $this->model->where ( $where )->field ( "ID,TITLE" )->select ();
		return $res;
	}

	/**
	 * Description: sendCultureToZr添加更新文化更新中软数据库
	 * @param $data
	 * @return mixed
	 * Author: Jason
	 * Date:2016-01-21
	 */
	function sendCultureToZr($data)
	{
        if(!C('SEND_CULTURE_WEBSERVICE'))
        {
            return false;
        }
        $soap = new \SoapClient(C('SEND_CULTURE_WEBSERVICE'),array("trace" =>true,"connection_timeout"=>800));

		$params=array(
			'zlcode'=>$data['ZR_CODE'],
			'zltitle'=>$data['TITLE'],
			'zlflag'=>"",
			'zltype'=>$data['CATE_ID'],
			'zlnr'=>'',
			'zlnrwb'=>'',
			'zlcljnr'=>$data['CONTENT'],
			'zlwh'=>'',
		    'zlgjz'=>'',
			'interfaceName'=>C('INTERFACENAME'),
			'interfacePass'=>C('INTERFACEPASS')
		);

		$result = $soap->__soapCall('addZlInfo',$params);
		return $result;
	}

    /**
     * Description: deleteCultureToZr删除文化更新中软数据库
     * @param $code
     * @return mixed
     * Author: Jason
     * Date:2016-01-21
     */
    function deleteCultureToZr($code)
    {
        if(!C('SEND_CULTURE_WEBSERVICE'))
        {
            return false;
        }
        $soap = new \SoapClient(C('SEND_CULTURE_WEBSERVICE'),array("trace" =>true,"connection_timeout"=>800));
        //non-wsdl方式调用web service
        //在non-wsdl方式中option location系必须提供的,而服务端的location是选择性的，可以不提供
        //$soap = new SoapClient(null,array('location'=>"http://localhost/Test/MyService/Server.php",'uri'=>'Server.php'));
        //两种调用方式，直接调用方法，和用__soapCall简接调用
        $params=array(
            'zlcode'=>$code,
            'interfaceName'=>C('INTERFACENAME'),
            'interfacePass'=>C('INTERFACEPASS')
        );
        //$result = $soap->addZlInfo($params);
        $result = $soap->__soapCall('deleteZlInfo',$params);
        return $result;
    }


}