import React from 'react';
import '../styles.js';
import { Link } from 'react-router-dom';

function MentionsLegales() {
  return (
    <>
    <div className="legals-container">
      <h1 className="legals-title">Mentions Légales</h1>
      <div className="mentions-content">
        <div className="legals-scroll">
          <p className="legals">
          <p className="legals">
            <strong>Éditeur du site</strong><br />
            [Nom de la société]<br />
            [Forme juridique] au capital de [montant] euros<br />
            [Adresse]<br />
            [Code postal] [Ville]<br />
            Téléphone : [numéro]<br />
            Email : [adresse email]<br />
            <br />
            <strong>Directeur de la publication</strong> : [Nom]<br />
            <br />
            <strong>Hébergeur</strong><br />
            [Nom de l'hébergeur]<br />
            [Adresse]<br />
            [Code postal] [Ville]<br />
            Téléphone : [numéro]<br />
            <br />
            <strong>Données personnelles</strong><br />
            Les informations recueillies font l'objet d'un traitement informatique destiné à [finalité]. Le destinataire des données est : [destinataire]. Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée, vous bénéficiez d'un droit d'accès et de rectification aux informations qui vous concernent. Si vous souhaitez exercer ce droit et obtenir communication des informations vous concernant, veuillez vous adresser à [service concerné et adresse].
            <br />
            <br />
            <strong>Cookies</strong><br />
            Lors de la consultation de notre site, des cookies sont déposés sur votre ordinateur, votre mobile ou votre tablette. Un cookie est un fichier texte déposé sur votre terminal lors de la visite d'un site ou de la consultation d'une publicité. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal.
            Le site Internet [url du site] utilise des cookies permettant [finalités].
            Vous avez la possibilité d'accepter ou de refuser les cookies en modifiant les paramètres de votre navigateur. Pour plus d'information, consultez la page [lien vers la page d'information sur les cookies].
            <br />
            <br />
            <strong>Propriété intellectuelle</strong><br />
            L'ensemble du contenu du site Internet [url du site], incluant textes, images, vidéos, graphismes, logos, icônes, sons, etc., est la propriété de la société [nom de la société], protégée par le droit d'auteur conformément au Code de la propriété intellectuelle. Toute représentation, reproduction, adaptation ou exploitation partielle ou totale des contenus, sans l'accord préalable et écrit de [nom de la société] est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            <br />
            <br />
            <strong>Loi applicable et juridiction compétente</strong><br />
            Les présentes mentions légales sont soumises à la loi française. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
            <br />
            <br />
          </p>
          </p>
        </div>
      </div>
    </div>
    <div className="scroll-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" fill="none" width="40" height="50">
          <path d="M12 2C6.47715 2 2 6.47715 2 12V18C2 23.5228 6.47715 28 12 28C17.5228 28 22 23.5228 22 18V12C22 6.47715 17.5228 2 12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path className="scroll-wheel" d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <animateTransform attributeName="transform"
              attributeType="XML"
              type="translate"
              from="0 0"
              to="0 8"
              dur="1s"
              repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    <Link to="/planete">
    <div className="return">
      Retour au site
    </div>
  </Link>
  </>
  );
}

export default MentionsLegales;