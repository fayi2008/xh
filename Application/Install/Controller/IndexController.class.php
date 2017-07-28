<?php

namespace Install\Controller;
use Think\Exception;

/**
 * 系统安装向导
 */
class IndexController extends \Think\Controller {

	/**
	 * 安装锁定文件
	 * @var type 
	 */
	protected $lock_file = null;

	/**
	 * 安装需要检查的目录权限
	 * @var type 
	 */
	protected $check_dir = array();

	/**
	 * 数据库文件 
	 * @var type 
	 */
	protected $sql_file = null;

	/**
	 * 配置模版文件
	 * @var type 
	 */
	protected $conf_tmpl = null;

	/**
	 * 系统配置文件位置
	 * @var type 
	 */
	protected $conf_file = null;

	/**
	 * 安装步骤名称
	 * @var type 
	 */
	protected $steps = array(
		's1' => '安装许可协议',
		's2' => '运行环境检测',
		's3' => '安装参数设置',
		's4' => '安装详细过程',
		's5' => '安装完成',
	);

	public function _initialize() {
		/* 替换写入的路径 */
		$this->lock_file = PUBLIC_ROOT . 'install.lock';
		$this->sql_file = APP_PATH . 'Install/Data/sqlinit.sql';
		$this->conf_tmpl = APP_PATH . 'Install/Data/config.php';
		$this->conf_file = APP_PATH . 'Common/Conf/db.php';
		$this->check_dir = array(
			DATA_PATH,
            COMMON_PATH.'Conf',
            PUBLIC_ROOT.'pano',
            PUBLIC_ROOT.'upload',
		);

		if ('s5' !== ACTION_NAME && file_exists($this->lock_file)) {
			$this->show('你已经安装过该系统，如果想重新安装，请先删除站点Public目录下的 install.lock 文件，然后再安装。');
			die();
		}
		$this->title = APP_NAME . ' ' . APP_VERSION . ' 安装向导';
	}

	/**
	 * 安装许可协议
	 */
	public function index() {
        $this->redirect('s2');
		$this->step = $this->steps['s1'];
		$this->display('s1');
	}

	/**
	 * 运行环境检测
	 */
	public function s2() {
		$info = array();
		$this->step = $this->steps['s2'];
		$info['phpv'] = phpversion();
		$info['os'] = PHP_OS;
		$info['os'] = php_uname();
		$info['server'] = $_SERVER["SERVER_SOFTWARE"];
		$info['host'] = (empty($_SERVER["SERVER_ADDR"]) ? $_SERVER["SERVER_HOST"] : $_SERVER["SERVER_ADDR"]);
		$info['name'] = $_SERVER["SERVER_NAME"];
		$info['max_execution_time'] = ini_get('max_execution_time');
		$info['allow_reference'] = (ini_get('allow_call_time_pass_reference') ? '<font color=green>[√]On</font>' : '<font color=red>[×]Off</font>');
		$info['allow_url_fopen'] = (ini_get('allow_url_fopen') ? '<font color=green>[√]On</font>' : '<font color=red>[×]Off</font>');
		$info['safe_mode'] = (ini_get('safe_mode') ? '<font color=red>[×]On</font>' : '<font color=green>[√]Off</font>');

		$err = 0;
		$tmp = function_exists('gd_info') ? gd_info() : array();
		if (empty($tmp['GD Version'])) {
			$info['gd'] = '<font color=red>[×]Off</font>';
			$err++;
		} else {
			$info['gd'] = '<font color=green>[√]On</font> ' . $tmp['GD Version'];
		}
		if (extension_loaded("PDO_DM")) {
			$info['database_version'] = '<span class="correct_span">&radic;</span> 已安装';
		} else {
			$info['database_version'] = '<span class="correct_span error_span">&radic;</span> 达梦数据库PDO_DM驱动未安装';
			$err++;
		}
		if (ini_get('file_uploads')) {
            $upload_max_filesize=ini_get('upload_max_filesize');
            if(intval($upload_max_filesize)>=50)
            {
                $info['uploadSize'] = '<span class="correct_span">&radic;</span> ' . ini_get('upload_max_filesize');
            }else{
                $info['uploadSize'] = '<span class="correct_span error_span">&radic;</span> ' . ini_get('upload_max_filesize');
                $err++;
            }
		} else {
			$info['uploadSize'] = '<span class="correct_span error_span">&radic;</span>禁止上传';
            $err++;
		}
		if (function_exists('session_start')) {
			$info['session'] = '<span class="correct_span">&radic;</span> 支持';
		} else {
			$info['session'] = '<span class="correct_span error_span">&radic;</span> 不支持';
			$err++;
		}
		$info['err'] = $err;
		$info['folder'] = $this->check_dir;
		$this->assign($info);
		$this->display();
	}

