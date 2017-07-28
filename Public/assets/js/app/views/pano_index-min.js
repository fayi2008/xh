define(['common/search', 'common/page'], function (require) {
    //var BUI = require('bui/common'),
    var Search = require('common/search');

    var columns = [
            {
                title: '缩略图', dataIndex: 'origin_img', width: 100,sortable:false, renderer: function (value, obj) {
                var src=value.replace( /\.jpg$/i, "_s.jpg");
                return '<img src="/pano/' + src + '" class="pano_img"  />';
            }
            },
            {title: '编号', dataIndex: 'pano_key', width: 140},
            {title: '标题', dataIndex: 'title', width: 120},
            {title: 'poi点名称', dataIndex: 'bname', width: 100},
            {title: '分组名称', dataIndex: 'cname', width: 100},
            {
                title: '状态', dataIndex: 'post_status', width: 100, renderer: function (value, obj) {
                var status = obj.post_status;
                if (status == 0) {
                    if (obj.pano_status == 0) {
                        return "<span id = 'f" + obj.id + "'>全景未生成</span>";
                    } else if (obj.pano_status == 1) {
                        return "<span id = 'f" + obj.id + "'>生成全景中...</span>";
                    } else if (obj.pano_status == 2) {
                        return "<span id = 'f" + obj.id + "'>全景待发布</span>";
                    } else if (obj.pano_status == 3) {
                        return "<span id = 'f" + obj.id + "'>全景生成失败</span>";
                    } else if (obj.pano_status == 4) {
                        return "<span id = 'f" + obj.id + "'>排队中...</span>";
                    }
                } else if (status == 1) {
                    return "<span id = 'f" + obj.id + "'>已发布</span>"
                }
            }
            },
            {
                title: '操作', dataIndex: 'act', width: 200, sortable:false,renderer: function (value, obj) {

                var href = '/Panorama/admin/index_update/id/' + obj.id;
                var editallhref = '/Panorama/admin/update.html?poi_id=' + obj.poi_id;

                var status = obj.post_status;
                if(obj.post_status == 0)
                {
                    var editStr = '<span id = "edit_btn_' + obj.id + '" title="编辑"><a href="' + href + '">编辑</a></span>';
                }else{
                    var editStr = '<span id = "edit_btn_' + obj.id + '" title="请取消发布后再编辑"><font color="gray">编辑</font></span>';
                }

                editStr += ' <span><a href="javascript:editall(' + obj.poi_id + ')">批量编辑</a></span>';//编辑整组全景
                var delStr = ' <span class="orange btn-del btn pointer" title="">删除</span>';//页面操作不需要使用Search.createLink

                var releaseStr = '';
                if (status == 0 && obj.pano_status == 2) {
                    releaseStr = ' <span id = "s' + obj.id + '"> <a href="javascript:relItem(' + obj.id + ')" >发布</a></span>';
                } else if (status == 1) {
                    releaseStr = ' <span id = "s' + obj.id + '"> <a href="javascript:unrelItem(' + obj.id + ')" >取消发布</a></span>';
                } else {
                    releaseStr = '<span > <a><font color="gray">发布</font></a></span>';
                }


                return editStr + releaseStr + delStr;
            }
            },
            {
                title: '其他操作', width: 200,dataIndex: 'act_other',sortable:false,renderer: function (value, obj) {
                var hotHref = '/Panorama/admin/hot/id/' + obj.id + "#panoid=" + obj.pano_key;
                if (obj.pano_status == 2) {
                    var hotStr = ' <span class="grid-command btn" title=""><a class="page-action" href="#" title="全景热点管理" data-id="panorama-hot" data-href="' + hotHref + '">热点管理</a></span>';
                } else {
                    var hotStr = ' <span ><a data-id="panorama-hot" ><font color="gray">热点管理</font></a></span>';
                }
                var produceStr = '';
                if (obj.post_status == 0 && obj.pano_status != 2 && obj.pano_status != 1 && obj.pano_status != 4) {
                    produceStr = ' <a class="pano_create" data-id="' + obj.id + '" href="javascript:void(0)" >制作全景</a>';
                } else {
                    produceStr = ' <span ><a><font color="gray">制作全景</font></a></span>';
                }
                var previewHref = '/Panorama#panoid=' + obj.pano_key+'&preview=1';
                if (obj.pano_status == 2) {
                    var prev = ' <span class="grid-command btn" title=""><a target="_blank" href="' + previewHref + '">预览</a></span>';
                } else {
                    var prev = ' <span class="grid-command btn" title=""><font color="gray">预览</font></span>';
                }
                return produceStr + hotStr + prev;
            }
            }

        ],
        store, search, gridCfg;


    //删除操作
    function delFunction() {
        var selections = grid.getSelection();
        delItems(selections);
    }




    function init(api) {
        store = Search.createStore(api, {remoteSort: true});
        gridCfg = Search.createGridCfg(columns, {
            render:'#grid',
            tbar: {
                items: [
                    {
                        text: '添加全景', btnCls: 'button button-success', handler: function () {
                        if (top.topManager) {
                            if($('#business_id').val())
                            {
                                top.topManager.openPage({
                                    moduleId:'system',
                                    id:'pano_add',
                                    href:'/panorama/admin/index_add.html',
                                    search : 'id='+ api.substring(api.indexOf('?id=') + 4)
                                });
                            }else{
                                top.topManager.openPage({
                                    moduleId:'pano',
                                    id:'add',
                                    search : 'id='+ api.substring(api.indexOf('?id=') + 4)
                                });
                            }
                        }
                    }
                    }
                ]
            },
            bbar: {
                items: [
                    {
                        text: '批量删除', btnCls: 'button button-danger del-selected-btn', handler: function () {
                        var selections = grid.getSelection();
                        delItems(selections);
                    }
                    },
                    {
                        text: '批量制作', btnCls: 'button button-warning make-selected-btn', handler: function () {
                        var items = grid.getSelection();
                        makePanos(items);
                        }
                    }
                ],
                pagingBar:true
            },
            listeners : {
                aftershow : function(ev){
                        //var grid=search.get('grid');
                        var render = this.get('render'),width;
                        width = $(render).width();
                        this.set('width',width);
                }
            },
            plugins: [BUI.Grid.Plugins.CheckSelection, BUI.Grid.Plugins.AutoFit] // 插件形式引入多选表格
        });
        search = new Search({
            store: store,
            gridCfg: gridCfg
        });
        grid = search.get('grid');
        bind();
        return search;
    }

    function makePanos(items)
    {
        var ids = [];
        BUI.each(items, function (item) {
            ids.push(item.id);
        });

        if (ids.length) {
            $.ajax({
                type: "post",
                url: "/panorama/admin/creation.json",
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    if (data.status == 1) {
                        BUI.Message.Alert('已将全景添加到制作队列中', function () {
                            if (top.topManager) {
                                top.topManager.reloadPage();
                            }
                        }, 'success');
                    } else {
                        BUI.Message.Alert('创建全景失败！' + data.msg, 'error');
                    }
                }
            });
        }
    }

    function relPanos(items) {
        var ids = [];
        BUI.each(items, function (item) {
            ids.push(item.id);
        });
        if (ids.length) {
            $.ajax({
                url: '/panorama/admin/index_release',
                dataType: 'json',
                type: 'put',
                data: {ids: ids, unrel: 0},
                success: function (data) {
                    if (data.status) { //发布成功
                        BUI.Message.Alert('批量发布操作完毕', function () {
                            store.load();
                        }, 'success');
                    } else { //删除失败
                        BUI.Message.Alert('发布失败！');
                    }
                }
            });
        }

    }

    function bind() {
        //监听事件，删除一条记录
        grid.on('cellclick', function (ev) {
            var sender = $(ev.domTarget); //点击的Dom
            if (sender.hasClass('btn-del')) {
                var record = ev.record;
                delItems([record]);
            }
        });
        grid.on('afterRenderUI', function (ev) {
            var render = grid.get('render'),
            width = $('#grid').width();
            alert(width);
        });

        $("body").on('click', 'a.pano_create:not(.disable)', function () {
            var id = $(this).attr('data-id'), el = $(this);
            el.addClass("disable").html("排队中...");
            $.ajax({
                type: "post",
                url: "/panorama/admin/creation.json",
                data: {id: id},
                dataType: "json",
                success: function (data) {
                    if (data.status == 1) {
                        BUI.Message.Alert('已将全景添加到制作队列中', function () {
                            store.load();
                        }, 'success');
                    } else {
                        BUI.Message.Alert('创建全景失败！' + data.msg, 'error');
                    }
                    el.html("排队中...");
                }
            });
        });

    }

    function delItems(items) {
        var ids = [];
        BUI.each(items, function (item) {
            ids.push(item.id);
        });

        if (ids.length) {
            BUI.Message.Confirm('确认要删除选中的记录么？', function () {
                $.ajax({
                    url: '/Panorama/admin/index',
                    dataType: 'json',
                    type: "delete",
                    data: {ids: ids},
                    success: function (data) {
                        if (data.status == 1) { //删除成功
                            store.load();
                        } else { //删除失败
                            BUI.Message.Alert('删除失败！');
                        }
                    }
                });
            }, 'question');
        }
    }

    return function (v) {
        init(v)
    }
});

