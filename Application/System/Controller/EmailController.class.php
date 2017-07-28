<?php
namespace System\Controller;
use PhpImap\Mailbox as ImapMailbox;
use PhpImap\IncomingMail;
use PhpImap\IncomingMailAttachment;
class EmailController extends \Think\Controller {

    /**
     * Description: receive 接受邮件
     * Author: Jason
     * Date:2015-10-01
     */
    public function receive(){
        if(!is_dir(DATA_PATH.'email/'))
        {
            mkdir(DATA_PATH.'email/');
        }
        $mailbox = new ImapMailbox(C('COLLECT_EMAIL_IMAP_PATH'), C('COLLECT_EMAIL_USER'), C('COLLECT_EMAIL_PASS'), DATA_PATH.'email/','UTF-8');
        $logic=new \Culture\Logic\CollectionLogic();
        $last_create_time=$logic->getLastEmailCreateTime();
        if(!$last_create_time)
        {
            $last_create_time=toDate(time()-86400,'Y-m-d');
        }else{
            $last_create_time=substr($last_create_time,0,10);
        }
// Read all messaged into an array:
        $mailsIds = $mailbox->searchMailbox('SUBJECT "[采集" SINCE "'.$last_create_time.'" UNANSWERED ');

        if(!$mailsIds) {
            die('Mailbox is empty');
        }

        foreach($mailsIds as $mailId)
        {
            $mail = $mailbox->getMail($mailId);
            $subject=$mail->subject;
            if(strpos($subject,'[采集资讯]')!==false)
            {
                $subject=str_replace('[采集资讯]','',$subject);
                $type=1;
            }else{
                $subject=str_replace('[采集文化]','',$subject);
                $type=2;
            }
            $email=$mail->fromAddress;
            $data=array(
                'TITLE'=>$subject,
                'CONTENT'=>$mail->textHtml,
                'TYPE'=>$type,
                'SOURCE_FROM'=>'EMAIL',
                'EMAIL'=>$email,
                'CREATE_TIME'=>$mail->date,
                'UPDATE_TIME'=>$mail->date
            );
            $res=$logic->addCollectionByData($data);
            $mailbox->setFlag(array($mailId),"\\Answered");
            echo '采集成功：'.$res."\n";
        }
        echo "complete";
    }



}