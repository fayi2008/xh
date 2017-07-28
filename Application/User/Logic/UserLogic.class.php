<?php
namespace User\Logic;

class UserLogic extends \Think\Model{

	protected $model;

	function _initialize(){
		$this->model=new \User\Model\UserModel();
	}
	
	
	/**
	 * 编辑（审核） ----（后端）
	 * @return Ambigous <boolean, unknown>|boolean
	 */
	public function edit(){
		$data['ID']=I('put.ID');
		$data['STATUS']=I('put.STATUS');
		if ($data = $this->model->create ( $data )) {
			$res=$this->model->save($data);	
			
			return $res;
		}else{
			return false;
		}
	}
	
	
	/**
	 * Description: 用户个人信息---(管理后台接口)
	 * Author: ward
	 * Date:2015-10-29
	 *	Param:  用户id  id
	 *	Retrun: array/null/false
	 */
	public function getOne($id){	
		$where['ID']=intval($id);//信息id
		$field='*';
		$data=$this->model->where($where)->field($field)->find();
		return $data;	
	}
	
	
	
	/**
	 * Description: 用户信息列表---(管理后台接口)
	 * Author: ward
	 * Date:2015-10-29
	 *	Param:  筛选条件   array('start','limit','mobile','nickname'...)
	 *	Retrun: true/false
	 */
	public function getLists($selectArr){
		$where = array ();
		
		//排序条件
		$order='';
		if(!empty($selectArr['field'])){
			$order=''.strtoupper($selectArr['field']).' '.$selectArr['direction'].',';
		}
		if($selectArr['field']!=='id'){
			$order.=' ID DESC';
		}
		$order=rtrim($order,',');
		
		
		if(!empty($selectArr['nickname'])){
			$where ['NICKNAME'] = array (
					"like",
					"%" . $selectArr['nickname'] . "%"
			);
		}
		if(!empty($selectArr['mobile'])){
			$where ['MOBILE'] = array (
					"like",
					"%" . $selectArr['mobile'] . "%"
			);
		}
			
		//$where ['STATUS']=array('neq',0);
	//	$field='ID,NICKNAME,ACCOUNT,MOBILE,STATUS';
		$field='ID,NICKNAME,MOBILE,STATUS';
		$start = intval ( $selectArr['start'] );
		$length = intval (  $selectArr['limit'] );
		
		$list = $this->model->field ($field)->where ( $where )->limit ( $start . ',' . $length )->order($order)->select ();
		if(is_array($list)&&!empty($list)){
			foreach ($list as $k=>$v){
				if($v['status']){
					$list[$k]['status']='通过';
				}else{
					$list[$k]['status']='禁用';
				}
			
			}
		}
		
		$count =$this->model->field ($field)->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
		
		
		
	}
	
	
	
	 /**
	  * Description: 用户注册
	  * Author: ward
	  * Date:2015-10-28
	  *	Param:  注册信息   array('nickname','mobile','sex'...)
	  *	Retrun: true/false
	  */
	public  function registerUser($regInfo,$sign){
// 		if($sign!==hash('sha256',session('xh_sign'))){
// 			$this->setError('请刷新页面！');
// 			return false;
// 		}
		if(empty($sign)){
			$this->setError('系统错误！');
			return false;
		}
		
		
		if(!preg_match("/1[3-9]{1}\d{9}$/",$regInfo['mobile'])){
			$this->setError('请输入正确的手机号码');
			return false;
		}
		$code=session('verify_code');
		$verifyMobile=session('verify_mobile');
		if(trim($regInfo['password'])!==$regInfo['password']){
			$this->setError('设置密码中带特殊字符，请重新设置！');
			return false;
		}
		if($code!=$regInfo['msg']||$verifyMobile!=$regInfo['mobile']){
			$this->setError('短信验证码错误，请重新获取！');
			return false;
		}
		
		$info=$this->model->where('MOBILE='.$regInfo['mobile'])->find();
		if($info){
			$this->setError('该手机号已被注册！');
			return false;
		}
		$data['MOBILE']=$regInfo['mobile'];
		if(isset($regInfo['public_mobile']))
		{
			$data['PUBLIC_MOBILE']=$regInfo['public_mobile'];
		}
		//数据库中的密码：通过了两次sha256加密的，一次是前端通过sha256加密后传到后台，另一次是密码入库时在后台加密		
		$data['PASSWORD']=hash('sha256',$regInfo['password']);////密码加密
		$data['NICKNAME']=empty($regInfo['nickname'])?'u_'.time().'':$regInfo['nickname'];
		$data=$this->model->create($data);
		$res=$this->model->add($data);
		if($res){
			unset($regInfo['password']);
			$regInfo['head_img']='';
			$regInfo['id']=$res;
			session('user',$regInfo);
			return true;
		}else{
			$this->setError('注册失败！');
			return false;
		}
	}
	
