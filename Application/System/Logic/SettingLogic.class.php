<?php
namespace System\Logic;


class SettingLogic extends \Think\Model {

    function _initialize()
    {
        $this->model=new \System\Model\SystemModel();
    }

    /**
     * Description: getSetting 获取列表
     * @return array|mixed|string
     * Author: Jason
     * Date:2015-12-11
     */
    public function getSetting() {
        $data = $this->model->getField('CODE,VALUE');
        return $data;
    }

    /**
     * Description: setting 设置参数
     * @return mixed
     * Author: Jason
     * Date:2015-12-11
     */
    function setting($data)
    {
        $this->model->where('1=1')->delete();
        $file_content='<?php
/**
 * 系统配置文件
 */
return array(
#CONTENT#
);';
        $str='';
        foreach($data as $key=>$value)
        {
            $res=$this->model->add(array('CODE'=>$key,'VALUE'=>$value));
            $str.="'{$key}'=>'{$value}',\n";
        }
        file_put_contents(COMMON_PATH.'Conf/system.php',str_replace('#CONTENT#',$str,$file_content));
        return true;
    }


    /**
     * Description: getInfo 获取信息
     * @param $id id
     * @return mixed
     * Author: Jason
     * Date: 2015.12.11
     */
    function getInfo($id)
    {
        return $this->model->find($id);
    }


}