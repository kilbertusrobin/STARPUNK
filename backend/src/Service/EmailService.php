<?php
namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    private MailerInterface $mailer;
    private $params;

    public function __construct(MailerInterface $mailer, ParameterBagInterface $params)
    {
        $this->mailer = $mailer;
        $this->params = $params;
    }

    public function sendTestEmail(): void
    {
        $htmlContent = '
        <html>
            <head>
                <style>
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #E68900;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .button:hover {
                        background-color: #ff8c00;
                    }
                    .content {
                        margin-bottom: 50px;
                    }
                    img {
                        display: block;
                        margin: 40px auto 0;
                        max-width: 100%;
                    }
                </style>
            </head>
            <body>
                <table width="100%" style="height: 100vh;">
                    <tr>
                        <td style="text-align: center;">
                            <table style="width: 100%; height: 100%; background-image: url(\'https://res.cloudinary.com/dts3sgbe0/image/upload/v1733318704/background_unbvel.jpg\'); background-size: cover; background-position: center;">
                                <tr>
                                    <td style="text-align: center; height:100%; width:100%; padding: 20px;">
                                        <h1 style="color:orange; margin-bottom: 50px; font-size:40px">J\'ai besoin de toi, administrateur</h1>
                                        <p style="color:white; margin-bottom: 50px; font-size:20px">Certains utilisateurs attendent ta validation pour poster leurs illustrations</p>
                                        <div class="content">
                                            <a href="http://localhost:5173/admin" style="color:white; font-size:20px" class="button">Viens donner ton accord</a>
                                        </div>
                                        <img src="https://res.cloudinary.com/dts3sgbe0/image/upload/v1733322391/titlepng_pgmgoh.png" style="margin-top:40px">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>';
    
        $email = (new Email())
            ->from('contact@starpunk.art')
            ->to('rbx.fay@gmail.com')
            ->subject('Besoin de validation')
            ->html($htmlContent);
    
        $this->mailer->send($email);
    }
    
    
    

    public function sendConfirmationEmail($email, $username) {
        $htmlContent = '
        <html>
            <head>
                <style>
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #E68900;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .button:hover {
                        background-color: #ff8c00;
                    }
                    .content {
                        margin-bottom: 50px;
                    }
                    img {
                        display: block;
                        margin: 40px auto 0;
                        max-width: 100%;
                    }
                </style>
            </head>
            <body>
                <table width="100%" style="height: 100vh;">
                    <tr>
                        <td style="text-align: center;">
                            <table style="width: 100%; height: 100%; background-image: url(\'https://res.cloudinary.com/dts3sgbe0/image/upload/v1733318704/background_unbvel.jpg\'); background-size: cover; background-position: center;">
                                <tr>
                                    <td style="text-align: center; height:100%; width:100%; padding: 20px;">
                                        <h1 style="color:orange; margin-bottom: 50px; font-size:40px">Bonne nouvelle, '.$username.' !</h1>
                                        <p style="color:white; margin-bottom: 50px; font-size:20px">Un administrateur STARPUNK a consulté et approuvé ton illustration !</p>
                                        <div class="content">
                                            <a href="http://localhost:5173/planete" style="color:white; font-size:20px" class="button">Tu peux la consulter ici</a>
                                        </div>
                                        <img src="https://res.cloudinary.com/dts3sgbe0/image/upload/v1733322391/titlepng_pgmgoh.png" style="margin-top:40px">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>';

        $email = (new Email())
            ->from('contact@starpunk.art')
            ->to($email)
            ->subject('Validation de ton illustration')
            ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function imageDenied($email, $username, $reason, $ref) {
        $htmlContent = '
        <html>
            <head>
                <style>
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #E68900;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .button:hover {
                        background-color: #ff8c00;
                    }
                    .content {
                        margin-bottom: 50px;
                    }
                    img {
                        display: block;
                        margin: 40px auto 0;
                        max-width: 100%;
                    }
                </style>
            </head>
            <body>
                <table width="100%" style="height: 100vh;">
                    <tr>
                        <td style="text-align: center;">
                            <table style="width: 100%; height: 100%; background-image: url(\'https://res.cloudinary.com/dts3sgbe0/image/upload/v1733318704/background_unbvel.jpg\'); background-size: cover; background-position: center;">
                                <tr>
                                    <td style="text-align: center; height:100%; width:100%; padding: 20px;">
                                        <h1 style="color:orange; margin-bottom: 50px; font-size:40px">Mauvaise nouvelle, '.$username.' ...</h1>
                                        <p style="color:white; margin-bottom: 50px; font-size:20px">Un administrateur STARPUNK a consulté mais n\'a pas approuvé ton illustration, pour la raison suivante :</p>
                                        <p style="color:white; margin-bottom: 50px; font-size:20px">'.$reason.'</p>
                                        <p style="color:white; margin-bottom: 50px; font-size:20px">Si tu le souhaite, tu peux contacter nos équipes afin de faire appel (n° de dossier : '.$ref.'</p>
                                        <div class="content">
                                            <a href="http://localhost:5173/contact" style="color:white; font-size:20px" class="button">Page contact</a>
                                        </div>
                                        <img src="https://res.cloudinary.com/dts3sgbe0/image/upload/v1733322391/titlepng_pgmgoh.png" style="margin-top:40px">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>';

        $email = (new Email())
            ->from('contact@starpunk.art')
            ->to($email)
            ->subject('Validation de ton illustration')
            ->html($htmlContent);

        $this->mailer->send($email);
    }
}
