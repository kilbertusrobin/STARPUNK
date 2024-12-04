<?php
namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendTestEmail(): void
    {
        $htmlContent = '
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-image: url(\'http://localhost:8000/images-post/background.jpg\');
                        background-size: cover;
                        background-position: center;
                        color: white;
                        padding: 0;
                        margin: 0;
                        box-sizing: border-box;
                    }
                    h1 {
                        color: #E68900;
                    }
                    p {
                        width: 80%;
                    }
                    .container {
                        width: 95%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: start;
                        gap: 20px;
                        height: 95%;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #E68900;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .button:hover {
                        background-color: #ff8c00;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>J\'ai besoin de toi, administrateur</h1>
                    <p>Certains utilisateurs attendent ta validation pour poster leurs illustrations</p>
                    <a href="http://localhost:5173/admin" class="button">Viens donner ton accord</a>
                    <img src="http://localhost:8000/images-post/titre.svg" alt="titre" style="width: 50%; margin-top: 20px;">
                </div>
            </body>
        </html>';

        $email = (new Email())
            ->from('supervisor@starpunk.com')
            ->to('admin@example.com')
            ->subject('Besoin de validation')
            ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendConfirmationEmail($email, $username) {
        $htmlContent = '
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-image: url(\'http://localhost:8000/images-post/background.jpg\');
                        background-size: cover;
                        background-position: center;
                        color: white;
                        padding: 0;
                        margin: 0;
                        box-sizing: border-box;
                    }
                    h1 {
                        color: #E68900;
                    }
                    p {
                        width: 80%;
                    }
                    .container {
                        width: 95%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: start;
                        gap: 20px;
                        height: 95%;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #E68900;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .button:hover {
                        background-color: #ff8c00;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Bonne nouvelle, '.$username.' ! </h1>
                    <p>Ton illustration a été consultée et approuvée par un administrateur STARPUNK</p>
                    <a href="http://localhost:5173/planete" class="button">Tu peux désormais la consulter ici !</a>
                    <img src="http://localhost:8000/images-post/titre.svg" alt="titre" style="width: 50%; margin-top: 20px;">
                </div>
            </body>
        </html>';

        $email = (new Email())
            ->from('supervisor@starpunk.com')
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
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-image: url(\'http://localhost:8000/images-post/background.jpg\');
                        background-size: cover;
                        background-position: center;
                        color: white;
                        padding: 0;
                        margin: 0;
                        box-sizing: border-box;
                    }
                    h1 {
                        color: #E68900;
                    }
                    p {
                        width: 80%;
                    }
                    .container {
                        width: 95%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: start;
                        gap: 20px;
                        height: 95%;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #E68900;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .button:hover {
                        background-color: #ff8c00;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Mauvaise nouvelle, '.$username.' ! </h1>
                    <p>Ton illustration a été consultée mais n\'a pas été approuvée par notre administrateur STARPUNK, pour la raison suivante :</p>
                    <p>'.$reason.'</p>
                    <p>Si tu souhaite en savoir plus, n\'hésite pas à nous contacter dans les 15 jours qui suivent la réception de cet e-mail (référence dossier : '.$ref.'</p>
                    <a href="http://localhost:5173/contact" class="button">Page contact</a>
                    <img src="http://localhost:8000/images-post/titre.svg" alt="titre" style="width: 50%; margin-top: 20px;">
                </div>
            </body>
        </html>';

        $email = (new Email())
            ->from('supervisor@starpunk.com')
            ->to($email)
            ->subject('Validation de ton illustration')
            ->html($htmlContent);

        $this->mailer->send($email);
    }
}
