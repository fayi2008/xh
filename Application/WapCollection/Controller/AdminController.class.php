<?php

namespace WapCollection\Controller;

class AdminController extends \Common\Controller\CultureController {
	function _init() {
	}
	
	public function cate_delete() {
	}
	function index() {
		
		$this->display ( 'index' );
	}
	/**
	 * Description: index 后台首页
	 * Author: Jason
	 * Date:
	 */
	function main() {
		$this->display ( 'main' );
	}
}