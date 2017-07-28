<?php
namespace  Service\Controller;

class  UserController extends \Common\Controller\BaseController{
	protected  $logic;
	public  function _init(){
		$this->logic=new \Service\Logic\UserLogic();
	}
	
	/**
	 * Description: 获得poi列表信息（界面初始化时调用）
	 * Param: $_GET('lat','lng','type'=>'类型','radius'=>'半径（米）')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function radius(){
		$select=$_GET;
		$data=$this->logic->getPoiList($select);
		if(empty($data)||!is_array($data)){
			
			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
		}else{
			$this->ajaxReturn(array('status'=>1,'data'=>$data));
		}
	}
	/**
	 * Description: 推荐住宿
	 * Param: $_GET('lat','lon','poi','level')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function  tenHotel(){
		$select=$_GET;
		$requestId=$this->logic->getTenHotel($select);
		
		if(intval($requestId)>0){
			$this->ajaxReturn(array('status'=>1,'request'=>$requestId));
		}else{
			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
		}
	}
	
	
	/**
	 * Description: 推荐吃饭
	 * Param: $_GET('lat','lon','poi','level')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function  tenFood(){
		$select=$_GET;
		$requestId=$this->logic->getTenFood($select);
		if(intval($requestId)>0){
			$this->ajaxReturn(array('status'=>1,'request'=>$requestId));
		}else{
			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
		}
	}
	/**
	 * Description: 下一家吃饭
	 * Param: $_GET('receive_id'=>'商家接受ID','request_id'=>'用户请求ID')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function nextFood(){
		$requestId=$_GET['request_id'];
		$receiveId=$_GET['receive_id'];
		$user=session('user');
		$userId=$user['id'];
		if(empty($userId)){
			$this->ajaxReturn(array('status'=>0,'msg'=>'没有权限！'));
		}
		if(empty($requestId)||empty($receiveId)){
			$this->ajaxReturn(array('status'=>0,'msg'=>'参数错误！'));
		}
		
		//type 为0表示该操作时用户发起    1表示该操作为商家发起
		$res=$this->logic->nextPoi($requestId, $receiveId,$type=0);
		if(0===$res){
			$this->ajaxReturn(array('status'=>1,'msg'=>'已经推荐完！'));
		}elseif(false===$res){
			$this->ajaxReturn(array('status'=>0,'msg'=>'刷新失败！'));
		}else{
			$this->ajaxReturn(array('status'=>1,'msg'=>'刷新成功！'));
		}
	}
	
	
	/**
	 * Description: 下一家住宿
	 * Param: $_GET('receive_id'=>'商家接受ID','request_id'=>'用户请求ID')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function nextHotel(){
		$requestId=$_GET['request_id'];
		$receiveId=$_GET['receive_id'];
		$user=session('user');
		$userId=$user['id'];
		if(empty($userId)){
			$this->ajaxReturn(array('status'=>0,'msg'=>'没有权限！'));
		}
		if(empty($requestId)||empty($receiveId)){
			$this->ajaxReturn(array('status'=>0,'msg'=>'参数错误！'));
		}
		//type 为0表示该操作时用户发起    1表示该操作为商家发起
		$res=$this->logic->nextPoi($requestId, $receiveId,$type=0);	
		if(0===$res){
			$this->ajaxReturn(array('status'=>1,'msg'=>'已经推荐完！'));
		}elseif(false===$res){
			$this->ajaxReturn(array('status'=>0,'msg'=>'刷新失败！'));
		}else{
			$this->ajaxReturn(array('status'=>1,'msg'=>'刷新成功！'));
		}
	}
	
	/**
	 * Description: 用户获得自己的历史请求记录
	 * Param: $_GET('page'=>'分页第几页（从1开始)','one'=>'标志位','id'=>'请求id')
	 * Author： ward
	 * Date:2015-12-15 
	 */
	public function requestTitle(){
		$page=$_GET['page'];
		$one=$_GET['one'];
		$requestId=$_GET['id'];
		$data=$this->logic->getRequestHistory($page,$one,$requestId);
		if(false===$data){
			$this->ajaxReturn(array('status'=>1,'msg'=>$this->logic->getError()));
		}else{
			$this->ajaxReturn(array('status'=>1,'data'=>$data));
		}
	}
	
