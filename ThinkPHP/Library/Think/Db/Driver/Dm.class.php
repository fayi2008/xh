<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
namespace Think\Db\Driver;
use Think\Db\Driver;
defined('THINK_PATH') or exit();

/**
 * Mysql数据库驱动类
 */
class Dm extends Driver{

    private     $table        = '';
//    protected   $selectSql    = 'SELECT * FROM (SELECT thinkphp.*, rownum AS numrow FROM (SELECT  %DISTINCT% %FIELD% FROM %TABLE%%JOIN%%WHERE%%GROUP%%HAVING%%ORDER%) thinkphp ) %LIMIT%%COMMENT%';
// 是否使用永久连接
    protected $pconnect   = false;
    // 当前SQL指令
    protected $queryStr   = '';
// 数据库连接参数配置
    protected $config     = array(
        'type'              =>  '',     // 数据库类型
        'hostname'          =>  '127.0.0.1', // 服务器地址
        'database'          =>  '',          // 数据库名
        'username'          =>  '',      // 用户名
        'password'          =>  '',          // 密码
        'hostport'          =>  '',        // 端口
        'dsn'               =>  '', //
        'params'            =>  array(), // 数据库连接参数
        'charset'           =>  'utf8',      // 数据库编码默认采用utf8
        'prefix'            =>  '',    // 数据库表前缀
        'debug'             =>  false, // 数据库调试模式
        'deploy'            =>  0, // 数据库部署方式:0 集中式(单一服务器),1 分布式(主从服务器)
        'rw_separate'       =>  false,       // 数据库读写是否分离 主从式有效
        'master_num'        =>  1, // 读写分离后 主服务器数量
        'slave_no'          =>  '', // 指定从服务器序号
        'db_like_fields'    =>  '',
    );
    // 当前查询ID
    protected $queryID    = null;



    /**
     * 架构函数 读取数据库配置信息
     * @access public
     * @param array $config 数据库配置数组
     */
    public function __construct($config=''){
        if ( !extension_loaded('dm') ) {
            E(L('_NOT_SUPPERT_').':dm');
        }
        if(!empty($config)) {
            $this->config   =   array_merge($this->config,$config);;
            if(is_array($this->config['params'])){
                $this->options  =   $this->config['params'] + $this->options;
            }
        }
    }

    /**
     * 连接数据库方法
     * @access public
     * @throws ThinkExecption
     */
    public function connect($config='',$linkNum=0,$force=false) {
        if ( !isset($this->linkID[$linkNum]) ) {
            if(empty($config))  $config =   $this->config;
            // 处理不带端口号的socket连接情况
            $host = $config['hostname'].($config['hostport']?":{$config['hostport']}":'');
            // 是否长连接
            $pconnect   = !empty($config['params']['persist'])? $config['params']['persist']:$this->pconnect;
            if($pconnect) {
                $this->linkID[$linkNum] = dm_pconnect( $host, $config['username'], $config['password']);
            }else{
                $this->linkID[$linkNum] = dm_connect( $host, $config['username'], $config['password']);
            }
            /*if ( !$this->linkID[$linkNum] || (!empty($config['database']) && !dm_select_db($config['database'], $this->linkID[$linkNum])) ) {
                E(dm_error());
            }*/
            $dbVersion = dm_get_server_info($this->linkID[$linkNum]);
            //使用UTF8存取数据库
            //dm_query("SET NAMES '".$config['charset']."'", $this->linkID[$linkNum]);
            //设置 sql_model
            /*if($dbVersion >'5.0.1'){
                dm_query("SET sql_mode=''",$this->linkID[$linkNum]);
            }*/
            // 标记连接成功
            $this->connected    =   true;
            // 注销数据库连接配置信息
            //if(1 != C('DB_DEPLOY_TYPE')) unset($this->config);
        }
        return $this->linkID[$linkNum];
    }

    /**
     * 释放查询结果
     * @access public
     */
    public function free() {
        dm_free_result($this->queryID);
        $this->queryID = null;
    }

