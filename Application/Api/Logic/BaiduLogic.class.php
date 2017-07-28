<?php

namespace Api\Logic;

class BaiduLogic extends \Think\Model {
	function _initialize() {
	}
	function getToten() {
		$tts_config = C ( 'TTS_CONFIG' );
		$token = S ( 'tts_token' );
		if (! $token) {
			$auth_url = "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=" . $tts_config ['apiKey'] . "&client_secret=" . $tts_config ['secretKey'];
			$ch = curl_init ();
			curl_setopt ( $ch, CURLOPT_URL, $auth_url );
			curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
			curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 5 );
			curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
			curl_setopt ( $ch, CURLOPT_SSL_VERIFYHOST, false );
			$response = curl_exec ( $ch );
			if (curl_errno ( $ch )) {
				print curl_error ( $ch );
			}
			curl_close ( $ch );
			$response = json_decode ( $response, true );
			$token = $response ['access_token'];
			S ( 'tts_token', $token, 2592000 );
			return $token;
		}
		return $token;
	}
	function textToVoice($text) {
		$token = $this->getToten ();
		$tts_config = C ( 'TTS_CONFIG' );
		$url = "http://tsn.baidu.com/text2audio";
		$array = array (
				"tex" => urlencode ( urlencode ( $text ) ),
				"lan" => urlencode ( urlencode ( "zh" ) ),
				"tok" => urlencode ( urlencode ( $token ) ),
				"ctp" => urlencode ( urlencode ( "1" ) ),
				"cuid" => urlencode ( urlencode ( $tts_config ['ccid'] ) ) 
		);
		$str = "tex={$array['tex']}&lan={$array['lan']}&tok={$array['tok']}&ctp={$array['ctp']}&cuid={$array['cuid']}";
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt ( $ch, CURLOPT_POST, 1 );
		curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 30 );
		curl_setopt ( $ch, CURLOPT_TIMEOUT, 30 );
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $str );
		$response = curl_exec ( $ch );
		if (curl_errno ( $ch )) {
			print curl_error ( $ch );
		}
		curl_close ( $ch );
		header ( "Content-Type: audio/mp3; charset=utf-8" );
		echo $response;
		die ();
	}
}