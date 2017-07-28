<?php
namespace Location\Logic;

class LocationLogic extends \Think\Model{
	protected  $logModel,$statisticsModel;
	public function _initialize(){
		$this->logModel=new \Location\Model\LogModel();
		$this->statisticsModel=new \Location\Model\StatisticsModel();
		
	}
	
	/*
	 * Description: 查询统计信息
	 * Param:  筛选数据    array('startDate'=>'','endDate'=>'','startPage'=>'','poiArr'=>array())
	 * Author： ward
	 * Date:2015-10-30
	 */
	public function  getRecord($selectArr,&$res){
		$startDate=$selectArr['startDate'];
		$endDate=$selectArr['endDate'];
		$poiArr=$selectArr['poiArr'];
		$where['DATE']=array(array('egt',$startDate),array('elt',$endDate));
		$where['POI_ID']=array('in',$poiArr);
		
		$offset=(intval($selectArr['startPage'])-1)*10;
		$length=10;
		$data=$this->statisticsModel->where($where)->field('*')->select();
		$poiData=$this->getPoiOption($poiArr);
		if(empty($poiData)||false===$data){
			return false;
		}
		
		
		$retArr=array();
		foreach ($poiData as $k=>$poi){
			$unixDate=strtotime($startDate);
			$sum=0;
			while($unixDate<=strtotime($endDate)){
				$flag=0;
				$newKey=$poi['id'].$poi['name'];
				foreach ($data as $k2=>$val){
					if(strtotime($val['date'])==$unixDate&&$poi['id']==$val['poi_id']){
						$flag=1;
						$retArr[$newKey][]=$val['people_sum'];
						$sum=$sum+$val['people_sum'];
						break;
					}	
				}
				if(0===$flag){
					$retArr[$newKey][]='0';
				}
				$unixDate=$unixDate+86400;
			}
			$res[]=array('id'=>$poi['id'],'name'=>$poi['name'],'sum'=>$sum);
		}
		return $retArr;
		
	}
	
	
	/*
	 * Description: 导出csv格式
	 * Param:  筛选数据    array('startDate'=>'','endDate'=>'')
	 * Author： ward
	 * Date:2015-11-26
	 */
	public function exportCsv($selectArr){
		$startDate=$selectArr['startDate'];
		$endDate=$selectArr['endDate'];
		//获得所有景区的poi点id和name
		$field='ID,NAME';
		$map['TYPE']=2;
		$poiModel=new \Location\Model\PoiModel();
		$poiData=$poiModel->where($map)->field($field)->select();
		if(empty($poiData)){
			return false;
		}
		$poiArr=array();
		foreach ($poiData as $k=>$v){
			$poiArr[]=$v['id'];
		}
		//查询统计数据
		$where['DATE']=array(array('egt',$startDate),array('elt',$endDate));
		$where['POI_ID']=array('in',$poiArr);
		$data=$this->statisticsModel->where($where)->field('*')->select();
		
		if(empty($data)){
			$data=array();
		}
		
		//处理统计数据
		$retArr=array();
		$head='编号,名称,总量';
		foreach ($poiData as $k=>$poi){
			$unixDate=strtotime($startDate);
			$sum=0;
			while($unixDate<=strtotime($endDate)){
				$flag=0;
				$newKey=$poi['id'].$poi['name'];
				foreach ($data as $k2=>$val){
					if(strtotime($val['date'])==$unixDate&&$poi['id']==$val['poi_id']){
						$flag=1;
						break;
					}
				}
				if(0===$flag){
					$val['people_sum']=0;
				}
				$retArr[$k]['data']=$retArr[$k]['data'].','.$val['people_sum'];
				$retArr[$k]['name']=$poi['name'];
				$retArr[$k]['id']=$poi['id'];
				$sum=$sum+$val['people_sum'];
				$unixDate=$unixDate+86400;
				if($k<1){
					$head=$head.','.date('m-d',$unixDate);
				}
			}
			$retArr[$k]['sum']=$sum;
		}
		$head.="\n";
		foreach ($retArr as $arr){
			$head .= $arr['id'].",".$arr['name'].",".$arr['sum'].$arr['data']."\n"; //用引文逗号分开
		}
		//unset($retArr);
		$fileName = time().'.csv'; //设置文件名
		header("Content-type:text/csv");
		header("Content-Disposition:attachment;filename=".$fileName);
		header('Cache-Control:must-revalidate,post-check=0,pre-check=0');
		header('Expires:0');
		header('Pragma:public');
		echo $head;
		
	}
	
	
	/*
	 * Description: 记录定位信息---(前端接口)
	 * Param:  筛选数据    array('lat'=>'','lon'=>''])
	 * Author： ward
	 * Date:2015-10-30
	 */
	public function add($gisArr){
		//1.计算获得最近的poi点
		$insertArr['POI_ID']=0;
		$poiArr=$this->getNearestPoi($gisArr,$distance=10000);
		$poiId=$poiArr['id'];
		
		if(!empty($poiId)){
			$insertArr['POI_ID']=$poiId;
		}
		
		//2.记录前端发送过来的定位坐标信息

		$userId=session('user.id');
		if($userId)
		{
			$insertArr['USER_ID']=$userId;
		}else{
			$insertArr['USER_ID']=0;
		}
		if(!empty($userId)){
			$where['USER_ID']=$userId;		
		}
		$date=date('Y-m-d');
		$unixTime=time();
		$insertArr['IP']=get_client_ip();
		$insertArr['LAT']=$gisArr['lat'];
		$insertArr['LON']=$gisArr['lon'];
		$insertArr['TIME']=$unixTime;
	//	$insertArr['DATE']=$date;
		$res=$this->logModel->add($insertArr);//无论是啥类型数据，均先记录地理信息
	
		//3.用户id为空（即游客登录）或间隔2小时内没有有同一个poi点的地理信息的记录
		if(empty($poiId)){// 如果不在景区附近，则不用更新统计数据
			return $res;
		}
		
		if(!empty($userId)){//用户id为空直接更新统计表
			$where['USER_ID']=$userId;
			$where['POI_ID']=$poiId;
			$where['TIME']=array('gt',$unixTime-7200);//间隔大于2个小时
			$data=$this->logModel->where($where)->find();
			if(empty($data)){//间隔2小时内没有同一个poi点的地理信息的记录，则更新统计信息
				//return $res;
				//更新统计记录表
				$map['POI_ID']=$poiId;
				$map['DATE']=$date;
				$info=$this->statisticsModel->where($map)->find();
				if($info){
					$ret=$this->statisticsModel->where($map)->setInc('PEOPLE_SUM');
					//return $ret;
				}else{
					$insert=array('POI_ID'=>$poiId,'PEOPLE_SUM'=>1,'DATE'=>$date);
					$ret=$this->statisticsModel->add($insert);
					//return $ret;
				}
			}
		}else{
			//更新统计记录表
			$map['POI_ID']=$poiId;
			$map['DATE']=$date;
			$info=$this->statisticsModel->where($map)->find();
			if($info){
				$ret=$this->statisticsModel->where($map)->setInc('PEOPLE_SUM');
				//return $ret;
			}else{
				$insert=array('POI_ID'=>$poiId,'PEOPLE_SUM'=>1,'DATE'=>$date);
				$ret=$this->statisticsModel->add($insert);
				//return $ret;
			}
		}

		//推送最近的有文化类型的全景（）---未测试
		$data=$this->getNearestPano($gisArr,$distance=10000);
		/*if(!empty($data)){
			$data['attrs']=$data['attrs'];
		}*/
		$data['excerpt']=html_entity_decode($data['excerpt']);
		return array('poi'=>$poiId,'pano'=>$data);
	}
	
