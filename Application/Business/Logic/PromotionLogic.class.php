<?php

namespace Business\Logic;

class PromotionLogic extends \Think\Model {
	function _initialize() {
		$this->model = new \Business\Model\PromotionModel ();
	}

	/**
	 * Description:getPromotion
	 * @param $business_id
	 * @return mixed
	 * Author:jason
	 */
	function getPromotion($business_id)
	{
		return $this->model->where(array('BUSINESS_ID'=>$business_id))->find();
	}

	/**
	 * Description:updatePromotion 更新promotion信息
	 * @param $business_id
	 * @param $name
	 * @param $description
	 * @return mixed
	 * Author:jason
	 */
	function updatePromotion($business_id,$name,$description)
	{
		$promotion=$this->getPromotion($business_id);
		if(!$promotion)
		{
			$data=array(
				'NAME'=>$name,
				'DESCRIPTION'=>$description,
				'BUSINESS_ID'=>$business_id
			);
			return $this->model->add($data);
		}else{
			$data=array(
				'ID'=>$promotion['id'],
				'NAME'=>$name,
				'DESCRIPTION'=>$description,
				'BUSINESS_ID'=>$business_id
			);
			return $this->model->save($data);
		}

	}
}
