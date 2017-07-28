<?php
namespace Culture\Controller;

class IndexController extends \Common\Controller\BaseController {
    protected $logic;

	function _init() {
		$this->logic = new \Culture\Logic\IndexLogic ();
		$this->news = new \Culture\Logic\NewsLogic ();
		$this->newCate = new \Culture\Logic\NewsCateLogic ();
		C ( 'VIEW_PATH', APP_ROOT . '/Template/' . WEB_TYPE . '/Culture/' );
	}
	
	/**
	 * Description: index 文化首页
	 * Author: Jason
	 * Date:
	 */
	public function index_get_html() {
		$this->click();
		$res = $this->logic->get_class ();
		if (is_array ( $res )) {

			$cate['status'] = 1;
			$cate['data'] = $res;

		} else {

			$cate['status'] = 0;
			$cate['msg'] = $this->logic->getError ();

		}
		$this->assign('cate',json_encode($cate));
		$this->display('index');
	}
	
	/**
	 * Description: index 文化列表页
	 * Author: Jason
	 * Date:
	 */
	public function list_get_html() {
		$this->click();
		$res = $this->logic->get_class ();
		if (is_array ( $res )) {

			$cate['status'] = 1;
			$cate['data'] = $res;

		} else {

			$cate['status'] = 0;
			$cate['msg'] = $this->logic->getError ();

		}
		$this->assign('cate',json_encode($cate));
		$this->display('list');
	}
	
	/**
	 * Description: index 文化详情页
	 * Author: Jason
	 * Date:
	 */
	public function detail_get_html() {
		$this->click();
		$id = I ( 'id' );
		$res = $this->logic->getDetailCulture ( $id );

		if (is_array ( $res )) {
			$res['attrs']=json_decode($res['attrs'],true);
			$res['content']=html_entity_decode($res['content']);
			$res['excerpt']=html_entity_decode($res['excerpt']);
				$data['status'] = 1;
				$data['data'] = $res;

		} else {

			$data['status'] = 0;
			$data['msg'] = $this->logic->getError ();

		}
		$this->assign('data',json_encode($data));
		$this->display('detail');
	}

	/**
	 * Description: index 新闻详情
	 * Author: fay
	 * Date:20151119
	 */
	public function news_get_html() {
		$this->click();
		$res = $this->news->getnews ();
		if (is_array ( $res )) {

			$res['content']=html_entity_decode($res['content']);

			$data['status'] = 1;
			$data['data'] = $res;

		} else {

			$data['status'] = 0;
			$data['msg'] = $this->logic->getError ();

		}
		$this->assign('data',json_encode($data));
		$this->display('news');
	}

	/**
	 * Description: index 新闻列表
	 * Author: fay
	 * Date:20151119
	 */
	public function newsList_get_html() {
		$this->click();
		$category_list=$this->newCate->category_list();
		$this->assign('cate',$category_list);
		$this->display('newList');
	}
	/**
	 * Description: index 新闻列表接口
	 * Author: fay
	 * Date:20151119
	 */
	public function news_list(){
		$cate=I('cate');
		$res=$this->news->web_get_list($cate);
		if (is_array ( $res )) {
			foreach ($res['data'] as $key=>$value) {

				$res['data'][$key]['content'] = html_entity_decode($value['content']);
			}

			$this->ajaxReturn ( array (
				'status' => 1,
				'data' => $res
			) );


		} else {

			$this->ajaxReturn ( array (
				'status' => 0,
				'msg' => $this->logic->getError ()
			) );

		}
	}

	/**
	 * 文化详情
	 */
	public function culture_detail() {
		$id = I ( 'id' );
		$title=(I ( 'relation' ));
		$res = $this->logic->getDetailCulture ( $id ,$title);
		if (is_array ( $res )) {
			//$res['attrs']=html_entity_decode($res['attrs']);
			$res['content']=html_entity_decode($res['content']);
			$res['excerpt']=html_entity_decode($res['excerpt']);
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $this->logic->getError () 
			) );
		}
	}
	/**
	 * 文化分类列表
	 */
	public function culture_cate() {
		$res = $this->logic->get_class ();
		if (is_array ( $res )) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $this->logic->getError () 
			) );
		}
	}
	
	public function culture_search(){
		$cate_id=$_GET['cate_id'];
		$name=$_GET['name'];
		$res=$this->logic->culture_search($cate_id,$name);
		if (is_array ( $res )) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $this->logic->getError ()
			) );
		}
	}

	/**
	 * Description: click
	 * Author: Jason
	 * Date:
	 */
	private function click()
	{
		$file = PUBLIC_ROOT."click.data";
		$lock_file = PUBLIC_ROOT."click.lock";
		$fp = fopen($lock_file , 'w');
		if(flock($fp , LOCK_EX)){
			$num=file_get_contents($file);
			if(!$num)
			{
				$num=1;
			}else{
				$num=intval($num)+1;
			}
			file_put_contents($file,$num);
		}
		flock($fp , LOCK_UN);
		fclose ( $fp );
		$this->assign('click_num',$num);
	}

	/**
	 * Description:collection 采集资讯和文化接口
	 * Author:jason
	 */
	public function collection()
	{
		header('Access-Control-Allow-Origin: *');
		if($this->_method!='post')
		{
			$this->ajaxReturn ( array (
				'status' => 0,
				'msg' => $this->logic->getError ()
			),$this->_type);
		}
		$logic=new \Culture\Logic\CollectionLogic();
		$data=I('post.');
		$res=$logic->apiCollect($data['title'],$data['content'],$data['type'],$data['signature'],$data['source_from'],$data['email'],$data['mobile'],$data['phone']);
		if($res!==false)
		{
			$this->ajaxReturn ( array (
				'status' => 1,
				'id' => $res
			),$this->_type);
		}else{
			$this->ajaxReturn ( array (
				'status' => 0,
				'msg' => $this->logic->getError()
			),$this->_type);
		}

	}
}