	/**
	 * Description: 用户更新注册信息
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  注册信息   array('password'=>'密码','head_img'=>'手机号','nickname'=>'昵称')
	 *	Retrun: true/false
	 */
	public function updateUserInfo($userInfo,$sign=null){
		if(empty($userInfo)){
			$this->setError('修改数据为空！');
			return false;
		}
		$userId=session('user.id');
		if(empty($userId)){
			$this->setError('系统错误！');
			return false;
		}
		$where['ID']=$userId;
		if(!empty($userInfo['password'])){//如果修改密码，则需要验证原先密码
// 			if($sign!==hash('sha256',session('xh_sign'))){
// 				$this->setError('请刷新页面！');
// 				return false;
// 			}
			if(empty($sign)){
				$this->setError('系统错误！');
				return false;
			}
			
			$info=$this->model->where($where)->find();
			if(!$info){
				$this->setError('该账号未注册！');
				return false;
			}
			if(!$info['status']){
				$this->setError('该账号被禁用，请联系管理员！');
				return false;
			}
			if(hash('sha256',$userInfo['old_pwd'])!=$info['password']){////密码加密  
				$this->setError('原先的密码错误，无法修改！');
				return false;
			}
			if($userInfo['old_pwd']==$userInfo['password']){
				$this->setError('两次密码不能一样,无法修改！');
				return false;
			}
		}
		if(!empty($userInfo['head_img'])){
			$data['HEAD_IMG']=$userInfo['head_img'];
		}
		if(!empty($userInfo['nickname'])){
			$data['NICKNAME']=$userInfo['nickname'];
		}
		if(!empty($userInfo['password'])){
			//数据库中的密码：通过了两次sha256加密的，一次是前端通过sha256加密后传到后台，另一次是密码入库时在后台加密
			
			$data['PASSWORD']=hash('sha256',$userInfo['password']);///密码加密
		}
		if(isset($userInfo['public_mobile'])){
			$data['PUBLIC_MOBILE']=$userInfo['public_mobile'];
		}
		$data=$this->model->create($data);
		if($data){
			$where['ID']=$userId;
			$res=$this->model->where($where)->save($data);
			if(!empty($userInfo['nickname'])){
				session('user.nickname',$userInfo['nickname']);
			}
			if(!empty($userInfo['head_img'])){
				session('user.head_img',$userInfo['head_img']);
			}
			if(isset($userInfo['public_mobile'])){
				session('user.public_mobile',$userInfo['public_mobile']);
			}
			return $res;
		}else{
			return false;
		}
	}
	
	
	/**
	 * Description: 用户忘记旧密码，而通过手机验证码重置密码
	 * Author: ward
	 * Date:2016-02-19
	 *	Param:  用户信息   array('password'=>'密码','mobile'=>'手机号','msg'=>'验证码')
	 *			加密标记   $sign
	 *	Retrun: true/false
	 */
	public function updatePwd($userInfo,$sign){
// 		if($sign!==hash('sha256',session('xh_sign'))){
// 			$this->setError('请刷新页面！');
// 			return false;
// 		}
		if(empty($sign)){
			$this->setError('系统错误！');
			return false;
		}
		
		if(!preg_match("/1[3-9]{1}\d{9}$/",$userInfo['mobile'])){
			$this->setError('请输入正确的手机号码');
			return false;
		}
		$code=session('verify_code');
		$verifyMobile=session('verify_mobile');
		if($code!=$userInfo['msg']||$verifyMobile!=$userInfo['mobile']){
			$this->setError('短息验证码错误，请重新获取！');
			return false;
		}
		session('verify_mobile',null);//置空
		session('verify_time',null);//置空
		$data['PASSWORD']=hash('sha256',$userInfo['password']);////密码加密
		$data=$this->model->create($data);
		if($data){
			$where['MOBILE']=$userInfo['mobile'];
			$res=$this->model->where($where)->save($data);
			return $res;
		}else{
			return false;
		}
		
	}
	