    /**
     * 执行查询 返回数据集
     * @access public
     * @param string $str  sql指令
     * @return mixed
     */
    public function query($str, $fetchSql = false) {
        if(0===stripos($str, 'call')){ // 存储过程查询支持
            $this->close();
            $this->connected    =   false;
        }
        $this->initConnect(false);
        if ( !$this->_linkID ) return false;
        $this->queryStr = $str;
        if($fetchSql){
            return $this->queryStr;
        }
        //释放前次的查询结果
        if ( $this->queryID ) {    $this->free();    }
        N('db_query',1);

        /*if(!C('DB_SUPPORT_UTF8')&&strtolower(C('DB_CHARSET'))=='utf8') {
            $str = iconv('UTF-8', 'GBK//IGNORE', $str);//达梦utf8编码失效，先转码成GBK
        }*/
        // 记录开始执行时间
        G('queryStartTime');
        $this->queryID = dm_query($str, $this->_linkID);
        $this->debug();
        if ( false === $this->queryID ) {
            $this->error();
            return false;
        } else {
            $this->numRows = dm_num_rows($this->queryID);
            return $this->getAll();
        }
    }

    /**
     * 执行语句
     * @access public
     * @param string $str  sql指令
     * @return integer|false
     */
    public function execute($str, $fetchSql = false) {
        $this->initConnect(true);
        if ( !$this->_linkID ) return false;
        $this->queryStr = $str;
        if($fetchSql){
            return $this->queryStr;
        }
        //释放前次的查询结果
        if ( $this->queryID ) {    $this->free();    }
        N('db_write',1);
        // 记录开始执行时间
        G('queryStartTime');
        
        $result =   dm_query($str, $this->_linkID) ;
        $this->debug();
        if ( false === $result) {
            $this->error();
            return false;
        } else {
            $this->numRows = dm_affected_rows($this->_linkID);
            $this->lastInsID = dm_insert_id($this->_linkID);
            return $this->numRows;
        }
    }

    /**
     * 数据库调试 记录当前SQL
     * @access protected
     * @param boolean $start  调试开始标记 true 开始 false 结束
     */
    protected function debug($start=false) {
        if($this->config['debug']) {// 开启数据库调试模式
            if($start) {
                G('queryStartTime');
            }else{
                $this->modelSql[$this->model]   =  $this->queryStr;
                //$this->model  =   '_think_';
                // 记录操作结束时间
                G('queryEndTime');
                trace($this->queryStr.' [ RunTime:'.G('queryStartTime','queryEndTime').'s ]','','SQL');
            }
        }
    }

    /**
     * 启动事务
     * @access public
     * @return void
     */
    public function startTrans() {
        $this->initConnect(true);
        if ( !$this->_linkID ) return false;
        //数据rollback 支持
        if ($this->transTimes == 0) {
            dm_query('START TRANSACTION', $this->_linkID);
        }
        $this->transTimes++;
        return ;
    }

    /**
     * 用于非自动提交状态下面的查询提交
     * @access public
     * @return boolen
     */
    public function commit() {
        if ($this->transTimes > 0) {
            $result = dm_query('COMMIT', $this->_linkID);
            $this->transTimes = 0;
            if(!$result){
                $this->error();
                return false;
            }
        }
        return true;
    }

    /**
     * 事务回滚
     * @access public
     * @return boolen
     */
    public function rollback() {
        if ($this->transTimes > 0) {
            $result = dm_query('ROLLBACK', $this->_linkID);
            $this->transTimes = 0;
            if(!$result){
                $this->error();
                return false;
            }
        }
        return true;
    }

    /**
     * 获得所有的查询数据
     * @access private
     * @return array
     */
    private function getAll() {
        //返回数据集
        $result = array();
        if($this->numRows >0) {
            while($row = dm_fetch_assoc($this->queryID)){
                $tmp=array();
                foreach($row as $key=>$value)
                {
                    if(!C('DB_SUPPORT_UTF8')&&strtolower(C('DB_CHARSET'))=='utf8') {
                        $value = iconv('GBK', 'UTF-8//IGNORE', $value);//达梦utf8编码失效，先转码成GBK
                    }
                    $tmp[strtolower($key)]=$value;
                }
                $result[]   =   $tmp;
            }
            dm_data_seek($this->queryID,0);
        }
        return $result;
    }