	/**
	 * Description: 用户端轮询接口
	 * Param: $_GET('type'=>'请求类型','id'=>'请求id')
	 * Author： ward
	 * Date:2015-12-15
	 */
	public function response(){
		$requestId=$_GET['id'];
		$type=intval($_GET['type']);
		$data=$this->logic->getForRequest($requestId,$type);
		
		if(is_array($data)){
			$this->ajaxReturn(array('status'=>1,'data'=>$data));
		}elseif(-1==$data){
			$this->ajaxReturn(array('status'=>-1,'msg'=>'三分钟内 未有商家抢单，稍后旅游服务中心会与您电话联系'));
		}elseif(false===$data){
			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
		}
	}
	
	
	/**
	 * Description: 用户取消请求（含强意向）
	 * Param: $_GET('type'=>'请求类型1为吃、0为住')
	 * Author： ward
	 * Date:2015-12-15
	 */
	public function cancel(){
		$type=$_GET['type'];
		$res=$this->logic->processCancel($type);
		if(false!==$res){
			$this->ajaxReturn(array('status'=>1,'msg'=>'取消成功！'));
		}elseif(false===$res){
			$this->ajaxReturn(array('status'=>0,'msg'=>'系统错误！'));
		}
	}
	
	
	
	
	/**
	 * Description: 用户点击--要求商家自动联系我（新）
	 * Param: $_GET('id'=>'poi点id')
	 * Author： ward
	 * Date:2015-12-15
	 */
	public  function callMe(){
		$select=$_GET;
		$res=$this->logic->processCallMe($select);
		if($res>1){
			$this->ajaxReturn(array('status'=>1,'request'=>$res,'msg'=>'成功！'));
		}else{
			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
		}
		
	}
	
	
	/**
	 * @description:用户接受商家的邀请
	 * @param:int 请求ID 即 user_request表中的id字段
	 * @param:int poi点ID
	 */
	public function receive(){
		$requestId=$_GET['request_id'];
		$poiId=$_GET['id'];
	
		$res=$this->logic->processReceive($poiId,$requestId);
	
		if($res){
			$this->ajaxReturn(array('status'=>1,'msg'=>'成功！'));
		}else{
			$this->ajaxReturn(array('status'=>0,'msg'=>'失败！'));
		}
	
	}
	
	
	/**
	 * 
	 */
	public function search()
    {
        $keyword=$_GET['keyword'];
        $area=empty($_GET['area'])?'3301':$_GET['area'];//330100为
       
        $res=$this->logic->search($keyword,$area);
        if($res!==false)
        {
            $this->ajaxReturn(array('status'=>1,'data'=>$res));
        }else{
            $this->ajaxReturn(array('status'=>0,'info'=>$logic->getError()));
        }

    }
    
    public function poi(){
    	$poiId=intval($_GET['id']);
    	$res=$this->logic->getPoiDeatail($poiId);
    	if(empty($res)||!is_array($res)){
    		$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
    	}
    	$res['onsale']=$info;
    	$res['pictures']=$picArr;
    	$this->ajaxReturn(array('status'=>1,'data'=>$res));
    	 
    }
    
    
     public function test(){
			$oauthUserService=new \Service\Logic\OauthLogic();
			$open_ids=$oauthUserService->getPoiManager('7');
			$data=array(
				"first" => array(
				     "value" => "未处理业务！",
				     "color" => "#173177"
			     ),
			    "keyword1" => array(
			    		 "value" => '您有一个未处理业务,请尽快处理!',
			    		 "color" => "#173177"
			    ),
			    "keyword2" => array(
			    	 "value" => '红权科技',
			    	 "color" => "#173177"
			    ),
			    "keyword3" => array(
			    	 "value" => toDate(),
			    	 "color" => "#173177"
			    ),
			    'remark'=>array(
			    	"value" => '请点击详情进行处理',
			    	"color" => "#173177")
			);
    		$wx=new \Common\Lib\Api\WxChat();
    		echo '<pre/>';
    		var_dump($open_ids,$data);
    		foreach($open_ids as $open_info){
    			echo $open_info['openid'];
    		 	$res=$wx->templateMsg($data,$open_info['openid'],'notice',$_SERVER['HTTP_HOST'].'/service/wait');
    		 	var_dump($res);
    		}
    }
    
}