	/**
	 * Description: 用户获得其注册信息
	 * Author: ward
	 * Date:2015-10-28
	 * Retrun: array/null/false
	 */
	public function  getUserInfo(){
		$userId=session('user.id');
		if(empty($userId)){
			$this->setError('系统错误！');
			return false;
		}
		$res=$this->model->where('ID='.$userId)->field('')->find();
		return $res;
	}
	
	

	/**
	 * Description: 用户登录验证(账号，密码登陆)
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  注册信息   array('account','password')
	 * Retrun: true/false
	 */
	public function doLoginByPwd($account,$password,$sign){
		if(!preg_match("/1[3-9]{1}\d{9}$/",$account)){
			$this->setError('账号必须是正确的手机号');
			return false;
		}
// 		if($sign!==hash('sha256',session('xh_sign'))){
// 			$this->setError('请刷新页面！');
// 			return false;
// 		}
		if(empty($sign)){
			$this->setError('系统错误！');
			return false;
		}
	
		$where['MOBILE']=$account;//手机号就是账号
		$info=$this->model->where($where)->find();
		if(!$info){
			$this->setError('该账号未注册！');
			return false;
		}
		if(!$info['status']){
			$this->setError('该账号被禁用，请联系管理员！');
			return false;
		}
		if($info['password']==hash('sha256',$password)){//密码加密
			unset($info['password']);
			//unset($info['mobile']);
			unset($info['account']);
			session('user',$info);
			return true;
		}else{
			$this->setError('密码或账号错误！');
			return false;
		}
	}
	/**
	 * Description: 用户登录验证(账号，密码登陆)
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  手机号
	 * Retrun: true/false
	 */
	public function  doLoginByMsg($mobile,$msg,$sign){
		if(!preg_match("/1[3-9]{1}\d{9}$/",$mobile)){
			$this->setError('请输入正确的手机号码');
			return false;
		}
	
// 		if($sign!=hash('sha256',session('xh_sign'))){
// 			$this->setError('请刷新页面！');
// 			return false;
// 		}
		if(empty($sign)){
			$this->setError('系统错误！');
			return false;
		}
		
		$code=session('verify_code');
		$verifyMobile=session('verify_mobile');
		if($code!=$msg||$verifyMobile!=$mobile){
			$this->setError('短息验证码错误，请重新正确输入或获取！');
			return false;
		}
		
		$where['MOBILE']=$mobile;
		$info=$this->model->where($where)->find();
		if(!$info){
			$this->setError('该手机号未注册账号！');
			return false;
		}
		if(!$info['status']){
			$this->setError('该账号被禁用，请联系管理员！');
			return false;
		}
		unset($info['password']);
		//unset($info['mobile']);
		unset($info['account']);
		session('user',$info);
		session('verify_mobile',null);//置空
		session('verify_time',null);
		return true;
		
	}
	 
	
	/**
	 * Description:用户获取短信验证码--(前端)
	 * Author: ward
	 * Date:2015-10-28
	 * Retrun: array/false
	 */
	public function getVerifiyMsg($mobile){
		$now=time();
		$time=session('verify_time');
		
		if(!$mobile)
		{
			//$this->ajaxReturn(array('status'=>0,'info'=>'手机号不能为空'));
			$this->setError('手机号不能为空!');
			return false;
		}
		if(!preg_match("/1[3-9]{1}\d{9}$/",$mobile)){
			//$this->ajaxReturn(array('status'=>0,'msg'=>'请输入正确的手机号码'));
			$this->setError('请输入正确的手机号码!');
			return false;
		}
		if(!$time||$now-$time>=60)
		{
			$code=make_char(4);
			$res=send_message_new($mobile,'您的验证码为'.$code);
			session('verify_mobile',$mobile);
			session('verify_time',$now);
			session('verify_code',$code);
			//$this->ajaxReturn(array('status'=>1));
			return true;
		}else{
			//$this->ajaxReturn(array('status'=>0,'msg'=>'60秒内只能发送一次，请耐心等待'));
			$this->setError('60秒内只能发送一次，请耐心等待!');
			return false;
			
		}
	}
	
	 
	/**
	 * Description: 用户获得自己发布的照片(调用到照片模块中的接口)
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  注册信息   array()
	 * Retrun: array/false
	 */
	public function getMyPhoto($selectArr){
		$photoLogic=new \Photo\Logic\PhotoLogic();
		$data=$photoLogic->getForUser($selectArr);
		return $data;
	}
	
	
	/**
	 * Description: 用户获得自己发布的游记(调用到游记模块中的接口)
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  注册信息   array()
	 * Retrun: array/false
	 */
	public function getMyTravels($selectArr){
		$travelsLogic=new \Travels\Logic\TravelsLogic();
		$data=$travelsLogic->getForUser($selectArr);
		return $data;
	}
	
	
	