	private function  getNearestPoi($gisArr,$distance){
		$poiModel=new \Location\Model\PoiModel();
		//$distance=intval($gisArr['distance']);
		$lat=$gisArr['lat'];
		$lon=$gisArr['lon'];
		$dist=distance2degree($lat,$distance);
		
		$where['LON']=array('BETWEEN',($lon-$dist['lng_d']).','.($lon+$dist['lng_d']));
		$where['LAT']=array('BETWEEN',($lat-$dist['lat_d']).','.($lat+$dist['lat_d']));
		$data=$poiModel->where($where)->field('ID,LAT,LON')->select();
		
		if(empty($data)){
			return array();
		}
		$ret=quickSortForGis($lat, $lon, $data);
		return $ret[0];
		
	}
	
	/**
	 * 获得离该坐标最近的有文化类型的全景（前提：全景均要带坐标）
	 */
	private  function getNearestPano($gisArr,$distance){
		
		$panoModel=new \Location\Model\PanoModel();
		//$distance=intval($gisArr['distance']);
		$lat=$gisArr['lat'];
		$lon=$gisArr['lon'];		
		//
		$dist=distance2degree($lat,$distance);
		$where['a.LON']=array('BETWEEN',($lon-$dist['lng_d']).','.($lon+$dist['lng_d']));
		$where['a.LAT']=array('BETWEEN',($lat-$dist['lat_d']).','.($lat+$dist['lat_d']));
		$where['b.TYPE']=5;//表示热点为文化文章热点
		$where['c.STATUS']=1;//表示文章已经发布
		$field='a.LAT,a.LON,c.ID,c.TITLE,c.ATTRS,c.EXCERPT,b.PANO_ID,b.PANO_KEY,b.ID as HOT_ID,b.Z_INDEX,b.LAT as H_LAT,b.LON as H_LON';
	//	$where['culture_flag']=1;  //此处暂时不打开
		
		$data=$panoModel->alias('a')->join('left join __PANORAMA_HOT__ as b on a.ID=b.PANO_ID  ')
						->join('left join __CULTURE__ as c on b.CULTURE_ID=c.ID')->where($where)->field($field)->select();
		if(empty($data)){
			$distance=$distance*2;
			$dist=distance2degree($lat,$distance);
			$where['a.LON']=array('BETWEEN',($lon-$dist['lng_d']).','.($lon+$dist['lng_d']));
			$where['a.LAT']=array('BETWEEN',($lat-$dist['lat_d']).','.($lat+$dist['lat_d']));
			$data=$panoModel->alias('a')->join('left join __PANORAMA_HOT__ as b on a.ID=b.PANO_ID  ')
					->join('left join __CULTURE__ as c on b.CULTURE_ID=c.ID')
					->where($where)->field($field)->select();
			if(empty($data)){
				return array();
			}
		}
		$ret=quickSortForGis($lat, $lon, $data);
		return $ret[0];
	}
	
	
	