	/**
	 * 安装参数设置
	 */
	public function s3() {
		$this->step = $this->steps['s3'];
		$this->display();
	}

	/**
	 * 安装详细过程
	 */
	public function s4() {
		if (intval($_GET['install'])) {
			$n = intval($_GET['n']);
			$arr = array();

			$dbPort = trim($_POST['dbport']);
			$dbName = trim($_POST['dbname']);
			$dbHost = trim($_POST['dbhost']);
			$dbHost = empty($dbPort) || $dbPort == 5236 ? $dbHost : $dbHost . ':' . $dbPort;
			$dbUser = trim($_POST['dbuser']);
			$dbPwd = trim($_POST['dbpw']);
			$dbPrefix = empty($_POST['dbprefix']) ? 'HQ_' : trim($_POST['dbprefix']);

			$username = trim($_POST['manager']);
			$password = trim($_POST['manager_pwd']);
			$email = trim($_POST['manager_email']);
            $db_support_utf8=intval($_POST['db_support_utf8']);

            $db_dsn = 'dm:host='.$dbHost . ':' . $dbPort;
            $conn = new \PDO($db_dsn, $dbUser, $dbPwd);
            if (!$conn) {
                $arr['msg'] = "连接数据库失败!";
                echo json_encode($arr);
                exit;
            }


			//$conn = @ mysql_connect($dbHost, $dbUser, $dbPwd);


			/*$version = mysql_get_server_info($conn);
			if ($version < 4.1) {
				$arr['msg'] = '数据库版本太低!';
				echo json_encode($arr);
				exit;
			}*/

			/*if (!mysql_select_db($dbName, $conn)) {
				//创建数据时同时设置编码
			    select distinct object_name TABLE_SCHEMA from all_objects where object_type = 'SCH';
				if (!mysql_query("CREATE DATABASE IF NOT EXISTS `" . $dbName . "` DEFAULT CHARACTER SET utf8;", $conn)) {
					$arr['msg'] = '数据库 ' . $dbName . ' 不存在，也没权限创建新的数据库！';
					echo json_encode($arr);
					exit;
				}
				if (empty($n)) {
					$arr['n'] = 1;
					$arr['msg'] = "成功创建数据库:{$dbName}<br>";
					echo json_encode($arr);
					exit;
				}
				mysql_select_db($dbName, $conn);
			}*/
            // 创建模式
            $sql="select distinct object_name from all_objects where object_type = 'SCH' AND object_name='{$dbName}'";
            $res=$conn->query($sql);
            $res=$res->fetchColumn();
            if(!$res)
            {
                $res=$conn->exec('CREATE SCHEMA "'.$dbName.'" AUTHORIZATION "'.$dbUser.'"');
                if($res!==false)
                {
                    if (empty($n)) {
                        $arr['n'] = 1;
                        $arr['msg'] = "成功创建数据库模式:{$dbName}<br>";
                        echo json_encode($arr);
                        exit;
                    }
                }else{
                    $arr['msg'] = '数据库 ' . $dbName . ' 不存在，也没权限创建新的数据库！';
                    echo json_encode($arr);
                    exit;
                }

            }

			//读取数据文件
			$sqldata = file_get_contents($this->sql_file);
            $sqldata=str_replace('"XH"."','"'.$dbName.'"."'.$dbPrefix,$sqldata);
			$sqlFormat = sql_split($sqldata, $dbPrefix);

			/**
			  执行SQL语句
			 */
            if($n==0)
            {
                $n=1;
            }

			$counts = count($sqlFormat);
			for ($i = $n; $i <= $counts; $i++) {
				$sql = trim($sqlFormat[$i-1]);
				if (strstr($sql, 'CREATE TABLE')) {
					preg_match('/CREATE TABLE "'.$dbName.'"."([^ ]*)"/', $sql, $matches);
                    //$conn->exec("DROP TABLE IF EXISTS `$matches[1]");
                    if(!$db_support_utf8)
                    {
                        $sql=iconv('UTF-8','GBK',$sql);
                    }
					$ret = $conn->exec($sql);
					if ($ret!==false) {
						$message = '<li><span class="correct_span">&radic;</span>创建数据表' . $matches[1] . '，完成</li> ';
					} else {
						$message = '<li><span class="correct_span error_span">&radic;</span>创建数据表' . $matches[1] . '，失败</li>';
					}
					$i++;
					$arr = array('n' => $i, 'msg' => $message);
					echo json_encode($arr);
					exit;
				} else {
                    if(!$db_support_utf8)
                    {
                        $sql=iconv('UTF-8','GBK',$sql);
                    }
                    $ret = $conn->exec($sql);
					$message = '';
					$arr = array('n' => $i, 'msg' => $message);
				}
			}

			if ($i == 999999) {
				exit;
			}

			//读取配置文件，并替换真实配置数据
			$strConfig = file_get_contents($this->conf_tmpl);
			$strConfig = str_replace('#DB_HOST#', $dbHost, $strConfig);
			$strConfig = str_replace('#DB_NAME#', $dbName, $strConfig);
			$strConfig = str_replace('#DB_USER#', $dbUser, $strConfig);
			$strConfig = str_replace('#DB_PWD#', $dbPwd, $strConfig);
			$strConfig = str_replace('#DB_PORT#', $dbPort, $strConfig);
            $strConfig = str_replace('#DB_SUPPORT_UTF8#', $db_support_utf8, $strConfig);
			$strConfig = str_replace('#DB_PREFIX#', $dbPrefix, $strConfig);
			$strConfig = str_replace('#AUTHCODE#', sp_random_string(18), $strConfig);
			$strConfig = str_replace('#COOKIE_PREFIX#', sp_random_string(6) . "_", $strConfig);
			@chmod($this->conf_file, 0777);
			file_put_contents($this->conf_file, trim($strConfig));

			//插入管理员
			//生成随机认证码
			$verify = sp_random_string(6);
			$time = time();
			$create_date = date("Y-m-d h:i:s");
			$ip = get_client_ip();
			$ip = empty($ip) ? "0.0.0.0" : $ip;
			$password = password_encrypt($password);
			$query = "INSERT INTO \"{$dbName}\".\"{$dbPrefix}ADMINS\" (ACCOUNT,PASSWORD,NICKNAME,EMAIL,LAST_LOGIN_IP,LAST_LOGIN_TIME,CREATE_TIME,STATUS,ROLE_ID,MOBILE,PASS_CODE) VALUES ( '{$username}', '{$password}', '', '{$email}', '{$ip}', '{$create_date}','{$create_date}',1,1,'','');";

            $res=$conn->exec($query);

			$message = '成功添加管理员<br />成功写入配置文件<br>安装完成．';
			$arr = array('n' => 999999, 'msg' => $message);
			echo json_encode($arr);
			exit;
		}
		$this->step = $this->steps['s4'];
		$this->display();
	}

	/**
	 * 安装完成
	 */
	public function s5() {
		touch($this->lock_file);
		$this->step = $this->steps['s5'];
		$this->display();
	}

	public function testdbpwd() {
		$dbHost = 'dm:host='.$_POST['dbHost'] . ':' . $_POST['dbPort'];
		$conn = new \PDO($dbHost, $_POST['dbUser'], $_POST['dbPwd']);
		if ($conn) {
			die("1");
		} else {
			die("");
		}
	}

}
