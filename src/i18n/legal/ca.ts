import type { LegalCopy } from "@/i18n/types";

export const legalCa: LegalCopy = {
  reviewBanner:
    "Esborrany per a revisió jurídica i lingüística. No és la versió definitiva. S’hi han incorporat el nom, el NIF i el domicili facilitats. Aquest text no constitueix un dictamen ni una declaració de conformitat amb el RGPD o la LOPDGDD.",
  pendingLabel: "Dada o clàusula pendent — no és informació definitiva",
  updatedNote:
    "Estat: esborrany actualitzat amb les dades identificatives del titular. Encara falta la revisió jurídica de bases, terminis i transferències. Els terminis de sis mesos són un criteri previst, no un esborrat automàtic ja implementat. El correu de contacte operatiu és hola@adoptaunebiker.com.",
  nav: {
    menu: "Informació legal",
    notice: "Avís legal",
    privacy: "Privadesa",
    cookies: "Galetes",
    terms: "Condicions d’ús",
    settings: "Configurar galetes",
    backHome: "Tornar a l’inici",
  },
  consent: {
    title: "Galetes i privadesa",
    body: "Fem servir galetes tècniques per a l’idioma i, si entres, per a la sessió. Si acceptes l’analítica, es carrega Google Tag Manager. Pots acceptar, rebutjar el que és opcional o triar categoria.",
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
      "Mesura de l’ús del lloc amb Google Tag Manager (GTM-MX2JCJFR). Només es carrega si dones consentiment. Llavors s’executen les etiquetes d’aquest contenidor.",
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
        paragraphs: [
          "El titular del lloc és una persona física. No es publica raó social, inscripció registral ni telèfon perquè no s’han facilitat.",
        ],
        items: [
          "Nom i cognoms: JUAN JOSE MENA CASANOCA.",
          "NIF: 46754258L.",
          "Domicili: Bajada de Gomis número 1, 08023 Barcelona, Espanya.",
          "Correu de contacte: hola@adoptaunebiker.com.",
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
          "Els textos, la marca Adopta un eBiker, el logotip i el disseny del lloc pertanyen al titular o s’usen amb autorització. No els pots copiar per a un altre projecte sense permís.",
          "Els perfils, recats i dades que publiquen els membres continuen sent seus, amb la llicència necessària per mostrar-los dins de la comunitat.",
        ],
      },
      {
        title: "Ús del lloc",
        paragraphs: [
          "L’accés públic és lliure. L’alta i la intranet estan reservats a qui l’organització accepti. L’ús ha de ser lleial, sense suplantar ningú ni interferir en el servei.",
        ],
      },
      {
        title: "Responsabilitat",
        pending: true,
        paragraphs: [
          "El lloc s’ofereix per facilitar el contacte entre ciclistes. Les sortides s’organitzen entre les persones que hi participen. El titular no garanteix que hi hagi grupeta a cada localitat ni assumeix l’organització material de les rutes.",
          "Aquesta clàusula no pretén excloure responsabilitats que la llei no permeti limitar, en particular en cas de dol o negligència greu. Queda pendent de revisió jurídica.",
        ],
      },
      {
        title: "Legislació i contacte",
        pending: true,
        paragraphs: [
          "Per identificar-te com a titular, exercir drets o comunicar un ús indegut, escriu a hola@adoptaunebiker.com.",
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
      "Aquesta política descriu els tractaments que el codi del lloc fa avui. On una dada, una base jurídica o un termini no està confirmat, s’indica com a pendent. Publicar aquesta política no equival a afirmar que el RGPD o la LOPDGDD es compleixen íntegrament.",
    ],
    sections: [
      {
        title: "Responsable",
        paragraphs: [
          "El responsable del tractament és JUAN JOSE MENA CASANOCA, persona física, NIF 46754258L.",
          "Domicili: Bajada de Gomis número 1, 08023 Barcelona, Espanya.",
          "Contacte: hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Quines dades es recullen a l’alta",
        paragraphs: [
          "El formulari de sol·licitud demana: nom, cognoms, correu, país, ciutat, si ets veterà o principiant per modalitat, disciplines d’interès, bici, com surts i què busques, i idioma de la sol·licitud.",
          "Un esborrany es desa només al navegador (sessionStorage), en aquesta pestanya, fins que envies o tanques. No s’envia al servidor fins que pulses enviar.",
        ],
      },
      {
        title: "Sol·licituds, membres i autenticació",
        paragraphs: [
          "La sol·licitud es desa perquè l’organització la revisi. Si es rebutja o s’elimina, el codi no envia correu a la persona sol·licitant. La fila de la sol·licitud roman a la base de dades fins a un esborrat manual.",
          "Si s’accepta, es crea un compte i un perfil, i s’envia un correu operatiu amb l’accés. La sol·licitud acceptada no s’esborra: queda marcada com a acceptada. La primera entrada exigeix canviar la clau.",
          "L’organització pot actualitzar la fitxa, donar d’alta o de baixa, restablir la clau i deixar comentaris interns de gestió. La baixa inactiva la plaça i impedeix l’accés a la intranet; no elimina per si sola el perfil.",
        ],
      },
      {
        title: "Correus",
        paragraphs: [
          "Avui s’envien només correus operatius: benvinguda en acceptar una sol·licitud i avís si es restableix la clau. Aquests missatges són necessaris per gestionar sol·licituds, comptes i el funcionament de la comunitat.",
          "No hi ha butlletí, newsletter ni promocions comercials. No es demana consentiment per a màrqueting perquè aquesta finalitat no està activa. Si en el futur s’ofereix un butlletí, es revisarà aquesta política i el mecanisme de consentiment.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connectar Strava és voluntari i opcional, i només està disponible per a membres amb sessió. El lloc demana permisos de lectura de perfil i activitats. Aquesta autorització d’accés es concedeix a Strava; no és, per si sola, la base jurídica del tractament posterior de les dades a Adopta un eBiker.",
          "Es desen identificador d’atleta, nom, tokens d’accés i de renovació, i fins a quaranta sortides de bici (nom, tipus, distància, desnivell, temps, data, traçat resumit, enllaç i si és privada).",
          "Les sortides no privades es poden veure a la fitxa del pelotó. En desconnectar s’esborra el compte local i les activitats desades, i s’intenta revocar l’accés a Strava.",
        ],
      },
      {
        title: "Proveïdors que hi intervenen avui",
        pending: true,
        paragraphs: [
          "Els serveis següents apareixen al codi o al desplegament actual. Cadascun intervé per a una finalitat diferent i no tots tracten les mateixes dades. La ubicació exacta, l’encàrrec de tractament i les transferències internacionals s’han de confirmar amb els seus contractes i amb la configuració real del projecte.",
        ],
        items: [
          "Allotjament del lloc: Vercel. Pot tractar dades tècniques de la visita (per exemple, adreça IP i registres de petició) per servir les pàgines.",
          "Base de dades i autenticació: Supabase. Desa sol·licituds, perfils, notes internes, comptes de Strava i la sessió de membres.",
          "Enviament de correu operatiu: Resend. Reb el correu i el nom quan s’accepta una sol·licitud o es restableix la clau.",
          "Strava, només si el membre connecta el compte. Reb l’autorització d’accés i pot tractar dades de l’atleta segons les seves condicions.",
          "Mapes de sortides: tesel·les d’OpenStreetMap a través de Leaflet, només a la intranet quan hi ha un traçat per mostrar. El navegador demana les tesel·les al prestador del mapa; aquest lloc no els envia la teva fitxa de membre.",
        ],
      },
      {
        title: "Analítica",
        paragraphs: [
          "Si acceptes la categoria d’analítica, es carrega el contenidor de Google Tag Manager GTM-MX2JCJFR. Sense aquest consentiment no s’insereix ni l’script ni l’iframe de Google Tag Manager.",
          "Aquest codi no enumera les etiquetes concretes configurades dins del contenidor. Qui administra GTM decideix què es dispara. Les galetes que posi Google depenen d’aquestes etiquetes; els noms i les durades no estan verificats aquí.",
        ],
      },
      {
        title: "Seguretat i registres",
        paragraphs: [
          "L’accés a la intranet exigeix autenticació. Els registres d’error del servidor es retallen per no deixar correus, contrasenyes ni tokens en clar.",
          "Aquests registres tècnics es distingeixen de les dades operatives de sol·licituds i perfils, i de les còpies de seguretat que pugui fer el proveïdor de base de dades. Cap registre d’aquest codi no és una prova jurídica completa per si sol.",
        ],
      },
      {
        title: "Conservació",
        pending: true,
        paragraphs: [
          "La intenció del titular és no conservar sol·licituds ni dades personals més de sis mesos quan això sigui compatible amb la finalitat i amb les obligacions aplicables.",
          "Aquest termini de sis mesos no s’aplica a les dades indispensables per mantenir un compte actiu, prestar el servei o atendre una obligació o reclamació. El codi aplica aquestes regles: una tasca setmanal llista els candidats. El primer cicle és de simulació fins que es confirmi un esborrat. Les files ja rebutjades o inactives comencen el termini en aplicar la migració, no en l’alta.",
          "La taula següent descriu el que fa el codi. No afirma que ja s’hagi executat un esborrat massiu irreversible.",
        ],
        table: {
          caption: "Conservació per categoria — regles del codi",
          headers: ["Categoria", "Què passa avui", "Criteri proposat", "Esdeveniment que inicia el termini", "Esborrat automàtic"],
          rows: [
            [
              "Sol·licituds rebutjades",
              "La fila roman. El rebuig es data a rejected_at",
              "Sis mesos des del rebuig",
              "Data en què la sol·licitud es marca com a rebutjada (rejected_at)",
              "Sí, si no hi ha hold i la tasca setmanal confirma l’esborrat",
            ],
            [
              "Sol·licituds abandonades",
              "No hi ha una categoria «abandonada». Una sol·licitud pendent roman",
              "No es classifica com a abandonament. Es conserva fins a una decisió humana",
              "No aplica. Sense regla operativa verificable d’abandonament",
              "No. Les pendents no s’esborren",
            ],
            [
              "Sol·licituds pendents de resolució",
              "Es conserven per revisar-les",
              "Mentre es tramiten. Si no hi ha resolució, el termini de sis mesos proposat",
              "Enviament de la sol·licitud o darrera actuació de l’organització",
              "No",
            ],
            [
              "Sol·licituds acceptades",
              "La fila es marca com a acceptada. Les dades útils es copien al perfil",
              "Mentre existeixi la plaça, la sol·licitud pot conservar el text original. En eliminar la plaça inactiva, o si queda òrfena més de sis mesos, s’anonimitza. La fila queda com a constància sense dades de contacte, excepte hold",
              "Acceptació de la sol·licitud. L’anonimització segueix la baixa del membre o l’orfandat",
              "No s’esborra la fila. S’anonimitza quan cau el membre o queda òrfena",
            ],
            [
              "Membres amb compte actiu",
              "Perfil, autenticació i, si escau, notes internes",
              "Mentre la plaça estigui activa i sigui necessari prestar el servei. No s’aplica el termini de sis mesos",
              "Alta de la plaça. El termini d’eliminació no comença mentre el compte estigui actiu",
              "No. Esborrar aquestes dades impediria el servei",
            ],
            [
              "Comptes donats de baixa",
              "El perfil roman amb estat inactiu; es bloqueja l’accés",
              "Sis mesos des de la baixa, si no hi ha obligació o reclamació en curs",
              "Canvi a inactiu (deactivated_at). No s’usa created_at",
              "Sí, si no hi ha hold i la tasca setmanal confirma l’esborrat",
            ],
            [
              "Dades de connexió i activitats de Strava",
              "Es desen mentre la connexió està activa",
              "Mentre el membre mantingui la connexió. En desconnectar s’esborren en aquest lloc",
              "Connexió o desconnexió pel membre",
              "Sí en desconnectar: s’eliminen el compte local i les activitats i s’intenta revocar l’accés a Strava. No hi ha caducitat per mesos",
            ],
            [
              "Registres tècnics i de seguretat",
              "Registres d’error retallats al servidor o a l’allotjament",
              "El temps mínim necessari per diagnosticar i protegir el servei. Pendent de fixar",
              "Cada incidència o petició",
              "No ho controla aquest codi",
            ],
            [
              "Còpies de seguretat",
              "Fora d’aquest codi; depenen del proveïdor de base de dades o de l’allotjament",
              "Pendent de confirmar amb el proveïdor. Poden sobreviure a un esborrat operatiu",
              "Cicle de còpies del proveïdor",
              "No ho controla aquesta aplicació",
            ],
            [
              "Obligacions legals o reclamacions",
              "Es pot marcar retention_hold a la sol·licitud o al perfil. L’usuari no el pot treure",
              "El temps necessari per a aquesta obligació o reclamació, encara que superi sis mesos",
              "Fet que origina l’obligació o la reclamació",
              "No es promet l’esborrat als sis mesos",
            ],
          ],
        },
      },
      {
        title: "Com s’apliquen els sis mesos",
        pending: true,
        paragraphs: [
          "El codi distingeix sol·licituds rebutjades, pendents i acceptades, i no esborra comptes actius ni administradors. Una tasca setmanal llista els candidats. Un esborrat real exigeix confirmació a l’API i a l’SQL. El primer cicle no esborra en massa sense revisar el llistat.",
          "Les còpies de seguretat del proveïdor poden sobreviure a l’esborrat operatiu. Un hold legal atura tant l’esborrat com l’anonimització.",
        ],
      },
      {
        title: "Drets",
        paragraphs: [
          "Pots demanar accés, rectificació, supressió, oposició, limitació i portabilitat, si escau, a hola@adoptaunebiker.com.",
          "També pots reclamar davant l’autoritat de control competent. A Espanya, l’Agència Espanyola de Protecció de Dades. Aquest paràgraf no substitueix l’anàlisi de quina autoritat correspon en cada cas.",
        ],
      },
      {
        title: "Menors",
        pending: true,
        paragraphs: [
          "L’edat mínima prevista per fer servir el lloc és de 18 anys. El formulari no comprova l’edat. Aquesta previsió s’ha de revisar jurídicament abans de considerar-se clàusula definitiva.",
        ],
      },
      {
        title: "Matriu de tractaments (proposta, no confirmada)",
        pending: true,
        paragraphs: [
          "La taula següent és una proposta per a revisió jurídica. No fa servir una sola base per a tots els tractaments. No afirma que aquestes bases estiguin validades ni que el model de la comunitat sigui, en tots els casos, un contracte.",
        ],
        table: {
          caption: "Finalitats observades al codi",
          headers: [
            "Finalitat",
            "Base proposada",
            "Justificació",
            "Què s’informa",
            "Decisió jurídica pendent",
          ],
          rows: [
            [
              "Gestionar sol·licituds d’ingrés",
              "Mesures precontractuals a petició de la persona",
              "La persona envia el formulari perquè s’examini l’alta. Sense aquestes dades no es pot valorar la sol·licitud",
              "Responsable, finalitat, que no hi ha màrqueting, i enllaç a aquesta política",
              "Confirmar que la sol·licitud d’alta es pot tractar com a mesura precontractual i no com a consentiment genèric",
            ],
            [
              "Prestar el servei i gestionar comptes actius",
              "Execució de la relació amb el membre i mesures necessàries per prestar el servei",
              "Després de l’acceptació calen perfil, autenticació i estat de la plaça per fer servir la intranet",
              "Que la plaça implica un compte, fitxa visible a la intranet i correus operatius",
              "Confirmar si aquesta relació és un contracte de l’article 6.1.b del RGPD o una altra base, segons el model real del servei",
            ],
            [
              "Correus operatius d’accés o clau",
              "Necessaris per a aquesta mateixa relació",
              "Sense el correu de benvinguda o de restabliment no es pot lliurar o recuperar l’accés. No són promocions",
              "Que només s’envien missatges operatius i que no hi ha butlletí",
              "Confirmar que no s’exigeix un consentiment de màrqueting per a aquests enviaments",
            ],
            [
              "Seguretat, prevenció d’abús i protecció de comptes",
              "Interès legítim, pendent de documentar",
              "Finalitat: protegir l’accés. Necessitat: sessió autenticada i registres d’error retallats. Ponderació: s’espera seguretat; no s’usen per a màrqueting; els registres es retallen",
              "Que hi ha sessió i registres tècnics limitats",
              "Redactar i conservar l’anàlisi d’interès legítim. Confirmar terminis d’aquests registres",
            ],
            [
              "Obligacions fiscals, comptables o altres obligacions legals",
              "Obligació legal, només si resulta pertinent",
              "El lloc no factura altes ni ven places. Aquesta base no es dona per activa",
              "Només es mencionarà si existeix una obligació concreta",
              "Confirmar si hi ha alguna obligació legal real que imposi conservar dades",
            ],
            [
              "Strava opcional",
              "Proposta: consentiment per al tractament en aquest lloc en connectar, distinta de l’autorització d’accés a Strava",
              "La connexió és voluntària. Strava concedeix l’accés; Adopta un eBiker tracta després tokens i activitats per mostrar-les a la intranet",
              "Que és opcional, quins permisos es demanen, què es desa, qui veu les sortides no privades i com desconnectar",
              "Confirmar si la base és el consentiment, l’execució d’una funció opcional del servei, o totes dues, i el règim de Strava com a destinatari",
            ],
            [
              "Analítica (Google Tag Manager)",
              "Consentiment",
              "Es carrega GTM-MX2JCJFR només si la categoria d’analítica està acceptada",
              "Que l’script no es carrega si es rebutja o abans de decidir",
              "Revisar les etiquetes del contenidor i si alguna implica publicitat o una altra finalitat",
            ],
          ],
        },
      },
    ],
  },
  cookies: {
    metaTitle: "Política de galetes | Adopta un eBiker",
    metaDescription: "Galetes i emmagatzematge que Adopta un eBiker fa servir de debò.",
    title: "Política de galetes",
    intro: [
      "Aquí només es documenten tecnologies comprovades al codi. Si una dada de durada o de nom exacte no s’ha pogut verificar, s’indica com a pendent.",
    ],
    sections: [
      {
        title: "Com triar",
        paragraphs: [
          "El bàner permet acceptar-les totes, rebutjar les opcionals o configurar. Rebutjar no és més difícil que acceptar. Les caselles opcionals no vénen marcades.",
          "Pots canviar d’opinió des de Configurar galetes, al peu. Desar una preferència no és, per si sola, una prova jurídica completa.",
        ],
      },
      {
        title: "Galetes tècniques d’aquest lloc",
        paragraphs: ["Es fan servir per a idioma, sessió i, si escau, el flux de Strava."],
        table: {
          caption: "Galetes de primer partit verificades al codi",
          headers: ["Nom", "Ús", "Durada al codi", "Tipus"],
          rows: [
            ["NEXT_LOCALE", "Recordar l’idioma de la ruta", "365 dies", "Tècnica / preferència d’idioma"],
            [
              "adopta.privacy",
              "Recordar si has decidit sobre l’analítica",
              "180 dies",
              "Preferència de privadesa",
            ],
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
            [
              "adopta.bonds",
              "Vincles d’adopció desats al navegador",
              "60 dies",
              "Tècnica d’intranet",
            ],
            [
              "adopta.strava_oauth",
              "Estat temporal de l’inici de connexió amb Strava",
              "10 minuts",
              "Tècnica",
            ],
          ],
        },
      },
      {
        title: "Emmagatzematge que no és galeta",
        paragraphs: ["No són galetes. Viuen al teu dispositiu."],
        items: [
          "sessionStorage adopta.join-form: esborrany del formulari d’alta, només a la pestanya, fins a enviar o tancar.",
          "localStorage adopta.adminNav i adopta.intranetNav: si el menú lateral és obert. Només intranet o administració.",
        ],
      },
      {
        title: "Analítica i tercers",
        paragraphs: [
          "Amb consentiment d’analítica es carrega https://www.googletagmanager.com/gtm.js i, si no hi ha JavaScript, l’iframe ns.html del contenidor GTM-MX2JCJFR. Google pot establir galetes pròpies segons les etiquetes del contenidor; aquestes galetes de tercer no estan llistades aquí perquè no s’han observat en aquest codi. Sense consentiment no es demana googletagmanager.com.",
          "Si connectes Strava, surts d’aquest lloc i Strava pot fer servir les seves pròpies galetes. Si es mostra un mapa de sortida, el navegador demana tesel·les a OpenStreetMap; no establim galetes d’OSM.",
          "Les fonts es serveixen amb next/font, autoallotjades després del build, sense petició de galetes a Google Fonts en la visita.",
        ],
      },
      {
        title: "Què no s’esborra en rebutjar el que és opcional",
        paragraphs: [
          "Rebutjar l’analítica no tanca la sessió ni treu l’idioma. No s’esborren les galetes tècniques de login.",
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
          "Cada participant és responsable de la bici, l’equip i de complir les normes de circulació i del camí. El lloc no substitueix el sentit comú ni una assegurança. El titular no assumeix l’organització material de les rutes ni garanteix una grupeta a cada localitat.",
        ],
      },
      {
        title: "Contingut dels usuaris",
        paragraphs: [
          "Els textos de la fitxa i els recats han de respectar les altres persones. L’organització pot moderar o retirar contingut i, si escau, donar de baixa la plaça.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connectar Strava és opcional. En fer-ho, també acceptes les condicions de Strava. Pots desconnectar el compte des de La teva plaça. En desconnectar s’esborren les dades de Strava desades en aquest lloc i s’intenta revocar l’accés.",
        ],
      },
      {
        title: "Baixa",
        paragraphs: [
          "Pots demanar la baixa escrivint a hola@adoptaunebiker.com. L’organització pot inactivar una plaça si s’incompleixen aquestes regles. Inactivar la plaça bloqueja l’accés; no implica per si sola l’esborrat immediat de totes les dades.",
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
