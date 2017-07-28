<?php
namespace Admin\Controller;

use Admin\Logic\IndexLogic;

class IndexController extends \Common\Controller\AdminController {
    /**
     * Description: index 后台框架
     * Author: Jason
     * Date:
     */
	function index() {
		$user = session ( 'admin' );
	
		$role_id = $user ['role_id'];
		$menu_logic = new \System\Logic\MenuLogic ();
		$access = new \System\Logic\AccessLogic ();
		$data = $access->getUserMenuID ();
		$submenus = $menu_logic->submenu ();
		if ($role_id != 1) {
			foreach ( $submenus as $key => $val ) {
				if (! in_array ( $key, $data )) {
					unset ( $submenus [$key] );
				}
			}
		}
		if ($role_id != 1) {
			if($data){
				$menu_json = $menu_logic->menu_json ( $data );
			}else{
				$menu_json=json_encode(array());
			}
			
			
		} else {
			
			$menu_json = $menu_logic->menu_json ();
		}
		$this->assign ( 'submenus', $submenus );
		$this->assign ( 'menu_json', $menu_json );
		$this->display ();
	}
    /**
     * Description: index 后台首页
     * Author: Jason
     * Date:
     */
    function main()
    {
        $logic=new IndexLogic();
        $info=$logic->main();
        $this->assign ( 'server_info', $info );
        $this->display('main');
    }




}