    /**
     * 取得数据表的字段信息
     * @access public
     * @return array
     */
    /*public function getFields($tableName) {
        $result =   $this->query('SHOW COLUMNS FROM '.$this->parseKey($tableName));
        $info   =   array();
        if($result) {
            foreach ($result as $key => $val) {
                $info[$val['Field']] = array(
                    'name'    => $val['Field'],
                    'type'    => $val['Type'],
                    'notnull' => (bool) (strtoupper($val['Null']) === 'NO'), // not null is empty, null is yes
                    'default' => $val['Default'],
                    'primary' => (strtolower($val['Key']) == 'pri'),
                    'autoinc' => (strtolower($val['Extra']) == 'auto_increment'),
                );
            }
        }
        return $info;
    }*/
    /**
     * 取得数据表的字段信息
     * @access public
     */
    public function getFields($tableName) {
        list($tableName) = explode(' ', $tableName);
        list($database,$tableName) = explode('.', $tableName);
        $result = $this->query("select a.column_name,data_type,decode(nullable,'Y',0,1) notnull,data_default,decode(a.column_name,b.column_name,1,0) pk "
            ."from user_tab_columns a,(select column_name from user_constraints c,user_cons_columns col "
            ."where c.constraint_name=col.constraint_name and c.constraint_type='P'and c.table_name='".strtoupper($tableName)
            ."') b where table_name='".strtoupper($tableName)."' and a.column_name=b.column_name(+)");
        $info   =   array();
        if($result) {
            foreach ($result as $key => $val) {
                $info[$val['column_name']] = array(
                    'name'    => $val['column_name'],
                    'type'    => strtolower($val['data_type']),
                    'notnull' => $val['notnull'],
                    'default' => $val['data_default'],
                    'primary' => $val['pk'],
                    'autoinc' => $val['pk'],
                );
            }
        }
        return $info;
    }

    /**
     * 取得数据库的表信息
     * @access public
     * @return array
     */
    public function getTables($dbName='') {
        if(!empty($dbName)) {
           $sql    = 'SHOW TABLES FROM '.$dbName;
        }else{
           $sql    = 'SHOW TABLES ';
        }
        $result =   $this->query($sql);
        $info   =   array();
        foreach ($result as $key => $val) {
            $info[$key] = current($val);
        }
        return $info;
    }

    /**
     * 替换记录
     * @access public
     * @param mixed $data 数据
     * @param array $options 参数表达式
     * @return false | integer
     */
    public function replace($data,$options=array()) {
        foreach ($data as $key=>$val){
            $value   =  $this->parseValue($val);
            if(is_scalar($value)) { // 过滤非标量数据
                $values[]   =  $value;
                $fields[]     =  $this->parseKey($key);
            }
        }
        $sql   =  'REPLACE INTO '.$this->parseTable($options['table']).' ('.implode(',', $fields).') VALUES ('.implode(',', $values).')';
        return $this->execute($sql);
    }

    /**
     * 插入记录
     * @access public
     * @param mixed $datas 数据
     * @param array $options 参数表达式
     * @param boolean $replace 是否replace
     * @return false | integer
     */
    public function insertAll($datas,$options=array(),$replace=false) {
        if(!is_array($datas[0])) return false;
        $fields = array_keys($datas[0]);
        array_walk($fields, array($this, 'parseKey'));
        $values  =  array();
        foreach ($datas as $data){
            $value   =  array();
            foreach ($data as $key=>$val){
                $val   =  $this->parseValue($val);
                if(is_scalar($val)) { // 过滤非标量数据
                    $value[]   =  $val;
                }
            }
            $values[]    = '('.implode(',', $value).')';
        }
        $sql   =  ($replace?'REPLACE':'INSERT').' INTO '.$this->parseTable($options['table']).' ('.implode(',', $fields).') VALUES '.implode(',',$values);
        return $this->execute($sql);
    }

    /**
     * 关闭数据库
     * @access public
     * @return void
     */
    public function close() {
        if ($this->_linkID){
            dm_close($this->_linkID);
        }
        $this->_linkID = null;
    }

    /**
     * 数据库错误信息
     * 并显示当前的SQL语句
     * @access public
     * @return string
     */
    public function error() {
        $this->error = dm_errno($this->_linkID).':'.dm_error($this->_linkID);
        if('' != $this->queryStr){
            $this->error .= "\n [ SQL语句 ] : ".$this->queryStr;
        }
        trace($this->error,'','ERR');
        return $this->error;
    }

    /**
     * SQL指令安全过滤
     * @access public
     * @param string $str  SQL字符串
     * @return string
     */
    public function escapeString($str) {
        return dm_escape_string($str);
    }