	/**
	 * 仅供定位管理统计页面
	 */
	public function getPoiOption($poiArr){
		$poiModel=new \Location\Model\PoiModel();
		$field='ID,NAME';
		$where['TYPE']=2;//2表示景区
		if(!empty($poiArr)){
			$where['ID']=array('in',$poiArr);
			$data=$poiModel->where($where)->field($field)->select();
			return $data;
		}
		$data=$poiModel->where($where)->field($field)->select();
		if(empty($data)){
			return $data;
		}
		$newData=array();
		$count=count($data);
		foreach ($data as $k=>$v){
			$start=intval($k/10);
		
			$newData[$start]['id']=$newData[$start]['id'].','.$v['id'];
			$newData[$start]['hidden']=$newData[$start]['hidden'].','.$v['name'];
			if(0===($k+1)%10){
				$newData[$start]['name']='第'.($start*10+1).'到'.(($start+1)*10).'个';
				$newData[$start]['id']=trim($newData[$start]['id'],',');
				$newData[$start]['hidden']=trim($newData[$start]['hidden'],',');
			}
			if($k==($count-1)){
				$newData[$start]['id']=trim($newData[$start]['id'],',');
				$newData[$start]['hidden']=trim($newData[$start]['hidden'],',');
				$newData[$start]['name']='最后一组';
			}	
		}
		return $newData;
	}
	
	
	
}