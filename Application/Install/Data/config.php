<?php
/**
 * 系统配置文件
 */
return array(
	'DB_TYPE'			 => 'dm',
	'DB_HOST'			 => '#DB_HOST#',
	'DB_NAME'			 => '#DB_NAME#',
	'DB_USER'			 => '#DB_USER#',
	'DB_PWD'			 => '#DB_PWD#',
	'DB_PORT'			 => '#DB_PORT#',
	'DB_PREFIX'			 => '#DB_PREFIX#',
    'DB_DSN' => 'dm:host=#DB_HOST#:#DB_PORT#',
    'DB_SUPPORT_UTF8' => '#DB_SUPPORT_UTF8#',
	/* Data Auth Key */
	"DATA_AUTH_KEY"		 => '#AUTHCODE#',
	/* cookies Prefix */
	"COOKIE_PREFIX"		 => '#COOKIE_PREFIX#',
);