function relItem(id) {
    $.ajax({
        url: '/panorama/admin/index_release',
        dataType: 'json',
        type: 'put',
        data: {id: id, unrel: 0},
        success: function (data) {
            if (data.status) { //删除成功
                /*BUI.Message.Alert('发布成功！',function(){
                 self.location = data.data;
                 });*/
                document.getElementById("f" + id).innerHTML = "已发布";
                document.getElementById("s" + id).innerHTML = '<a href="javascript:unrelItem(' + id + ')" >取消发布</a>';
                $('#edit_btn_'+id).html('<font class="gray"> 编辑</font>');
                $('#edit_btn_'+id).attr('title','请取消发布后再编辑');
            } else { //删除失败
                BUI.Message.Alert('发布失败！');
            }
        }
    });
}
function unrelItem(id) {
    $.ajax({
        url: '/panorama/admin/index_release',
        dataType: 'json',
        type: 'put',
        data: {id: id, unrel: 1},
        success: function (data) {
            if (data.status) { //删除成功
                /*BUI.Message.Alert('发布成功！',function(){
                 self.location = data.data;
                 });*/
                document.getElementById("f" + id).innerHTML = "全景待发布";
                document.getElementById("s" + id).innerHTML = ' <a href="javascript:relItem(' + id + ')" >发布</a>';
                $('#edit_btn_'+id).html('<a href="/Panorama/admin/index_update/id/' + id + '">编辑</a>');
                $('#edit_btn_'+id).attr('title','编辑');
            } else { //删除失败
                BUI.Message.Alert('取消发布失败！');
            }
        }
    });
}



function editall(poi_id)
{
    var editallhref = '/Panorama/admin/update.html?poi_id=' + poi_id;
    top.topManager.openPage({
        id : 'edit-all',
        href : editallhref,
        title : '批量编辑',
        reload :true
    });
}
