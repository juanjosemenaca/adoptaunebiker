import type { LegalCopy } from "@/i18n/types";

export const legalFr: LegalCopy = {
  reviewBanner:
    "Brouillon pour relecture juridique et linguistique. Ce n’est pas la version définitive. Le nom, le NIF et le domicile fournis ont été ajoutés. Ce texte n’est pas un avis juridique ni une déclaration de conformité au RGPD ou à la LOPDGDD.",
  pendingLabel: "Élément en attente — information non définitive",
  updatedNote:
    "État : brouillon mis à jour avec les données d’identification du titulaire. La relecture juridique des bases, durées et transferts reste à faire. Les délais de six mois sont un critère prévu, pas une suppression automatique déjà en place. Le courriel de contact opérationnel est hola@adoptaunebiker.com.",
  nav: {
    menu: "Informations légales",
    notice: "Mentions légales",
    privacy: "Confidentialité",
    cookies: "Cookies",
    terms: "Conditions d’utilisation",
    settings: "Configurer les cookies",
    backHome: "Retour à l’accueil",
  },
  consent: {
    title: "Cookies et confidentialité",
    body: "Nous utilisons des cookies techniques pour la langue et, si tu te connectes, pour la session. L’analytique n’est pas activée. Tu peux accepter, refuser l’optionnel ou choisir une catégorie.",
    acceptAll: "Tout accepter",
    rejectOptional: "Refuser les optionnels",
    configure: "Configurer les préférences",
    save: "Enregistrer les préférences",
    close: "Fermer",
    necessaryTitle: "Nécessaires",
    necessaryBody:
      "Langue, session et sécurité. Ils ne peuvent pas être désactivés si tu veux utiliser le site. Ils n’incluent pas l’analytique.",
    analyticsTitle: "Analytique",
    analyticsBody:
      "Mesure de l’usage du site. Aucun outil d’analytique n’est configuré aujourd’hui. S’il est activé plus tard, il faudra un identifiant valide et ton consentement.",
    analyticsInactive: "L’analytique n’est pas activée pour le moment.",
    settings: "Configurer les cookies",
  },
  notice: {
    metaTitle: "Mentions légales | Adopta un eBiker",
    metaDescription: "Titulaire, contact et conditions d’utilisation d’Adopta un eBiker.",
    title: "Mentions légales",
    intro: [
      "Ces mentions identifient le site https://adoptaunebiker.com, publié sous le nom Adopta un eBiker.",
    ],
    sections: [
      {
        title: "Titulaire",
        paragraphs: [
          "Le titulaire du site est une personne physique. Aucune raison sociale, inscription au registre ni téléphone n’est publié, car ils n’ont pas été fournis.",
        ],
        items: [
          "Nom et prénoms : JUAN JOSE MENA CASANOCA.",
          "NIF : 46754258L.",
          "Domicile : Bajada de Gomis número 1, 08023 Barcelona, Espagne.",
          "Courriel de contact : hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Objet du site",
        paragraphs: [
          "Le site présente une communauté cycliste pour mettre en relation débutants et vétérans, à vélo électrique ou conventionnel, sur route, VTT et gravel.",
          "Il permet d’envoyer une demande d’inscription et, si elle est acceptée, d’accéder à un intranet de membres. Ce n’est pas un service de transport, un assureur, ni un organisateur d’événements payants.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "Les textes, la marque Adopta un eBiker, le logo et le design du site appartiennent au titulaire ou sont utilisés avec autorisation. Tu ne peux pas les copier pour un autre projet sans permission.",
          "Les profils, messages et données publiés par les membres restent les leurs, avec la licence nécessaire pour les afficher dans la communauté.",
        ],
      },
      {
        title: "Usage du site",
        paragraphs: [
          "L’accès public est libre. L’inscription et l’intranet sont réservés aux personnes acceptées par l’organisation. L’usage doit être loyal, sans usurpation ni interférence avec le service.",
        ],
      },
      {
        title: "Responsabilité",
        pending: true,
        paragraphs: [
          "Le site sert à faciliter le contact entre cyclistes. Les sorties sont organisées par les personnes qui y participent. Le titulaire ne garantit pas un groupe dans chaque localité et n’assume pas l’organisation matérielle des routes.",
          "Cette clause ne vise pas à exclure des responsabilités que la loi n’autorise pas à limiter, notamment en cas de dol ou de négligence grave. Elle reste à relire juridiquement.",
        ],
      },
      {
        title: "Droit applicable et contact",
        pending: true,
        paragraphs: [
          "Pour identifier le titulaire, exercer des droits ou signaler un usage abusif, écris à hola@adoptaunebiker.com.",
          "La loi applicable et le for restent à confirmer juridiquement. Aucun tribunal ni pays n’est fixé ici de façon définitive.",
        ],
      },
    ],
  },
  privacy: {
    metaTitle: "Politique de confidentialité | Adopta un eBiker",
    metaDescription: "Comment Adopta un eBiker traite les données des demandes, des membres et de Strava.",
    title: "Politique de confidentialité",
    intro: [
      "Cette politique décrit les traitements que le code du site réalise aujourd’hui. Lorsqu’une donnée, une base juridique ou une durée n’est pas confirmée, elle est indiquée comme en attente. Publier cette politique ne signifie pas que le RGPD ou la LOPDGDD sont pleinement respectés.",
    ],
    sections: [
      {
        title: "Responsable",
        paragraphs: [
          "Le responsable du traitement est JUAN JOSE MENA CASANOCA, personne physique, NIF 46754258L.",
          "Domicile : Bajada de Gomis número 1, 08023 Barcelona, Espagne.",
          "Contact : hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Quelles données sont collectées à l’inscription",
        paragraphs: [
          "Le formulaire de demande demande : prénom, nom, courriel, pays, ville, si tu es vétéran ou débutant par discipline, disciplines d’intérêt, vélo, comment tu roules et ce que tu cherches, et la langue de la demande.",
          "Un brouillon est stocké uniquement dans ton navigateur (sessionStorage), dans cet onglet, jusqu’à l’envoi ou la fermeture. Rien n’est envoyé au serveur avant que tu appuies sur envoyer.",
        ],
      },
      {
        title: "Demandes, membres et authentification",
        paragraphs: [
          "La demande est enregistrée pour que l’organisation la examine. Si elle est refusée ou supprimée, le code n’envoie pas de courriel à la personne. La ligne de la demande reste dans la base jusqu’à une suppression manuelle.",
          "Si elle est acceptée, un compte et un profil sont créés, et un courriel opérationnel est envoyé avec l’accès. La demande acceptée n’est pas effacée : elle est marquée comme acceptée. La première connexion exige de changer le mot de passe.",
          "L’organisation peut mettre à jour la fiche, activer ou désactiver une place, réinitialiser le mot de passe et laisser des notes internes. La désactivation rend la place inactive et bloque l’accès à l’intranet ; elle n’efface pas à elle seule le profil.",
        ],
      },
      {
        title: "Courriels",
        paragraphs: [
          "Aujourd’hui, seuls des courriels opérationnels sont envoyés : bienvenue à l’acceptation d’une demande et avis en cas de réinitialisation du mot de passe. Ces messages sont nécessaires pour gérer les demandes, les comptes et le fonctionnement de la communauté.",
          "Il n’y a ni newsletter ni promotions commerciales. Aucun consentement marketing n’est demandé, car cette finalité n’est pas active. Si une newsletter est proposée plus tard, cette politique et le mécanisme de consentement seront revus.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecter Strava est volontaire et optionnel, et n’est disponible que pour les membres connectés. Le site demande des droits de lecture du profil et des activités. Cette autorisation d’accès est donnée sur Strava ; elle n’est pas, à elle seule, la base juridique du traitement ultérieur de ces données sur Adopta un eBiker.",
          "Sont enregistrés l’identifiant d’athlète, le nom, les jetons d’accès et de renouvellement, et jusqu’à quarante sorties à vélo (nom, type, distance, dénivelé, temps, date, tracé résumé, lien et caractère privé).",
          "Les sorties non privées peuvent être vues sur la fiche du peloton. En se déconnectant, le compte local et les activités enregistrées sont effacés, et une révocation de l’accès est tentée auprès de Strava.",
        ],
      },
      {
        title: "Prestataires qui interviennent aujourd’hui",
        pending: true,
        paragraphs: [
          "Les services suivants apparaissent dans le code ou dans le déploiement actuel. Chacun intervient pour une finalité distincte et tous ne traitent pas les mêmes données. L’emplacement exact, le contrat de traitement et les transferts internationaux doivent être confirmés avec leurs contrats et la configuration réelle du projet.",
        ],
        items: [
          "Hébergement du site : Vercel. Il peut traiter des données techniques de la visite (par exemple adresse IP et journaux de requête) pour servir les pages.",
          "Base de données et authentification : Supabase. Il stocke les demandes, profils, notes internes, comptes Strava et la session des membres.",
          "Envoi de courriel opérationnel : Resend. Il reçoit le courriel et le nom lorsqu’une demande est acceptée ou qu’un mot de passe est réinitialisé.",
          "Strava, seulement si le membre connecte le compte. Il reçoit l’autorisation d’accès et peut traiter des données de l’athlète selon ses propres conditions.",
          "Cartes de sorties : tuiles OpenStreetMap via Leaflet, seulement dans l’intranet lorsqu’un tracé doit être affiché. Le navigateur demande les tuiles au prestataire de carte ; ce site ne leur envoie pas ta fiche de membre.",
        ],
      },
      {
        title: "Analytique",
        paragraphs: [
          "Google Analytics est prévu pour plus tard, mais n’est ni configuré ni chargé. Il n’y a pas d’identifiant de mesure. Accepter les cookies n’active pas l’analytique tant que cet identifiant n’existe pas.",
          "S’il est activé plus tard, un consentement préalable sera demandé lorsque c’est nécessaire et cette politique sera mise à jour. Aucun traitement analytique n’est actif aujourd’hui.",
        ],
      },
      {
        title: "Sécurité et journaux",
        paragraphs: [
          "L’accès à l’intranet exige une authentification. Les journaux d’erreur du serveur sont raccourcis pour ne pas laisser de courriels, mots de passe ni jetons en clair.",
          "Ces journaux techniques se distinguent des données opérationnelles des demandes et profils, et des sauvegardes que le prestataire de base de données peut faire. Aucun journal de ce code n’est à lui seul une preuve juridique complète.",
        ],
      },
      {
        title: "Conservation",
        pending: true,
        paragraphs: [
          "L’intention du titulaire est de ne pas conserver les demandes ni les données personnelles plus de six mois lorsque cela est compatible avec la finalité et les obligations applicables.",
          "Ce délai de six mois ne s’applique pas aux données indispensables pour maintenir un compte actif, fournir le service ou traiter une obligation ou une réclamation. Le code applique ces règles : une tâche hebdomadaire liste les candidats. Le premier cycle est une simulation jusqu’à confirmation d’une suppression. Les lignes déjà refusées ou inactives commencent le délai à l’application de la migration, pas à la création.",
          "Le tableau suivant décrit ce que fait le code. Il n’affirme pas qu’une suppression massive irréversible a déjà eu lieu.",
        ],
        table: {
          caption: "Conservation par catégorie — règles du code",
          headers: ["Catégorie", "Ce qui se passe aujourd’hui", "Critère proposé", "Événement qui ouvre le délai", "Suppression automatique"],
          rows: [
            [
              "Demandes refusées",
              "La ligne reste. Le refus est daté dans rejected_at",
              "Six mois à compter du refus",
              "Date à laquelle la demande est marquée comme refusée (rejected_at)",
              "Oui, s’il n’y a pas de hold et que la tâche hebdomadaire confirme la suppression",
            ],
            [
              "Demandes abandonnées",
              "Il n’existe pas de catégorie « abandonnée ». Une demande en attente reste",
              "Elle n’est pas classée comme abandonnée. Elle est conservée jusqu’à une décision humaine",
              "Sans objet. Pas de règle opérationnelle vérifiable d’abandon",
              "Non. Les demandes en attente ne sont pas supprimées",
            ],
            [
              "Demandes en attente de décision",
              "Elles sont conservées pour être examinées",
              "Pendant leur traitement. S’il n’y a pas de décision, le délai de six mois proposé",
              "Envoi de la demande ou dernière action de l’organisation",
              "Non",
            ],
            [
              "Demandes acceptées",
              "La ligne est marquée comme acceptée. Les données utiles sont copiées dans le profil",
              "Tant que la place existe, la demande peut garder le texte d’origine. Quand la place inactive est supprimée, ou si la demande reste orpheline plus de six mois, les champs personnels sont anonymisés. La ligne reste comme trace sans données de contact, sauf hold",
              "Acceptation de la demande. L’anonymisation suit la fermeture du membre ou le statut orphelin",
              "La ligne n’est pas supprimée. Elle est anonymisée quand le membre est purgé ou que la demande est orpheline",
            ],
            [
              "Membres avec un compte actif",
              "Profil, authentification et, le cas échéant, notes internes",
              "Tant que la place est active et que le service a besoin de ces données. Le délai de six mois ne s’applique pas",
              "Création de la place. Le délai de suppression ne commence pas tant que le compte est actif",
              "Non. Supprimer ces données empêcherait le service",
            ],
            [
              "Comptes désactivés",
              "Le profil reste inactif ; l’accès est bloqué",
              "Six mois à compter de la désactivation, sauf obligation ou réclamation en cours",
              "Passage à inactif (deactivated_at). created_at n’est pas utilisé",
              "Oui, s’il n’y a pas de hold et que la tâche hebdomadaire confirme la suppression",
            ],
            [
              "Données de connexion et activités Strava",
              "Conservées tant que la connexion est active",
              "Tant que le membre maintient la connexion. La déconnexion les efface sur ce site",
              "Connexion ou déconnexion par le membre",
              "Oui à la déconnexion : le compte local et les activités sont supprimés et une révocation est tentée auprès de Strava. Pas de péremption par mois",
            ],
            [
              "Journaux techniques et de sécurité",
              "Journaux d’erreur raccourcis sur le serveur ou l’hébergement",
              "Le temps minimal nécessaire pour diagnostiquer et protéger le service. Encore à fixer",
              "Chaque incident ou requête",
              "Non contrôlé par ce code",
            ],
            [
              "Sauvegardes",
              "Hors de ce code ; elles dépendent du prestataire de base de données ou d’hébergement",
              "À confirmer avec le prestataire. Elles peuvent survivre à une suppression opérationnelle",
              "Cycle de sauvegarde du prestataire",
              "Non contrôlé par cette application",
            ],
            [
              "Obligations légales ou réclamations",
              "retention_hold peut être posé sur la demande ou le profil. L’utilisateur ne peut pas l’enlever",
              "Le temps nécessaire à cette obligation ou réclamation, même au-delà de six mois",
              "Fait qui donne naissance à l’obligation ou à la réclamation",
              "La suppression à six mois n’est pas promise",
            ],
          ],
        },
      },
      {
        title: "Comment les six mois s’appliquent",
        pending: true,
        paragraphs: [
          "Le code distingue les demandes refusées, en attente et acceptées, et ne supprime pas les comptes actifs ni les administrateurs. Une tâche hebdomadaire liste les candidats. Une suppression réelle exige une confirmation dans l’API et en SQL. Le premier cycle ne supprime pas en masse sans revoir cette liste.",
          "Les sauvegardes du prestataire peuvent survivre à la suppression opérationnelle. Un hold légal arrête la suppression et l’anonymisation.",
        ],
      },
      {
        title: "Droits",
        paragraphs: [
          "Tu peux demander l’accès, la rectification, l’effacement, l’opposition, la limitation et la portabilité, lorsqu’ils s’appliquent, à hola@adoptaunebiker.com.",
          "Tu peux aussi saisir l’autorité de contrôle compétente. En Espagne, l’Agencia Española de Protección de Datos. Ce paragraphe ne remplace pas l’analyse de l’autorité applicable dans chaque cas.",
        ],
      },
      {
        title: "Mineurs",
        pending: true,
        paragraphs: [
          "L’âge minimal prévu pour utiliser le site est de 18 ans. Le formulaire ne vérifie pas l’âge. Cette prévision doit être relue juridiquement avant d’être considérée comme une clause définitive.",
        ],
      },
      {
        title: "Matrice des traitements (proposition, non confirmée)",
        pending: true,
        paragraphs: [
          "Le tableau suivant est une proposition pour relecture juridique. Il n’utilise pas une seule base pour tous les traitements. Il n’affirme pas que ces bases sont validées, ni que le modèle de la communauté est un contrat dans tous les cas.",
        ],
        table: {
          caption: "Finalités observées dans le code",
          headers: [
            "Finalité",
            "Base proposée",
            "Justification",
            "Ce qui est indiqué à la personne",
            "Décision juridique en attente",
          ],
          rows: [
            [
              "Gérer les demandes d’inscription",
              "Mesures précontractuelles à la demande de la personne",
              "La personne envoie le formulaire pour que sa demande soit examinée. Sans ces données, la demande ne peut pas être évaluée",
              "Responsable, finalité, absence de marketing, et lien vers cette politique",
              "Confirmer que la demande d’inscription peut être traitée comme une mesure précontractuelle et non comme un consentement générique",
            ],
            [
              "Fournir le service et gérer les comptes actifs",
              "Exécution de la relation avec le membre et mesures nécessaires pour fournir le service",
              "Après acceptation, un profil, une authentification et un état de la place sont nécessaires pour utiliser l’intranet",
              "Qu’une place implique un compte, une fiche visible dans l’intranet et des courriels opérationnels",
              "Confirmer si cette relation est un contrat de l’article 6.1.b du RGPD ou une autre base, selon le fonctionnement réel du service",
            ],
            [
              "Courriels opérationnels d’accès ou de mot de passe",
              "Nécessaires à cette même relation",
              "Sans le courriel de bienvenue ou de réinitialisation, l’accès ne peut pas être remis ou récupéré. Ce ne sont pas des promotions",
              "Que seuls des messages opérationnels sont envoyés et qu’il n’y a pas de newsletter",
              "Confirmer qu’aucun consentement marketing n’est exigé pour ces envois",
            ],
            [
              "Sécurité, prévention des abus et protection des comptes",
              "Intérêt légitime, encore à documenter",
              "Finalité : protéger l’accès. Nécessité : session authentifiée et journaux d’erreur raccourcis. Pondération : la sécurité est attendue ; ils ne servent pas au marketing ; les journaux sont raccourcis",
              "Qu’il existe une session et des journaux techniques limités",
              "Rédiger et conserver l’analyse d’intérêt légitime. Confirmer la durée de ces journaux",
            ],
            [
              "Obligations fiscales, comptables ou autres obligations légales",
              "Obligation légale, seulement si elle est pertinente",
              "Le site ne facture pas les inscriptions et ne vend pas de places. Cette base n’est pas considérée comme active",
              "Elle ne sera mentionnée que s’il existe une obligation concrète",
              "Confirmer s’il existe une obligation légale réelle imposant de conserver des données",
            ],
            [
              "Strava optionnel",
              "Proposition : consentement pour le traitement sur ce site lors de la connexion, distinct de l’autorisation d’accès sur Strava",
              "La connexion est volontaire. Strava accorde l’accès ; Adopta un eBiker traite ensuite jetons et activités pour les afficher dans l’intranet",
              "Que c’est optionnel, quels droits sont demandés, ce qui est stocké, qui voit les sorties non privées et comment se déconnecter",
              "Confirmer si la base est le consentement, l’exécution d’une fonction optionnelle du service, ou les deux, et le régime de Strava comme destinataire",
            ],
            [
              "Analytique future (éteinte aujourd’hui)",
              "Consentement, lorsqu’elle sera activée et nécessaire",
              "Il n’y a aujourd’hui ni identifiant ni script. Accepter les cookies ne charge pas l’analytique",
              "Que l’analytique n’est pas active et que, si elle est allumée, un consentement préalable sera demandé",
              "Ne pas l’activer ni la documenter comme un traitement réel tant que l’outil n’existe pas",
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
      "Seules les technologies vérifiées dans le code sont documentées ici. Si une durée ou un nom exact n’a pas pu être vérifié, cela est indiqué comme en attente.",
    ],
    sections: [
      {
        title: "Comment choisir",
        paragraphs: [
          "La bannière permet d’accepter tout, de refuser l’optionnel ou de configurer. Refuser n’est pas plus difficile qu’accepter. Les cases optionnelles ne sont pas précochées.",
          "Tu peux changer d’avis depuis Configurer les cookies, dans le pied de page. Enregistrer une préférence n’est pas, à elle seule, une preuve juridique complète.",
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
            [
              "adopta.privacy",
              "Mémoriser si tu as décidé au sujet de l’analytique",
              "180 jours",
              "Préférence de confidentialité",
            ],
            [
              "Cookies de session Supabase Auth (nom typique sb-…-auth-token, parfois découpé)",
              "Maintenir la session du membre",
              "À vérifier dans le navigateur ; fixé par la bibliothèque d’authentification",
              "Technique de session",
            ],
            [
              "adopta.session",
              "Session locale de développement ; en production, elle ne donne pas accès",
              "60 jours si elle est écrite",
              "Technique, résiduelle",
            ],
            [
              "adopta.bonds",
              "Liens d’adoption stockés dans le navigateur",
              "60 jours",
              "Technique d’intranet",
            ],
            [
              "adopta.strava_oauth",
              "État temporaire du début de connexion à Strava",
              "10 minutes",
              "Technique",
            ],
          ],
        },
      },
      {
        title: "Stockage qui n’est pas un cookie",
        paragraphs: ["Ce ne sont pas des cookies. Ils vivent sur ton appareil."],
        items: [
          "sessionStorage adopta.join-form : brouillon du formulaire d’inscription, seulement dans l’onglet, jusqu’à l’envoi ou la fermeture.",
          "localStorage adopta.adminNav et adopta.intranetNav : si le menu latéral est ouvert. Intranet ou administration seulement.",
        ],
      },
      {
        title: "Analytique et tiers",
        paragraphs: [
          "Google Analytics et gtag.js ne sont pas chargés. Aucun cookie de mesure n’a été observé. Tout accepter ne charge pas l’analytique s’il n’y a pas d’identifiant de mesure valide.",
          "Si tu connectes Strava, tu quittes ce site et Strava peut utiliser ses propres cookies. Si une carte de sortie est affichée, le navigateur demande des tuiles à OpenStreetMap ; nous n’établissons pas de cookies OSM.",
          "Les polices sont servies avec next/font, auto-hébergées après le build, sans requête de cookies vers Google Fonts pendant la visite.",
        ],
      },
      {
        title: "Ce que le refus de l’optionnel n’efface pas",
        paragraphs: [
          "Refuser l’analytique ne ferme pas ta session et n’enlève pas la langue. Les cookies techniques de connexion ne sont pas effacés.",
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
          "L’âge minimal prévu est de 18 ans. Cette clause doit être relue avant d’être publiée comme définitive.",
        ],
      },
      {
        title: "Inscription et appartenance",
        paragraphs: [
          "Demander une place ne garantit pas l’acceptation. L’organisation peut accepter, refuser ou supprimer une demande, et désactiver une place.",
          "Le profil doit être sincère. Ne te fais pas passer pour une autre personne.",
        ],
      },
      {
        title: "Convivialité et sécurité sur la route",
        paragraphs: [
          "Le rythme est convenu par le groupe. Personne n’est laissé derrière sans avis. L’assistance électrique n’est pas un motif de mépris.",
          "Chaque participant est responsable de son vélo, de son équipement et du respect des règles de circulation et du chemin. Le site ne remplace ni le bon sens ni une assurance. Le titulaire n’assume pas l’organisation matérielle des routes et ne garantit pas un groupe dans chaque localité.",
        ],
      },
      {
        title: "Contenu des utilisateurs",
        paragraphs: [
          "Les textes de la fiche et les messages doivent respecter les autres personnes. L’organisation peut modérer ou retirer du contenu et, le cas échéant, désactiver la place.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecter Strava est optionnel. En le faisant, tu acceptes aussi les conditions de Strava. Tu peux te déconnecter depuis Ta place. La déconnexion efface les données Strava stockées sur ce site et tente de révoquer l’accès.",
        ],
      },
      {
        title: "Départ",
        paragraphs: [
          "Tu peux demander la désactivation en écrivant à hola@adoptaunebiker.com. L’organisation peut inactiver une place en cas de manquement. Inactiver la place bloque l’accès ; cela n’implique pas à elle seule l’effacement immédiat de toutes les données.",
        ],
      },
      {
        title: "Limitation de responsabilité",
        pending: true,
        paragraphs: [
          "Les droits que la loi considère comme irrenonçables ne sont pas exclus. Il ne s’agit pas d’exonérer le dol ni la négligence grave.",
          "Le titulaire ne répond pas des sorties que les personnes organisent entre elles au-delà de ce qu’impose la loi applicable, encore à déterminer.",
        ],
      },
    ],
  },
};