    /**
     * 字段名分析
     * @access protected
     * @param string $key
     * @return string
     */
    protected function parseKey(&$key) {
        // 统计查询的实现
        return $key;
    }

    /**
     * 字段名分析
     * @access protected
     * @param string $key
     * @return string
     */
    protected function parseExcuteKey(&$key) {
        // 统计查询的实现
        return '"'.$key.'"';
    }

    /**
     * 插入记录
     * @access public
     * @param mixed $data 数据
     * @param array $options 参数表达式
     * @param boolean $replace 是否replace
     * @return false | integer
     */
//    public function insert($data,$options=array(),$replace=false) {
//        $values  =  $fields    = array();
//        $this->model  =   $options['model'];
//        $this->parseBind(!empty($options['bind'])?$options['bind']:array());
//        foreach ($data as $key=>$val){
//            if(is_array($val) && 'exp' == $val[0]){
//                $fields[]   =  $this->parseExcuteKey($key);
//                $values[]   =  $val[1];
//            }elseif(is_null($val)){
//                $fields[]   =   $this->parseExcuteKey($key);
//                $values[]   =   'NULL';
//            }elseif(is_scalar($val)) { // 过滤非标量数据
//                $fields[]   =   $this->parseExcuteKey($key);
//                if(0===strpos($val,':') && in_array($val,array_keys($this->bind))){
//                    $values[]   =   $this->parseValue($val);
//                }else{
//                    $name       =   count($this->bind);
//                    $values[]   =   ':'.$name;
//                    $this->bindParam($name,$val);
//                }
//            }
//        }
//        // 兼容数字传入方式
//        $replace= (is_numeric($replace) && $replace>0)?true:$replace;
//        $sql    = (true===$replace?'REPLACE':'INSERT').' INTO '.$this->parseTable($options['table']).' ('.implode(',', $fields).') VALUES ('.implode(',', $values).')'.$this->parseDuplicate($replace);
//        $sql    .= $this->parseComment(!empty($options['comment'])?$options['comment']:'');
//        return $this->execute($sql,!empty($options['fetch_sql']) ? true : false);
//    }
    /**
     * 插入记录
     * @access public
     * @param mixed $data 数据
     * @param array $options 参数表达式
     * @param boolean $replace 是否replace
     * @return false | integer
     */
    public function insert($data,$options=array(),$replace=false) {
        $values  =  $fields    = array();
        $this->model  =   $options['model'];
        foreach ($data as $key=>$val){
            if(is_array($val) && 'exp' == $val[0]){
                $fields[]   =  $this->parseExcuteKey($key);
                $values[]   =  $val[1];
            }elseif(is_scalar($val) || is_null($val)) { // 过滤非标量数据
                $fields[]   =  $this->parseExcuteKey($key);
                if(C('DB_BIND_PARAM') && 0 !== strpos($val,':')){
                    $name       =   md5($key);
                    $values[]   =   ':'.$name;
                    $this->bindParam($name,$val);
                }else{
                    $values[]   =  $this->parseValue($val);
                }
                //$values[]   =  $this->parseValue($val);
            }
        }
        $sql   =  ($replace?'REPLACE':'INSERT').' INTO '.$this->parseTable($options['table']).' ('.implode(',', $fields).') VALUES ('.implode(',', $values).')';
        $sql   .= $this->parseLock(isset($options['lock'])?$options['lock']:false);
        $sql   .= $this->parseComment(!empty($options['comment'])?$options['comment']:'');
        return $this->execute($sql,$this->parseBind(!empty($options['bind'])?$options['bind']:array()));
    }

    /**
     * 更新记录
     * @access public
     * @param mixed $data 数据
     * @param array $options 表达式
     * @return false | integer
     */
    public function update($data,$options) {
        $this->model  =   $options['model'];
        $sql   = 'UPDATE '
            .$this->parseTable($options['table'])
            .$this->parseSet($data)
            .$this->parseWhere(!empty($options['where'])?$options['where']:'')
            .$this->parseOrder(!empty($options['order'])?$options['order']:'')
            .$this->parseLimit(!empty($options['limit'])?$options['limit']:'')
            .$this->parseLock(isset($options['lock'])?$options['lock']:false)
            .$this->parseComment(!empty($options['comment'])?$options['comment']:'');
        return $this->execute($sql,$this->parseBind(!empty($options['bind'])?$options['bind']:array()));
    }

