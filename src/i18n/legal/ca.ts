import type { LegalCopy } from "@/i18n/types";

export const legalCa: LegalCopy = {
  reviewBanner:
    "Esborrany per a revisió jurídica i lingüística. No és la versió definitiva. Falten el nom legal del titular, el NIF i el domicili. No constitueix un dictamen ni una declaració de conformitat amb el RGPD o la LOPDGDD.",
  pendingLabel: "Dada o clàusula pendent — no és informació definitiva",
  updatedNote:
    "Estat: esborrany publicat per a revisió. Els terminis, les bases jurídiques i les transferències no estan confirmats. El correu de contacte operatiu és hola@adoptaunebiker.com.",
  nav: {
    menu: "Informació legal",
    notice: "Avís legal",
    privacy: "Privadesa",
    cookies: "Galetes",
    terms: "Condicions d’ús",
    settings: "Configurar galetes",
  },
  consent: {
    title: "Galetes i privadesa",
    body: "Fem servir galetes tècniques per a l’idioma i, si entres, per a la sessió. L’analítica no està activada. Pots acceptar, rebutjar el que és opcional o triar categoria.",
    acceptAll: "Acceptar-les totes",
    rejectOptional: "Rebutjar les opcionals",
    configure: "Configurar preferències",
    save: "Desar preferències",
    close: "Tancar",
    necessaryTitle: "Necessàries",
    necessaryBody:
      "Idioma, sessió i seguretat. No es poden desactivar si vols fer servir el lloc. No inclouen analítica.",
    analyticsTitle: "Analítica",
    analyticsBody:
      "Mesura de l’ús del lloc. Avui no hi ha cap eina d’analítica configurada. Si s’activa més endavant, caldrà un identificador vàlid i el teu consentiment.",
    analyticsInactive: "L’analítica no està activada ara mateix.",
    settings: "Configurar galetes",
  },
  notice: {
    metaTitle: "Avís legal | Adopta un eBiker",
    metaDescription: "Titular, contacte i condicions d’ús d’Adopta un eBiker.",
    title: "Avís legal",
    intro: [
      "Aquest avís identifica el lloc https://adoptaunebiker.com, publicat amb el nom Adopta un eBiker.",
    ],
    sections: [
      {
        title: "Titular",
        pending: true,
        paragraphs: [
          "El titular és una persona física. El nom legal, el NIF i el domicili encara no s’han publicat perquè no s’han facilitat.",
          "Fins que aquestes dades constin aquí, el canal de contacte és hola@adoptaunebiker.com.",
        ],
        items: [
          "Nom legal: [no facilitat]",
          "NIF: [no facilitat]",
          "Domicili: [no facilitat]",
          "Correu de contacte operatiu: hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Finalitat del lloc",
        paragraphs: [
          "El lloc presenta una comunitat ciclista per posar en contacte principiants i veterans, amb bicicleta elèctrica o convencional, en carretera, MTB i gravel.",
          "Permet enviar una sol·licitud d’alta i, si s’accepta, accedir a una intranet de membres. No és un servei de transport, ni una asseguradora, ni una organització d’esdeveniments de pagament.",
        ],
      },
      {
        title: "Propietat intel·lectual",
        paragraphs: [
          "Els textos, la marca Adopta un eBiker, el logotip i el disseny pertanyen al titular o es fan servir amb autorització. No els copiïs per a un altre projecte sense permís.",
          "Els perfils i els recats dels membres continuen sent seus, amb la llicència necessària per mostrar-los dins de la comunitat.",
        ],
      },
      {
        title: "Ús del lloc",
        paragraphs: [
          "L’accés públic és lliure. L’alta i la intranet són per a qui l’organització accepti. L’ús ha de ser lleial, sense suplantar ningú ni interferir en el servei.",
        ],
      },
      {
        title: "Responsabilitat",
        pending: true,
        paragraphs: [
          "El lloc facilita el contacte entre ciclistes. Les sortides les organitzen les persones que hi participen. El titular no garanteix una grupeta a cada localitat ni assumeix l’organització material de les rutes.",
          "Aquesta clàusula no pretén excloure responsabilitats que la llei no permeti limitar, especialment en cas de dol o negligència greu. Queda pendent de revisió jurídica.",
        ],
      },
      {
        title: "Legislació i contacte",
        pending: true,
        paragraphs: [
          "Per identificar el titular, exercir drets o comunicar un ús indegut, escriu a hola@adoptaunebiker.com.",
          "La llei aplicable i el fur queden pendents de confirmació jurídica. Aquí no es fixa un tribunal ni un país de manera definitiva.",
        ],
      },
    ],
  },
  privacy: {
    metaTitle: "Política de privadesa | Adopta un eBiker",
    metaDescription: "Com tracta Adopta un eBiker les dades de sol·licituds, membres i Strava.",
    title: "Política de privadesa",
    intro: [
      "Aquesta política descriu els tractaments que el codi del lloc fa avui. On un dada del titular o una base jurídica no està confirmada, s’indica com a pendent.",
    ],
    sections: [
      {
        title: "Responsable",
        pending: true,
        paragraphs: [
          "El responsable serà la persona física titular del projecte. Nom legal, NIF i domicili: [no facilitats].",
          "Contacte: hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Quines dades es recullen a l’alta",
        paragraphs: [
          "El formulari demana nom, cognoms, correu, país, ciutat, si ets veterà o principiant per modalitat, disciplines d’interès, bici, com surts i què busques, i l’idioma de la sol·licitud.",
          "Un esborrany es desa només al navegador (sessionStorage), en aquesta pestanya, fins que envies o tanques. No s’envia al servidor fins que pulses enviar.",
        ],
      },
      {
        title: "Sol·licituds, membres i autenticació",
        paragraphs: [
          "La sol·licitud es desa perquè l’organització la revisi. Si es rebutja o s’elimina, el codi no envia correu a la persona sol·licitant.",
          "Si s’accepta, es crea un compte i un perfil, i s’envia un correu operatiu amb l’accés. La primera entrada exigeix canviar la clau.",
          "L’organització pot actualitzar la fitxa, donar d’alta o de baixa, restablir la clau i deixar comentaris interns. La baixa impedeix l’accés a la intranet.",
        ],
      },
      {
        title: "Correus",
        paragraphs: [
          "Avui s’envien correus operatius: benvinguda en acceptar una sol·licitud i avís si es restableix la clau. No hi ha butlletí ni promocions actives.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connectar Strava és voluntari i només està disponible per a membres amb sessió. El lloc demana permisos de lectura de perfil i activitats.",
          "Es desen identificador d’atleta, nom, tokens d’accés i de renovació, i fins a quaranta sortides de bici.",
          "Les sortides no privades es poden veure a la fitxa del pelotó. En desconnectar se suprimeix el compte local i s’intenta revocar l’accés a Strava.",
        ],
      },
      {
        title: "Proveïdors que intervenen avui",
        paragraphs: [
          "Aquests serveis apareixen al codi o al desplegament actual. La ubicació exacta i les transferències internacionals queden pendents.",
        ],
        items: [
          "Allotjament del lloc: Vercel.",
          "Base de dades i autenticació: Supabase.",
          "Enviament de correu: Resend.",
          "Strava, només si el membre connecta el compte.",
          "Mapes de sortides: tesel·les d’OpenStreetMap a través de Leaflet, només a la intranet quan hi ha un traçat.",
        ],
      },
      {
        title: "Analítica",
        paragraphs: [
          "Google Analytics està previst, però no està configurat ni es carrega. No hi ha identificador de mesura. Si s’activa més endavant, es farà amb consentiment previ i s’actualitzarà aquesta política.",
        ],
      },
      {
        title: "Seguretat i registres",
        paragraphs: [
          "L’accés a la intranet exigeix autenticació. Els registres d’error del servidor es retallen per no deixar correus, contrasenyes ni tokens en clar.",
          "Cap registre no és una prova jurídica completa per si sol.",
        ],
      },
      {
        title: "Conservació",
        pending: true,
        paragraphs: [
          "No hi ha un termini de conservació confirmat. De manera operativa, la sol·licitud es guarda mentre es revisa; el perfil, mentre la plaça és activa; Strava, mentre la connexió no es revoqui.",
          "Els terminis legals definitius els ha de fixar el titular amb assessorament.",
        ],
      },
      {
        title: "Drets",
        paragraphs: [
          "Pots demanar accés, rectificació, supressió, oposició, limitació i portabilitat, quan escaiguin, a hola@adoptaunebiker.com.",
          "També pots reclamar davant l’autoritat de control competent. A Espanya, l’Agència Espanyola de Protecció de Dades. Aquest paràgraf no substitueix l’anàlisi de quina autoritat correspon.",
        ],
      },
      {
        title: "Menors",
        pending: true,
        paragraphs: [
          "L’edat mínima prevista per fer servir el lloc és de 18 anys. Aquesta previsió s’ha de revisar jurídicament abans de considerar-se clàusula definitiva.",
        ],
      },
      {
        title: "Matriu de tractaments (proposta, no confirmada)",
        pending: true,
        paragraphs: [
          "La taula és una proposta interna per a revisió jurídica. No fa servir una sola base per a tots els tractaments i no afirma que aquestes bases estiguin validades.",
        ],
        table: {
          caption: "Finalitats observades al codi",
          headers: ["Finalitat", "Dades", "Base proposada", "Destinataris", "Conservació", "Consentiment"],
          rows: [
            [
              "Revisar sol·licituds d’alta",
              "Identificació, contacte, zona, modalitats, text lliure",
              "Mesures precontractuals a petició de la persona",
              "Organització; Supabase; Vercel",
              "Pendent",
              "No substitueix la informació; no hi ha casella genèrica",
            ],
            [
              "Crear i gestionar la plaça",
              "Perfil, autenticació, estat d’alta o baixa",
              "Execució de la relació de comunitat",
              "Organització; Supabase; Vercel; Resend",
              "Pendent",
              "No",
            ],
            [
              "Correu operatiu d’accés o clau",
              "Nom, correu",
              "Necessari per a aquesta relació",
              "Resend",
              "Pendent",
              "No",
            ],
            [
              "Seguretat de l’accés",
              "Sessió, registres tècnics retallats",
              "Interès legítim de seguretat (pendent)",
              "Vercel; Supabase",
              "Pendent",
              "No",
            ],
            [
              "Strava opcional",
              "Tokens i activitats sincronitzades",
              "Consentiment en connectar",
              "Strava; membres que veuen sortides no privades",
              "Fins a desconnectar",
              "Sí, en autoritzar a Strava",
            ],
            [
              "Analítica futura",
              "Ús del lloc, sense definir",
              "Consentiment",
              "Pendent; no actiu",
              "No aplica avui",
              "Sí, i avui no es carrega",
            ],
          ],
        },
      },
    ],
  },
  cookies: {
    metaTitle: "Política de galetes | Adopta un eBiker",
    metaDescription: "Galetes i emmagatzematge que Adopta un eBiker fa servir de veritat.",
    title: "Política de galetes",
    intro: [
      "Aquí només es documenten tecnologies comprovades al codi. Si una durada o un nom exacte no s’ha pogut verificar, s’indica com a pendent.",
    ],
    sections: [
      {
        title: "Com triar",
        paragraphs: [
          "El bàner permet acceptar-les totes, rebutjar les opcionals o configurar. Rebutjar no és més difícil que acceptar. Les caselles opcionals no venen marcades.",
          "Pots canviar d’opinió des de Configurar galetes, al peu. Desar una preferència no és, per si sola, una prova jurídica completa.",
        ],
      },
      {
        title: "Galetes tècniques d’aquest lloc",
        paragraphs: ["Es fan servir per a l’idioma, la sessió i, si escau, el flux de Strava."],
        table: {
          caption: "Galetes de primer partit verificades al codi",
          headers: ["Nom", "Ús", "Durada al codi", "Tipus"],
          rows: [
            ["NEXT_LOCALE", "Recordar l’idioma de la ruta", "365 dies", "Tècnica / preferència d’idioma"],
            ["adopta.privacy", "Recordar si has decidit sobre l’analítica", "180 dies", "Preferència de privadesa"],
            [
              "Galetes de sessió de Supabase Auth (nom típic sb-…-auth-token, de vegades trossejat)",
              "Mantenir la sessió de membre",
              "Pendent de verificar al navegador; la fixa la llibreria d’autenticació",
              "Tècnica de sessió",
            ],
            [
              "adopta.session",
              "Sessió local de desenvolupament; en producció no concedeix accés",
              "60 dies si s’arriba a escriure",
              "Tècnica, residual",
            ],
            ["adopta.bonds", "Víncles d’adopció desats al navegador", "60 dies", "Tècnica d’intranet"],
            ["adopta.strava_oauth", "Estat temporal de l’inici de connexió amb Strava", "10 minuts", "Tècnica"],
          ],
        },
      },
      {
        title: "Emmagatzematge que no és galeta",
        paragraphs: ["No són galetes. Viuen al teu dispositiu."],
        items: [
          "sessionStorage adopta.join-form: esborrany del formulari d’alta, només en la pestanya, fins a enviar o tancar.",
          "localStorage adopta.adminNav i adopta.intranetNav: si el menú lateral és obert. Només intranet o administració.",
        ],
      },
      {
        title: "Analítica i tercers",
        paragraphs: [
          "No es carrega Google Analytics ni gtag.js. No s’han observat galetes de mesura.",
          "Si connectes Strava, surts d’aquest lloc i Strava pot fer servir les seves galetes. Si es mostra un mapa de sortida, el navegador demana tesel·les a OpenStreetMap; nosaltres no establim galetes d’OSM.",
          "Les fonts es serveixen amb next/font, autoallotjades després del build, sense petició de galetes a Google Fonts durant la visita.",
        ],
      },
      {
        title: "Què no s’esborra en rebutjar el que és opcional",
        paragraphs: [
          "Rebutjar l’analítica no tanca la sessió ni treu l’idioma. No s’esborren les galetes tècniques d’inici de sessió.",
        ],
      },
    ],
  },
  terms: {
    metaTitle: "Condicions d’ús | Adopta un eBiker",
    metaDescription: "Regles de la comunitat Adopta un eBiker.",
    title: "Condicions d’ús",
    intro: [
      "Aquestes condicions descriuen l’ús de la web pública, de les sol·licituds i de la intranet. Estan pendents de revisió jurídica.",
    ],
    sections: [
      {
        title: "Objecte",
        paragraphs: [
          "Adopta un eBiker facilita el contacte entre ciclistes. No organitza de manera centralitzada cada sortida ni ven places.",
        ],
      },
      {
        title: "Edat",
        pending: true,
        paragraphs: [
          "L’edat mínima prevista és de 18 anys. Aquesta clàusula s’ha de revisar abans de publicar-se com a definitiva.",
        ],
      },
      {
        title: "Alta i pertinença",
        paragraphs: [
          "Demanar plaça no garanteix l’acceptació. L’organització pot acceptar, rebutjar o eliminar una sol·licitud, i donar de baixa una plaça.",
          "El perfil ha de ser veraç. No et facis passar per una altra persona.",
        ],
      },
      {
        title: "Convivència i seguretat en ruta",
        paragraphs: [
          "El ritme l’acorda el grup. Ningú no es deixa enrere sense avís. L’assistència elèctrica no és motiu de menyspreu.",
          "Cada participant és responsable de la bici, l’equip i de complir les normes de circulació i del camí. El lloc no substitueix el sentit comú ni una assegurança.",
        ],
      },
      {
        title: "Contingut dels usuaris",
        paragraphs: [
          "Els textos de la fitxa i els recats han de respectar la resta de persones. L’organització pot moderar o retirar contingut i, si escau, donar de baixa la plaça.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connectar Strava és opcional. En fer-ho, també acceptes les condicions de Strava. Pots desconnectar el compte des de La teva plaça.",
        ],
      },
      {
        title: "Baixa",
        paragraphs: [
          "Pots demanar la baixa escrivint a hola@adoptaunebiker.com. L’organització pot inactivar una plaça si s’incompleixen aquestes regles.",
        ],
      },
      {
        title: "Limitació de responsabilitat",
        pending: true,
        paragraphs: [
          "No s’exclouen els drets que la llei considera irrenunciables. No es pretén eximir de dol ni de negligència greu.",
          "El titular no respon de les sortides que les persones organitzin entre elles més enllà del que imposi la llei aplicable, encara per determinar.",
        ],
      },
    ],
  },
};
