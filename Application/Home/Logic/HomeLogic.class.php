<?php
namespace  Home\Logic;
class HomeLogic extends \Think\Model{
		
	protected $wayLoigc,$photoLogic,$travelsLogic,$cultureLogic,$cateLogic;
	
	public function index(){
		
		$data=S('Home');
		if(!empty($data)&&is_array($data)){
			return $data;	
		}
		$this->wayLoigc=new \Way\Logic\WayLogic();//路线
		$this->photoLogic=new \Photo\Logic\PhotoLogic();//印象
		$this->travelsLogic=new \Travels\Logic\TravelsLogic();//游记
		$this->cultureLogic=new \Culture\Logic\CultureLogic();//文化
		$this->cateLogic=new \Culture\Logic\CateLogic();
		$this->news = new \Culture\Logic\NewsLogic ();
		$res=array();
		
		$res['photo']=$this->photoLogic->getForAll();
		//$res['travels']=$this->travelsLogic->getForAll();
		$res['travels']=$this->travelsLogic->getForHome();
		$res['way']=$this->wayLoigc->getHomeWays();
		$res['culture']=$this->cultureLogic->getHotCulture();
		$res['cate']=$this->cateLogic->getTop6Cate();
		$res['news']=$this->news->web_get_list(0);
		S('Home',$res,array('type'=>'file','expire'=>3000));
		return $res;
	}
}