    /**
     * 更新记录
     * @access public
     * @param mixed $data 数据
     * @param array $options 表达式
     * @return false | integer
     */
//    public function update($data,$options) {
//        $this->model  =   $options['model'];
//        $this->parseBind(!empty($options['bind'])?$options['bind']:array());
//        $table  =   $this->parseTable($options['table']);
//        $sql   = 'UPDATE ' . $table . $this->parseSet($data);
//        if(strpos($table,',')){// 多表更新支持JOIN操作
//            $sql .= $this->parseJoin(!empty($options['join'])?$options['join']:'');
//        }
//        $sql .= $this->parseWhere(!empty($options['where'])?$options['where']:'');
//        if(!strpos($table,',')){
//            //  单表更新支持order和lmit
//            $sql   .=  $this->parseOrder(!empty($options['order'])?$options['order']:'')
//                .$this->parseLimit(!empty($options['limit'])?$options['limit']:'');
//        }
//        $sql .=   $this->parseComment(!empty($options['comment'])?$options['comment']:'');
//        return $this->execute($sql,!empty($options['fetch_sql']) ? true : false);
//    }

    /**
     * set分析
     * @access protected
     * @param array $data
     * @return string
     */
//    protected function parseSet($data) {
//        foreach ($data as $key=>$val){
//            if(is_array($val) && 'exp' == $val[0]){
//                $set[]  =   $this->parseExcuteKey($key).'='.$val[1];
//            }elseif(is_null($val)){
//                $set[]  =   $this->parseExcuteKey($key).'=NULL';
//            }elseif(is_scalar($val)) {// 过滤非标量数据
//                if(0===strpos($val,':') && in_array($val,array_keys($this->bind)) ){
//                    $set[]  =   $this->parseExcuteKey($key).'='.$this->escapeString($val);
//                }else{
//                    $name   =   count($this->bind);
//                    $set[]  =   $this->parseExcuteKey($key).'=:'.$name;
//                    $this->bindParam($name,$val);
//                }
//            }
//        }
//        return ' SET '.implode(',',$set);
//    }

    /**
     * set分析
     * @access protected
     * @param array $data
     * @return string
     */
    protected function parseSet($data) {
        foreach ($data as $key=>$val){
            if(is_array($val) && 'exp' == $val[0]){
                $set[]  =   $this->parseExcuteKey($key).'='.$val[1];
            }elseif(is_scalar($val) || is_null($val)) { // 过滤非标量数据
                if(C('DB_BIND_PARAM') && 0 !== strpos($val,':')){
                    $name   =   md5($key);
                    $set[]  =   $this->parseExcuteKey($key).'=:'.$name;
                    $this->bindParam($name,$val);
                }else{
                    $set[]  =   $this->parseExcuteKey($key).'='.$this->parseValue($val);
                }
            }
        }
        return ' SET '.implode(',',$set);
    }

    /**
     * 参数绑定
     * @access protected
     * @param string $name 绑定参数名
     * @param mixed $value 绑定值
     * @return void
     */
    protected function bindParam($name,$value){
        $this->bind[':'.$name]  =   $value;
    }

    /**
     * 参数绑定分析
     * @access protected
     * @param array $bind
     * @return array
     */
    protected function parseBind($bind){
        $bind           =   array_merge($this->bind,$bind);
        $this->bind     =   array();
        return $bind;
    }

    /**
     * value分析
     * @access protected
     * @param mixed $value
     * @return string
     */
    protected function parseValue($value) {
        if(is_string($value)) {
            if(!C('DB_SUPPORT_UTF8')&&strtolower(C('DB_CHARSET'))=='utf8')
            {
                $value=iconv('UTF-8','GBK//IGNORE',$value);//达梦utf8编码失效，先转码成GBK
            }
            $value =  '\''.$this->escapeString($value).'\'';
        }elseif(isset($value[0]) && is_string($value[0]) && strtolower($value[0]) == 'exp'){
            $value =  $this->escapeString($value[1]);
        }elseif(is_array($value)) {
            $value =  array_map(array($this, 'parseValue'),$value);
        }elseif(is_bool($value)){
            $value =  $value ? '1' : '0';
        }elseif(is_null($value)){
            $value =  'null';
        }
        return $value;
    }

}