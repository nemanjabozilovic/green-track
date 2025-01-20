<?php
require_once __DIR__ . '/php-email-form.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$contact = new PHP_Email_Form;
$contact->ajax = true;

if (!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  die('Invalid subscriber email address.');
}

$subscriber_email = $_POST['email'];

$contact->to = 'info@akademijanis.edu.rs';
$contact->from_name = 'Newsletter Subscription';
$contact->from_email = $subscriber_email;
$contact->subject = "New Newsletter Subscription from: " . $subscriber_email;

$contact->smtp = array(
  'host' => '127.0.0.1',
  'username' => '',
  'password' => '',
  'port' => '25'
);

$contact->add_message("New subscriber: " . $subscriber_email, 'Email');

$result = $contact->send();
if ($result === true) {
    echo 'OK';
} else {
    echo 'Error: ' . $result;
}