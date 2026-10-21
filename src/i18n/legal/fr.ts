import type { LegalCopy } from "@/i18n/types";

export const legalFr: LegalCopy = {
  reviewBanner:
    "Brouillon pour relecture juridique et linguistique. Ce n’est pas la version définitive. Le nom légal du titulaire, le NIF et le domicile manquent encore. Ce texte n’est pas un avis juridique ni une déclaration de conformité au RGPD ou à la LOPDGDD.",
  pendingLabel: "Élément en attente — information non définitive",
  updatedNote:
    "État : brouillon publié pour relecture. Les durées de conservation, bases juridiques et transferts ne sont pas confirmés. Le courriel de contact opérationnel est hola@adoptaunebiker.com.",
  nav: {
    menu: "Informations légales",
    notice: "Mentions légales",
    privacy: "Confidentialité",
    cookies: "Cookies",
    terms: "Conditions d’utilisation",
    settings: "Paramétrer les cookies",
  },
  consent: {
    title: "Cookies et confidentialité",
    body: "Nous utilisons des cookies techniques pour la langue et, si tu te connectes, pour la session. L’analytique n’est pas activée. Tu peux tout accepter, refuser l’optionnel ou choisir une catégorie.",
    acceptAll: "Tout accepter",
    rejectOptional: "Refuser les optionnels",
    configure: "Paramétrer les préférences",
    save: "Enregistrer les préférences",
    close: "Fermer",
    necessaryTitle: "Nécessaires",
    necessaryBody:
      "Langue, session et sécurité. Elles ne peuvent pas être désactivées si tu veux utiliser le site. Elles n’incluent pas l’analytique.",
    analyticsTitle: "Analytique",
    analyticsBody:
      "Mesure de l’usage du site. Aucun outil d’analytique n’est configuré aujourd’hui. S’il est activé plus tard, il faudra un identifiant valide et ton consentement.",
    analyticsInactive: "L’analytique n’est pas activée pour le moment.",
    settings: "Paramétrer les cookies",
  },
  notice: {
    metaTitle: "Mentions légales | Adopta un eBiker",
    metaDescription: "Titulaire, contact et conditions d’Adopta un eBiker.",
    title: "Mentions légales",
    intro: [
      "Ces mentions identifient le site https://adoptaunebiker.com, publié sous le nom Adopta un eBiker.",
    ],
    sections: [
      {
        title: "Titulaire",
        pending: true,
        paragraphs: [
          "Le titulaire est une personne physique. Le nom légal, le NIF et le domicile ne sont pas encore publiés, car ils n’ont pas été fournis.",
          "Tant que ces données n’apparaissent pas ici, le canal de contact est hola@adoptaunebiker.com.",
        ],
        items: [
          "Nom légal : [non fourni]",
          "NIF : [non fourni]",
          "Domicile : [non fourni]",
          "Courriel de contact opérationnel : hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Objet du site",
        paragraphs: [
          "Le site présente une communauté cycliste pour mettre en relation débutant·es et vétéran·es, en vélo électrique ou classique, sur route, VTT et gravel.",
          "Il permet d’envoyer une demande d’inscription et, si elle est acceptée, d’accéder à une intranet. Ce n’est pas un service de transport, un assureur ni un organisateur d’événements payants.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "Les textes, la marque Adopta un eBiker, le logo et le design appartiennent au titulaire ou sont utilisés avec autorisation. Tu ne peux pas les copier pour un autre projet sans permission.",
          "Les profils et messages des membres restent les leurs, avec la licence nécessaire pour les afficher dans la communauté.",
        ],
      },
      {
        title: "Usage du site",
        paragraphs: [
          "L’accès public est libre. L’inscription et l’intranet sont réservés aux personnes acceptées. L’usage doit être loyal, sans usurpation ni interférence.",
        ],
      },
      {
        title: "Responsabilité",
        pending: true,
        paragraphs: [
          "Le site aide les cyclistes à se rencontrer. Les sorties sont organisées par les personnes qui y participent. Le titulaire ne garantit pas un groupe dans chaque ville et n’organise pas matériellement les itinéraires.",
          "Cette clause ne vise pas à exclure des responsabilités que la loi n’autorise pas à limiter, notamment en cas de dol ou de négligence grave. Elle reste à relire juridiquement.",
        ],
      },
      {
        title: "Droit et contact",
        pending: true,
        paragraphs: [
          "Pour identifier le titulaire, exercer tes droits ou signaler un usage abusif, écris à hola@adoptaunebiker.com.",
          "La loi applicable et le for restent à confirmer. Aucun tribunal ni pays n’est fixé ici de manière définitive.",
        ],
      },
    ],
  },
  privacy: {
    metaTitle: "Politique de confidentialité | Adopta un eBiker",
    metaDescription: "Comment Adopta un eBiker traite les demandes, les membres et Strava.",
    title: "Politique de confidentialité",
    intro: [
      "Cette politique décrit les traitements que le code du site réalise aujourd’hui. Lorsqu’une donnée du titulaire ou une base juridique n’est pas confirmée, elle est indiquée comme en attente.",
    ],
    sections: [
      {
        title: "Responsable",
        pending: true,
        paragraphs: [
          "Le responsable sera la personne physique titulaire du projet. Nom légal, NIF et domicile : [non fournis].",
          "Contact : hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Données collectées à l’inscription",
        paragraphs: [
          "Le formulaire demande prénom, nom, courriel, pays, ville, si tu es vétéran·e ou débutant·e par discipline, intérêts, vélo, façon de rouler, recherche, et la langue de la demande.",
          "Un brouillon est stocké uniquement dans ton navigateur (sessionStorage), dans cet onglet, jusqu’à l’envoi ou la fermeture. Rien n’est envoyé au serveur avant d’appuyer sur envoyer.",
        ],
      },
      {
        title: "Demandes, membres et authentification",
        paragraphs: [
          "La demande est enregistrée pour que l’organisation la relise. Si elle est refusée ou supprimée, le code n’envoie pas de courriel à la personne.",
          "Si elle est acceptée, un compte et un profil sont créés, et un courriel opérationnel d’accès est envoyé. La première connexion impose de changer le mot de passe.",
          "L’organisation peut mettre à jour la fiche, activer ou désactiver une place, réinitialiser le mot de passe et laisser des notes internes. La désactivation bloque l’intranet.",
        ],
      },
      {
        title: "Courriels",
        paragraphs: [
          "Aujourd’hui, seuls des courriels opérationnels sont envoyés : bienvenue à l’acceptation, et avis en cas de réinitialisation du mot de passe. Il n’y a pas de lettre d’information ni de promotions.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecter Strava est volontaire et réservé aux membres connectés. Le site demande la lecture du profil et des activités.",
          "Sont stockés l’identifiant d’athlète, le nom, les jetons d’accès et de renouvellement, et jusqu’à quarante sorties vélo.",
          "Les sorties non privées peuvent apparaître sur la fiche du peloton. La déconnexion efface le compte local et tente de révoquer l’accès chez Strava.",
        ],
      },
      {
        title: "Prestataires utilisés aujourd’hui",
        paragraphs: [
          "Ces services apparaissent dans le code ou l’hébergement actuel. Le lieu exact et les transferts internationaux restent à confirmer.",
        ],
        items: [
          "Hébergement du site : Vercel.",
          "Base de données et authentification : Supabase.",
          "Envoi de courriel : Resend.",
          "Strava, seulement si le membre connecte le compte.",
          "Cartes de sorties : tuiles OpenStreetMap via Leaflet, uniquement dans l’intranet lorsqu’un tracé est affiché.",
        ],
      },
      {
        title: "Analytique",
        paragraphs: [
          "Google Analytics est prévu, mais n’est ni configuré ni chargé. Il n’y a pas d’identifiant de mesure. S’il est activé plus tard, ce sera avec un consentement préalable et cette politique sera mise à jour.",
        ],
      },
      {
        title: "Sécurité et journaux",
        paragraphs: [
          "L’accès à l’intranet exige une authentification. Les journaux d’erreur du serveur sont tronqués pour ne pas laisser courriels, mots de passe ni jetons en clair.",
          "Aucun journal n’est à lui seul une preuve juridique complète.",
        ],
      },
      {
        title: "Conservation",
        pending: true,
        paragraphs: [
          "Aucun délai de conservation n’est confirmé. En pratique, la demande est gardée le temps de l’examen ; le profil, tant que la place est active ; Strava, tant que la connexion n’est pas révoquée.",
          "Les délais légaux définitifs doivent être fixés par le titulaire avec un conseil.",
        ],
      },
      {
        title: "Droits",
        paragraphs: [
          "Tu peux demander l’accès, la rectification, l’effacement, l’opposition, la limitation et la portabilité, lorsqu’ils s’appliquent, à hola@adoptaunebiker.com.",
          "Tu peux aussi saisir une autorité de contrôle compétente. En Espagne, l’Agencia Española de Protección de Datos. Ce paragraphe ne remplace pas l’analyse de l’autorité applicable.",
        ],
      },
      {
        title: "Mineur·es",
        pending: true,
        paragraphs: [
          "L’âge minimum prévu pour utiliser le site est de 18 ans. Cette prévision doit être relue juridiquement avant d’être une clause définitive.",
        ],
      },
      {
        title: "Matrice des traitements (proposition, non confirmée)",
        pending: true,
        paragraphs: [
          "Le tableau est une proposition interne pour relecture juridique. Il n’utilise pas une seule base pour tous les traitements et n’affirme pas que ces bases sont validées.",
        ],
        table: {
          caption: "Finalités observées dans le code",
          headers: ["Finalité", "Données", "Base proposée", "Destinataires", "Conservation", "Consentement"],
          rows: [
            [
              "Examiner les demandes",
              "Identité, contact, zone, disciplines, texte libre",
              "Mesures précontractuelles à la demande de la personne",
              "Organisation ; Supabase ; Vercel",
              "En attente",
              "Ne remplace pas l’information ; pas de case générique",
            ],
            [
              "Créer et gérer la place",
              "Profil, authentification, statut actif ou inactif",
              "Exécution de la relation de communauté",
              "Organisation ; Supabase ; Vercel ; Resend",
              "En attente",
              "Non",
            ],
            [
              "Courriel opérationnel d’accès ou de mot de passe",
              "Nom, courriel",
              "Nécessaire à cette relation",
              "Resend",
              "En attente",
              "Non",
            ],
            [
              "Sécurité de l’accès",
              "Session, journaux techniques tronqués",
              "Intérêt légitime de sécurité (en attente)",
              "Vercel ; Supabase",
              "En attente",
              "Non",
            ],
            [
              "Strava optionnel",
              "Jetons et activités synchronisées",
              "Consentement lors de la connexion",
              "Strava ; membres qui voient les sorties non privées",
              "Jusqu’à la déconnexion",
              "Oui, en autorisant sur Strava",
            ],
            [
              "Analytique future",
              "Usage du site, non défini",
              "Consentement",
              "En attente ; non actif",
              "Sans objet aujourd’hui",
              "Oui, et rien n’est chargé aujourd’hui",
            ],
          ],
        },
      },
    ],
  },
  cookies: {
    metaTitle: "Politique de cookies | Adopta un eBiker",
    metaDescription: "Cookies et stockage réellement utilisés par Adopta un eBiker.",
    title: "Politique de cookies",
    intro: [
      "Seules les technologies vérifiées dans le code sont listées. Durée ou nom exact non vérifiable : indiqué comme en attente.",
    ],
    sections: [
      {
        title: "Comment choisir",
        paragraphs: [
          "La bannière permet d’accepter, de refuser l’optionnel ou de paramétrer. Refuser n’est pas plus difficile qu’accepter. Les cases optionnelles ne sont pas précochées.",
          "Tu peux changer d’avis depuis Paramétrer les cookies, dans le pied de page. Enregistrer une préférence n’est pas, à elle seule, une preuve juridique complète.",
        ],
      },
      {
        title: "Cookies techniques de ce site",
        paragraphs: ["Ils servent à la langue, à la session et, le cas échéant, au flux Strava."],
        table: {
          caption: "Cookies first-party vérifiés dans le code",
          headers: ["Nom", "Usage", "Durée dans le code", "Type"],
          rows: [
            ["NEXT_LOCALE", "Mémoriser la langue de l’itinéraire", "365 jours", "Technique / préférence de langue"],
            ["adopta.privacy", "Mémoriser ta décision sur l’analytique", "180 jours", "Préférence de confidentialité"],
            [
              "Cookies de session Supabase Auth (nom typique sb-…-auth-token, parfois découpé)",
              "Maintenir la session membre",
              "À vérifier dans le navigateur ; fixé par la bibliothèque d’authentification",
              "Technique de session",
            ],
            [
              "adopta.session",
              "Session locale de développement ; n’accorde pas l’accès en production",
              "60 jours si elle est écrite",
              "Technique, résiduelle",
            ],
            ["adopta.bonds", "Liens d’adoption stockés dans le navigateur", "60 jours", "Technique d’intranet"],
            ["adopta.strava_oauth", "État temporaire du démarrage de connexion Strava", "10 minutes", "Technique"],
          ],
        },
      },
      {
        title: "Stockage qui n’est pas un cookie",
        paragraphs: ["Ce ne sont pas des cookies. Ils restent sur ton appareil."],
        items: [
          "sessionStorage adopta.join-form : brouillon du formulaire d’inscription, onglet seulement, jusqu’à l’envoi ou la fermeture.",
          "localStorage adopta.adminNav et adopta.intranetNav : menu latéral ouvert ou non. Intranet ou administration seulement.",
        ],
      },
      {
        title: "Analytique et tiers",
        paragraphs: [
          "Google Analytics et gtag.js ne sont pas chargés. Aucun cookie de mesure n’a été observé.",
          "Si tu connectes Strava, tu quittes ce site et Strava peut utiliser ses propres cookies. Si une carte de sortie s’affiche, le navigateur demande des tuiles à OpenStreetMap ; nous ne déposons pas de cookies OSM.",
          "Les polices sont servies avec next/font, auto-hébergées après le build, sans requête de cookies vers Google Fonts pendant la visite.",
        ],
      },
      {
        title: "Ce que le refus de l’optionnel ne supprime pas",
        paragraphs: [
          "Refuser l’analytique ne te déconnecte pas et ne retire pas la langue. Les cookies techniques de connexion sont conservés.",
        ],
      },
    ],
  },
  terms: {
    metaTitle: "Conditions d’utilisation | Adopta un eBiker",
    metaDescription: "Règles de la communauté Adopta un eBiker.",
    title: "Conditions d’utilisation",
    intro: [
      "Ces conditions décrivent l’usage du site public, des demandes et de l’intranet. Elles restent à relire juridiquement.",
    ],
    sections: [
      {
        title: "Objet",
        paragraphs: [
          "Adopta un eBiker facilite le contact entre cyclistes. Il n’organise pas de façon centralisée chaque sortie et ne vend pas de places.",
        ],
      },
      {
        title: "Âge",
        pending: true,
        paragraphs: [
          "L’âge minimum prévu est de 18 ans. Cette clause doit être relue avant d’être publiée comme définitive.",
        ],
      },
      {
        title: "Inscription et appartenance",
        paragraphs: [
          "Demander une place ne garantit pas l’acceptation. L’organisation peut accepter, refuser ou supprimer une demande, et désactiver une place.",
          "Le profil doit être sincère. Tu ne dois pas usurper l’identité d’une autre personne.",
        ],
      },
      {
        title: "Convivialité et sécurité en route",
        paragraphs: [
          "Le rythme est convenu par le groupe. Personne n’est laissé sans prévenir. L’assistance électrique n’est pas un motif de mépris.",
          "Chaque participant·e est responsable de son vélo, de son équipement et du respect des règles de circulation. Le site ne remplace ni le bon sens ni une assurance.",
        ],
      },
      {
        title: "Contenu des utilisateurs",
        paragraphs: [
          "Les textes de fiche et les messages doivent respecter les autres. L’organisation peut modérer ou retirer du contenu et, le cas échéant, désactiver la place.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecter Strava est optionnel. En le faisant, tu acceptes aussi les conditions de Strava. Tu peux déconnecter le compte depuis Ta place.",
        ],
      },
      {
        title: "Départ",
        paragraphs: [
          "Tu peux demander la désactivation en écrivant à hola@adoptaunebiker.com. L’organisation peut inactiver une place en cas de manquement.",
        ],
      },
      {
        title: "Limitation de responsabilité",
        pending: true,
        paragraphs: [
          "Les droits que la loi considère comme irrenonçables ne sont pas exclus. Il n’est pas question d’exonérer le dol ni la négligence grave.",
          "Le titulaire n’est pas responsable des sorties que les personnes organisent entre elles au-delà de ce qu’impose la loi applicable, encore à déterminer.",
        ],
      },
    ],
  },
};
