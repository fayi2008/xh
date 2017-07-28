<?php

namespace Culture\Model;

class CollectionModel extends \Think\Model {
    protected $tableName="collection";

    const TYPE_NEWS=1;//��Ѷ
    const TYPE_CULTURE=2;//����Ļ�

    const SOURCE_FROM_WEB='WEB';
    const SOURCE_FROM_MESSAGE='MESSAGE';
    const SOURCE_FROM_EMAIL='EMAIL';
    const SOURCE_FROM_PHONE='PHONE';

}
