<?php
namespace Panorama\Controller;

class IndexController extends \Common\Controller\BaseController {
    
	protected  $logic;
	public  function _initialize(){
		parent::_initialize();
		C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/Panorama/');
		$this->logic=new \Panorama\Logic\PanoLogic();		
	}
	
    /**
     * Description: index 显示全景
     * Author: Jason
     * Date:
     */
    public function index_get_html(){
        $this->display('index');
    }

   /**
     * Description: list_get 获取全景详细数据
     * Author: ward
     * Param: $_GET('key'=>'全景的key')
     * Date:
     */
    public function index_get(){
        $pano_key=$_GET['key'];
        if(!$pano_key)
        {
            $this->ajaxReturn(array('status'=>0,'msg'=>'非法操作,id不存在'));
        }
   	   $res=$this->logic->getPano($pano_key);
       header( 'Access-Control-Allow-Origin:*' );
       if(is_array($res)){
       		$this->ajaxReturn(array('status'=>1,'data'=>$res));
       }else{
      	 	$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
       }
    }

    /**
     * Description: season_get_json获取全景的季节
     * Author: Jason
     * Date:2016-02-22
     */
    function season_get_json(){
        $pano_key=$_GET['key'];
        if(!$pano_key)
        {
            $this->ajaxReturn(array('status'=>0,'msg'=>'非法操作,id不存在'));
        }
        $res=$this->logic->getPanoSeason($pano_key);
        header( 'Access-Control-Allow-Origin:*' );
        if($res){
            $this->ajaxReturn(array('status'=>1,'season'=>$res));
        }else{
            $this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
        }
    }
    /**
     * Description: list_get 获取poi点下面全景列表数据
     * Author: ward
     * Param: $_GET('poi'=>'poi点id')
     * Date:
     */
   public  function list_get(){
       $poi_id=intval($_GET['poi_id']);
       $season=intval($_GET['season']);
   		$res=$this->logic->getDataByPoi($poi_id,$season);
   		header( 'Access-Control-Allow-Origin:*' );
   		if(is_array($res)){
   			$this->ajaxReturn(array('status'=>1,'data'=>$res));
   		}else{
   			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
   		}
   }

    /**
     * Description: coming_call 电话预处理
     * Author: Jason
     * Date:2016-02-23
     */
    function coming_call()
    {
        $res=$this->logic->comingCall($_GET);
        $this->ajaxReturn(xmlToArray($res));
    }

    /**
     * Description: subscribe_call 电话预约
     * Author: Jason
     * Date:2016-02-23
     */
    function subscribe_call()
    {
        $res=$this->logic->subscribeCall($_GET);
        $this->ajaxReturn(xmlToArray($res));
    }

    /**
     * Description: processing_message 信息待调用
     * Author: Jason
     * Date:2016-02-23
     */
    function processing_message()
    {
        $res=$this->logic->processingMessage($_GET);
        $this->ajaxReturn(xmlToArray($res));
    }
    
  

}