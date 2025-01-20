<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$mail = new PHPMailer(true);

class PHP_Email_Form {

    public $to = '';
    public $from_name = '';
    public $from_email = '';
    public $subject = '';
    public $smtp = array();
    public $messages = array();
    public $ajax = false;

    public function add_message($content, $label = '', $priority = 0) {
        $this->messages[] = array(
            'content' => $content,
            'label' => $label,
            'priority' => $priority
        );
    }

    public function send() {
        $email_body = "";
        foreach ($this->messages as $message) {
            $email_body .= ($message['label'] ? $message['label'] . ": " : "") . $message['content'] . "\n";
        }

        if (!empty($this->smtp)) {
            return $this->send_smtp_mail($this->to, $this->subject, $email_body);
        } else {
            return mail($this->to, $this->subject, $email_body, "From: " . $this->from_email);
        }
    }

    private function send_smtp_mail($to, $subject, $message) {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $this->smtp['host'];
            $mail->SMTPAuth = false;
            $mail->SMTPSecure = false;
            $mail->Port = $this->smtp['port'];
    
            $mail->setFrom($this->from_email, $this->from_name);
            $mail->addAddress($to);
            $mail->Subject = $subject;
            $mail->Body = $message;
            $mail->isHTML(false);
    
            if (!$mail->send()) {
                return "Error: " . $mail->ErrorInfo;
            }
            return true;
        } catch (Exception $e) {
            return "Mailer Error: " . $mail->ErrorInfo;
        }
    }
}