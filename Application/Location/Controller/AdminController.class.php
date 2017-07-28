<?php
namespace Location\Controller;
class AdminController extends \Common\Controller\AdminController {

	protected $logic;
    public  function _init(){
        $this->logic=new \Location\Logic\LocationLogic();
        
    }

    /**
     * Description: index 显示定位统计界面、
     * Author: Ward
     * Date:
     */
    public function index_get_html() {
//     	echo "<pre/>";
     	$data=$this->logic->getPoiOption();
//     	var_dump($data);exit('re');
		$this->assign('data',$data);
    	$this->display('index_index');
    }
    
    /**
     * Description: index 显示定位统计界面、
     * Author: Ward
     * Date:
     */
    public function index_get_json() {
    	$startDate=$_GET['s_date'];
    	$endDate=$_GET['e_date'];
    	$poiArr=explode(',', trim($_GET['p_str']));
    	$selectArr=array('startDate'=>$startDate,'endDate'=>$endDate,'poiArr'=>$poiArr);
    	$sumArr=array();
    	$data=$this->logic->getRecord($selectArr,$sumArr);
    
    	$num=1;
    	$startDate=strtotime($startDate)*1000;
    	$colorArr=array('#ee7b7b','#f3895f','#b0ca73',
    			'#f3c15f','#73ccba','#7eb5e3','#8689d5',
    			'#d586d5','#5adfeb','#d7ab72');
    	foreach ($data as $k=>$v){
    		$ret[]=array('name'=>$k,'pointStart'=>$startDate,
    				'pointInterval'=>'86400000','color'=>$colorArr[$num],'data'=>$v);
    		$num+=1;
    	}
    	$data=array('data'=>$ret,'sum'=>$sumArr);
    	$data=json_encode($data);
    	echo $data;
    }
    
   
    
    /**
     * Description: index 下载统计图表
     * Author: Ward
     * Date: 2015-11-26
     */
    public function down_get(){
    	$startDate=$_GET['s_date'];
    	$endDate=$_GET['e_date'];
    	$selectArr=array('startDate'=>$startDate,'endDate'=>$endDate);
    	$data=$this->logic->exportCsv($selectArr);
    	echo $data;
    	
    	
    }
   
   
    
    
      
    
     
}