<?php
require_once __DIR__ . '/php-email-form.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$contact = new PHP_Email_Form;
$contact->ajax = true;

if (!isset($_POST['name']) || empty($_POST['name'])) {
  die('Error: Name is required.');
}

if (!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  die('Error: Invalid email address.');
}

if (!isset($_POST['subject']) || empty($_POST['subject'])) {
  die('Error: Subject is required.');
}

if (!isset($_POST['message']) || empty($_POST['message'])) {
  die('Error: Message cannot be empty.');
}

$contact->to = 'info@akademijanis.edu.rs';
$contact->from_name = htmlspecialchars($_POST['name']);
$contact->from_email = htmlspecialchars($_POST['email']);
$contact->subject = htmlspecialchars($_POST['subject']);

$contact->smtp = array(
  'host' => '127.0.0.1',
  'username' => '',
  'password' => '',
  'port' => '25'
);

$contact->add_message($_POST['name'], 'From');
$contact->add_message($_POST['email'], 'Email');
$contact->add_message($_POST['message'], 'Message', 10);

$result = $contact->send();
if ($result === true) {
    echo 'OK';
} else {
    echo 'error: ' . $result;
}