export const sendPasswordResetEmail = (user, link) =>
  `Hi <strong>${user.fullName}!</strong><br> Here is Your Update Password Link, Please Click: <strong><a href='http://localhost:4200/pages/authentication/reset-password-v2?userId=${user._id}&code=${link}'>Here</a></strong>`;

export const InquiryEmailTemplate = (user) => `Hi <strong> There! </strong> <br> From Construction web  this user ${user.fromEmail} want to claim this from you as he voted previously, please have a look on his Bill, <br> <strong> ${user.text} </strong>,<br> you can find his email from CC <br> Thanks <br> construction web`;


export const verifyUserDuringRegistration = (user, link) =>
  `Hi <strong>${user.fullName}!</strong><br> Here is Your confirmation link, Please Click: <strong><a href='http://localhost:4200/pages/authentication/activate-user-v2?userId=${user._id}&code=${link}'>Here</a></strong>`;

export const forgotPasswordTemplate = (updateUrl, userId) => `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">

    <style type="text/css">

        #outlook a { padding: 0; }
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass * { line-height:100%; }
        body { font-family: Open Sans; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        p { display: block; margin: 13px 0; }
    </style>
    <style type="text/css">
        @media only screen and (max-width:480px)
        {
            @-ms-viewport { width:320px; }
            @viewport { width:320px; }
        }
    </style>
    <style type="text/css">
        @media only screen and (min-width:480px) {
            .mj-column-per-100 { width:100%!important; }  }
    </style>

</head>
<body style="font-family: 'Open Sans', sans-serif;background: #FFFFFF;">

<div class="mj-container" style="background-color:#FFFFFF;">
    <div style="margin:40px auto;max-width:800px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;">
                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;text-align:left;width:100%;">
                        <table role="presentation" width="800" cellpadding="0" cellspacing="0" style="width:800px;max-width:800px;min-width:800px" align="center" border="0" >
                            <tbody>
                            <tr>
                                <td style="word-wrap:break-word;" align="center">
                                    <div style="cursor:auto;text-align:center;position: relative;">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                            
                                            <tr>
                                                <td>
                                                    <img style="display:block;margin:0 auto;" src="http://goodmeeting.today/img/logo.png" width='200' alt="">
                                                    
                                                    <h2 style="color:#5e5e5e;font-size:18px;text-align:center;font-weight:bolder; margin-top: 70px;">You told us you forgot password. If you really did, Click here to choose a new one. </h2>
                                                    <ul style="margin: 50px 0px;text-align: center;">
                                                        <li style="display: inline-block;">
                                                            <a style="color: #fff;font-size:16px;background-color: #0653D7;text-decoration: none;    padding: 15px 40px;    border-radius: 0;margin-right: 0;"   href="${updateUrl}?userId=${userId}">Choose a new password</a>
                                                        </li> 
                                                    </ul>        
                                                    <p style="color:#625675;font-size:16px;text-align:center;line-height:   25px;font-weight:bolder">If you didn't mean to reset password, then you can just ignore this<br> email, your password will not change.</p>
                                                </td>
                                            </tr>
                                           


                                            </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>

</div>
</body>
</html>`;
