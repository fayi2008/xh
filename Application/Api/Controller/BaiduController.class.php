<?php

namespace Api\Controller;

class BaiduController extends \Common\Controller\BaseController {
	function _init() {
		$this->logic = new \Api\Logic\BaiduLogic ();
	}
	function textToVoice() {
		$text = $_GET ['text'];
	//	$text = '你是一个美女，你是一个小瘪三';
		$this->logic->textToVoice ( $text );
	}
}
