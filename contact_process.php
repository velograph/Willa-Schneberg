<?php
/* PHP Form Mailer - easy, secure form mail:
  phpFormMailer v2.7

 last updated 25th Nov 2014 - check back often for updates!
     (easy to use and more secure than many cgi form mailers) FREE from:

                  www.TheDemoSite.co.uk

      Should work fine on most Unix/Linux platforms
      for a Windows version see: asp.thedemosite.co.uk
*/

// ------- three variables you MUST change below  -------------------------------------------------------
$replyemail="rick.kolinsky@gmail.com"; //change to your email address
$valid_ref1="http://threewayconversation.org/contact2.html"; //chamge to your domain name
$valid_ref2="http://threewayconversation.org/contact2.html"; //chamge to your domain name

// -------- No changes required below here -------------------------------------------------------------
//
// email variable not set - load $valid_ref1 page
if (!isset($_POST['email'])){
    echo "<script language=\"JavaScript\"><!--\n ";
    echo "top.location.href = \"$valid_ref1\"; \n// --></script>";
    exit;
}
//check provided email address is VALID.
if(filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)==FALSE ){
    echo "<script language=\"JavaScript\"><!--\n alert(\"ERROR - email address provided is invalid.\\n\\n\");\n";
    echo "top.location.href = \"$valid_ref1\"; \n// --></script>";
    exit;
}
$ref_page=$_SERVER["HTTP_REFERER"];
$valid_referrer=0;
if($ref_page==$valid_ref1) $valid_referrer=1;
elseif($ref_page==$valid_ref2) $valid_referrer=1;
if((!$valid_referrer) OR ($_POST["block_spam_bots"]!=12))//you can change this but remember to change it in the contact form too
{
 echo '<h2>ERROR - not sent.';
 if (file_exists("debug.flag")) echo '<hr>"$valid_ref1" and "$valid_ref2" are incorrect within the file:<br>
                                      contact_process.php <br><br>On your system these should be set to: <blockquote>
                                                                          $valid_ref1="'.str_replace("www.","",$ref_page).'"; <br>
                                                                          $valid_ref2="'.$ref_page.'";
                                                                          </blockquote></h2>Copy and paste the two lines above
                                                                          into the file: contact_process.php <br> (replacing the existing variables and settings)';
 exit;
}

//check user input for possible header injection attempts!
function is_forbidden($str,$check_all_patterns = true)
{
 $patterns[0] = '/content-type:/';
 $patterns[1] = '/mime-version/';
 $patterns[2] = '/multipart/';
 $patterns[3] = '/Content-Transfer-Encoding/';
 $patterns[4] = '/to:/';
 $patterns[5] = '/cc:/';
 $patterns[6] = '/bcc:/';
 $forbidden = 0;
 for ($i=0; $i<count($patterns); $i++)
  {
   $forbidden = preg_match($patterns[$i], strtolower($str));
   if ($forbidden) break;
  }
 //check for line breaks if checking all patterns
 if ($check_all_patterns AND !$forbidden) $forbidden = preg_match("/(%0a|%0d|\\n+|\\r+)/i", $str);
 if ($forbidden)
 {
  echo "<font color=red><center><h3>STOP! Message not sent.</font></h3><br><b>
        The text you entered is forbidden, it includes one or more of the following:
        <br><textarea rows=9 cols=25>";
  foreach ($patterns as $key => $value) echo trim($value,"/")."\n";
  echo "\\n\n\\r</textarea><br>Click back on your browser, remove the above characters and try again.
        </b><br><br><br><br>Thankfully protected by phpFormMailer freely available from:
        <a href=\"http://thedemosite.co.uk/phpformmailer/\">http://thedemosite.co.uk/phpformmailer/</a>";
  exit();
 }
}

foreach ($_REQUEST as $key => $value) //check all input
{
 if ($key == "themessage") is_forbidden($value, false); //check input except for line breaks
 else is_forbidden($value);//check all
}

$name = $_POST["name"];
$email = $_POST["email"];
$thesubject = $_POST["thesubject"];
$themessage = $_POST["themessage"];

$success_sent_msg='<p align="center"><strong>&nbsp;</strong></p>
                   <p align="center"><strong>Your message has been successfully sent to us<br>
                   </strong> and we will reply as soon as possible.</p>
                   <p align="center">A copy of your query has been sent to you.</p>
                   <p align="center">Thank you for contacting us.</p>';

$replymessage = "Hi $name

Thank you for your email.

We will endeavour to reply to you shortly.

Please DO NOT reply to this email.

Below is a copy of the message you submitted:
--------------------------------------------------
Subject: $thesubject
Query:
$themessage
--------------------------------------------------

Thank you";

$themessage = "name: $name \nQuery: $themessage";
mail("$replyemail",
     "$thesubject",
     "$themessage",
     "From: $email\nReply-To: $email");
mail("$email",
     "Receipt: $thesubject",
     "$replymessage",
     "From: $replyemail\nReply-To: $replyemail");
echo $success_sent_msg;
/*
  PHP Form Mailer - phpFormMailer (easy to use and more secure than many cgi form mailers)
   FREE from:

    www.TheDemoSite.co.uk       */
?>