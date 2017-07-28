<?php
namespace System\Controller;

class CacheController extends \Common\Controller\AdminController {
    /**
     * Description: index 显示缓存管理界面
     * Author: Jason
     * Date: 2015-10-20
     */
    public function index_get_html(){
        $this->display();
    }

    /**
     * Description: map_put 修改缓存配置
     * Author: Jason
     * Date:
     */
    public function clean_post(){
        $types=$_POST['type'];
        foreach($types as $type)
        {
            switch($type)
            {
                case 1:
                    $dir=CACHE_PATH;
                    $dh=opendir($dir);
                    while ($file=readdir($dh)) {
                        if($file!="." && $file!="..") {
                            $fullpath=$dir."/".$file;
                            if(!is_dir($fullpath)) {
                                unlink($fullpath);
                            } else {
                                deldir($fullpath);
                            }
                        }
                    }
                    closedir($dh);
                    break;
                case 2:
                    $dir=DATA_PATH;
                    $dh=opendir($dir);
                    while ($file=readdir($dh)) {
                        if($file!="." && $file!="..") {
                            $fullpath=$dir."/".$file;
                            if(!is_dir($fullpath)) {
                                unlink($fullpath);
                            }
                        }
                    }
                    closedir($dh);
                    break;
                case 3:
                    $dir=TEMP_PATH;
                    $dh=opendir($dir);
                    while ($file=readdir($dh)) {
                        if($file!="." && $file!="..") {
                            $fullpath=$dir."/".$file;
                            if(!is_dir($fullpath)) {
                                unlink($fullpath);
                            } else {
                                deldir($fullpath);
                            }
                        }
                    }
                    closedir($dh);
                    break;
                case 4:
                    $dir=DATA_PATH;
                    $dh=opendir($dir);
                    while ($file=readdir($dh)) {
                        if($file!="." && $file!="..") {
                            $fullpath=$dir."/".$file;
                            if(is_dir($fullpath)&&$file=='_fields') {
                                deldir($fullpath);
                                break;
                            }
                        }
                    }
                    closedir($dh);
                    break;
                case 5:
                    $fullpath=RUNTIME_PATH.APP_MODE.'~runtime.php';
                    if(file_exists($fullpath)) {
                                unlink($fullpath);
                    }
                    break;
            }
        }
        $this->success('清除缓存完毕！');

    }


}