	/**
	 * Description: 用户获得自己发表的评论(调用到评论模块中的接口)
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  注册信息   array()
	 * Retrun: array/false
	 */
	public function getMyComment($selectArr){
		$travelsLogic=new \Comment\Logic\CommentLogic();
		$data=$travelsLogic->getForUser($selectArr);
		return $data;
	}
	
	/**
	 * Description: 用户收藏/取消收藏 路线
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  注册信息   array()
	 * Retrun: array/false
	 */
	public function updateCollectWay($wayId){
		$collectModel=new \User\Model\CollectModel();
		$userId=session('user.id');
		//$userId=1;
	//	
		if(empty($userId)){

			$this->setError('系统错误！');
			return false;
		}
		
		$where['USER_ID']=$userId;
		$where['WAY_ID']=$wayId;
		$data=$collectModel->where($where)->find();
		
		if(empty($data)){
			$insertArr=$where;
			$insertArr['STATUS']=1;
			$insertArr['TIME']=time();
			$res=$collectModel->add($insertArr);
			$ret['status']=$res;//更新结果
			$ret['msg']=1;//1表示收藏0表示取消收藏
			return $ret;
		}else{
			if(intval($data['status'])){
				$save['STATUS']=0;
			}else{
				$save['STATUS']=1;
			}
			$res=$collectModel->where($where)->save($save);
			$ret['status']=$res;//更新结果
			$ret['msg']=$save['STATUS'];//1表示收藏0表示取消收藏
			return $ret;
		}
	}
	
	/**
	 * Description: 用户获得收藏的路线
	 * Author: ward
	 * Date:2015-10-28
	 *	Param:  注册信息   array()
	 * Retrun: array/false
	 */
	public function getMyCollect($selectArr){
		$collectModel=new \User\Model\CollectModel();
		$userId=session('user.id');
		if(empty($userId)){
			$this->setError('系统错误');
			return false;
		}
		
		$offset=0;
		$pageSize=20;//
		if(!empty($selectArr['limit'])){
			$pageSize=intval($selectArr['limit'])>0?intval($selectArr['limit']):10;
				
		}
		if(!empty($selectArr['start'])){
			$offset=intval($selectArr['start']);
		}
		if(!empty($selectArr['ordertype'])){
			$order='A.'.$selectArr['ordertype'].' DESC';
		}
		$where['A.USER_ID']=$userId;
		$where['A.STATUS']=1;//0表示删除
		
		$field='A.*,B.*';
		$data=$collectModel->alias('A')->join('left join __WAY__ as B on A.WAY_ID=B.ID')->field($field)
			->where($where)->limit($offset,$pageSize)->order($order)->select();
		$count=$collectModel->alias('A')->join('left join __WAY__ as B on A.WAY_ID=B.ID')->where($where)->count();
		
		$ret['data']=$data;
		$ret['count']=$count;
		return $ret;
	}
	
	/**
	 * Description: 用户登录成功后，更新登录记录信息
	 * Author: ward
	 * Retrun: int/false
	 */
	public  function updateLoginInfo(){
		$userId=session('user.id');
		if(empty($userId)){
			$this->setError('系统错误！');
			return false;
		}
		$data['LAST_LOGIN_IP']=get_client_ip();
		//$data['LAST_LOGIN_TIME']=time();
		$data['LAST_LOGIN_TIME']=date("Y-m-d H:i:s");
		$data=$this->model->create($data);
		if($data){
			$where['ID']=$userId;
			$this->model->where($where)->save($data);
		}else{
			return $data;
		}
	}

}
