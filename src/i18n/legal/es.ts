import type { LegalCopy } from "@/i18n/types";

export const legalEs: LegalCopy = {
  reviewBanner:
    "Borrador para revisión jurídica y lingüística. No es la versión definitiva. Faltan el nombre legal del titular, el NIF y el domicilio. No constituye un dictamen ni una declaración de conformidad con el RGPD o la LOPDGDD.",
  pendingLabel: "Dato o cláusula pendiente — no es información definitiva",
  updatedNote:
    "Estado: borrador publicado para revisión. Los plazos, bases jurídicas y transferencias no están confirmados. El correo de contacto operativo es hola@adoptaunebiker.com.",
  nav: {
    menu: "Información legal",
    notice: "Aviso legal",
    privacy: "Privacidad",
    cookies: "Cookies",
    terms: "Condiciones de uso",
    settings: "Configurar cookies",
  },
  consent: {
    title: "Cookies y privacidad",
    body: "Usamos cookies técnicas para el idioma y, si entras, para la sesión. La analítica no está activada. Puedes aceptar, rechazar lo opcional o elegir categoría.",
    acceptAll: "Aceptar todas",
    rejectOptional: "Rechazar las opcionales",
    configure: "Configurar preferencias",
    save: "Guardar preferencias",
    close: "Cerrar",
    necessaryTitle: "Necesarias",
    necessaryBody:
      "Idioma, sesión y seguridad. No se pueden desactivar si quieres usar el sitio. No incluyen analítica.",
    analyticsTitle: "Analítica",
    analyticsBody:
      "Medición de uso del sitio. Hoy no hay ninguna herramienta de analítica configurada. Si más adelante se activa, hará falta un identificador válido y tu consentimiento.",
    analyticsInactive: "La analítica no está activada en este momento.",
    settings: "Configurar cookies",
  },
  notice: {
    metaTitle: "Aviso legal | Adopta un eBiker",
    metaDescription: "Titular, contacto y condiciones de uso de Adopta un eBiker.",
    title: "Aviso legal",
    intro: [
      "Este aviso identifica el sitio https://adoptaunebiker.com, publicado bajo el nombre Adopta un eBiker.",
    ],
    sections: [
      {
        title: "Titular",
        pending: true,
        paragraphs: [
          "El titular es una persona física. El nombre legal, el NIF y el domicilio todavía no están publicados porque no han sido facilitados.",
          "Hasta que esos datos consten aquí, el canal de contacto es el correo hola@adoptaunebiker.com.",
        ],
        items: [
          "Nombre legal: [no facilitado]",
          "NIF: [no facilitado]",
          "Domicilio: [no facilitado]",
          "Correo de contacto operativo: hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Finalidad del sitio",
        paragraphs: [
          "El sitio presenta una comunidad ciclista para poner en contacto a principiantes y veteranos, con bicicleta eléctrica o convencional, en carretera, MTB y gravel.",
          "Permite enviar una solicitud de alta, y, si se acepta, acceder a una intranet de miembros. No es un servicio de transporte, ni una aseguradora, ni una organización de eventos con inscripción de pago.",
        ],
      },
      {
        title: "Propiedad intelectual",
        paragraphs: [
          "Los textos, la marca Adopta un eBiker, el logotipo y el diseño del sitio pertenecen al titular o se usan con autorización. No puedes copiarlos para otro proyecto sin permiso.",
          "Los perfiles, recados y datos que publican los miembros siguen siendo suyos, con la licencia necesaria para mostrarlos dentro de la comunidad.",
        ],
      },
      {
        title: "Uso del sitio",
        paragraphs: [
          "El acceso público es libre. El alta y la intranet están reservados a quienes la organización acepte. El uso debe ser leal, sin suplantar a nadie ni interferir en el servicio.",
        ],
      },
      {
        title: "Responsabilidad",
        pending: true,
        paragraphs: [
          "El sitio se ofrece para facilitar el contacto entre ciclistas. Las salidas se organizan entre las personas que participan. El titular no garantiza que haya grupeta en cada localidad ni asume la organización material de las rutas.",
          "Esta cláusula no pretende excluir responsabilidades que la ley no permita limitar, en particular en caso de dolo o negligencia grave. Queda pendiente de revisión jurídica.",
        ],
      },
      {
        title: "Legislación y contacto",
        pending: true,
        paragraphs: [
          "Para identificarte como titular, ejercer derechos o comunicar un uso indebido, escribe a hola@adoptaunebiker.com.",
          "La ley aplicable y el fuero quedan pendientes de confirmación jurídica. No se fija aquí un tribunal ni un país de forma definitiva.",
        ],
      },
    ],
  },
  privacy: {
    metaTitle: "Política de privacidad | Adopta un eBiker",
    metaDescription: "Cómo trata Adopta un eBiker los datos de solicitudes, miembros y Strava.",
    title: "Política de privacidad",
    intro: [
      "Esta política describe los tratamientos que el código del sitio realiza hoy. Donde un dato del titular o una base jurídica no está confirmado, se indica como pendiente.",
    ],
    sections: [
      {
        title: "Responsable",
        pending: true,
        paragraphs: [
          "El responsable será la persona física titular del proyecto. Nombre legal, NIF y domicilio: [no facilitados].",
          "Contacto operativo mientras se completan esos datos: hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Qué datos se recogen en el alta",
        paragraphs: [
          "El formulario de solicitud pide: nombre, apellidos, correo, país, ciudad, si eres veterano o principiante por modalidad, disciplinas de interés, bici, cómo sales y qué buscas, e idioma de la solicitud.",
          "Un borrador se guarda solo en tu navegador (sessionStorage), en esta pestaña, hasta que envías o cierras. No se envía al servidor hasta pulsar enviar.",
        ],
      },
      {
        title: "Solicitudes, miembros y autenticación",
        paragraphs: [
          "La solicitud se guarda para que la organización la revise. Si se rechaza o se elimina, el código no envía correo a la persona solicitante.",
          "Si se acepta, se crea una cuenta y un perfil, y se envía un correo operativo con el acceso. La primera entrada exige cambiar la clave.",
          "La organización puede actualizar la ficha, dar de alta o de baja, restablecer la clave y dejar comentarios internos de gestión. La baja impide el acceso a la intranet.",
        ],
      },
      {
        title: "Correos",
        paragraphs: [
          "Hoy se envían correos operativos: bienvenida al aceptar una solicitud y aviso si se restablece la clave. No hay boletín ni promociones activas.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Conectar Strava es voluntario y solo está disponible para miembros con sesión. El sitio pide permisos de lectura de perfil y actividades.",
          "Se guardan identificador de atleta, nombre, tokens de acceso y de renovación, y hasta cuarenta salidas de bici (nombre, tipo, distancia, desnivel, tiempo, fecha, trazado resumido, enlace y si es privada).",
          "Las salidas no privadas pueden verse en la ficha del pelotón. Al desconectar se borra la cuenta local y se intenta revocar el acceso en Strava.",
        ],
      },
      {
        title: "Proveedores que intervienen hoy",
        paragraphs: [
          "Los siguientes servicios aparecen en el código o en el despliegue actual. No se afirma aquí su ubicación exacta ni el régimen de transferencias internacionales: eso queda pendiente.",
        ],
        items: [
          "Alojamiento del sitio: Vercel.",
          "Base de datos y autenticación: Supabase.",
          "Envío de correo: Resend.",
          "Strava, solo si el miembro conecta la cuenta.",
          "Mapas de salidas: teselas de OpenStreetMap a través de Leaflet, solo en la intranet cuando hay un trazado que mostrar.",
        ],
      },
      {
        title: "Analítica",
        paragraphs: [
          "Google Analytics está previsto, pero no está configurado ni se carga. No hay identificador de medición. Si se activa más adelante, se hará con consentimiento previo y se actualizará esta política.",
        ],
      },
      {
        title: "Seguridad y registros",
        paragraphs: [
          "El acceso a la intranet exige autenticación. Los registros de error del servidor se recortan para no dejar correos, contraseñas ni tokens en claro.",
          "Ningún registro es una prueba jurídica completa por sí solo.",
        ],
      },
      {
        title: "Conservación",
        pending: true,
        paragraphs: [
          "No hay un plazo de conservación confirmado. De forma operativa, la solicitud se guarda mientras se revisa; el perfil, mientras la plaza está activa; Strava, mientras la conexión no se revoca.",
          "Los plazos legales definitivos deben fijarlos el titular con asesoramiento.",
        ],
      },
      {
        title: "Derechos",
        paragraphs: [
          "Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad, cuando procedan, en hola@adoptaunebiker.com.",
          "También puedes reclamar ante la autoridad de control competente. En España, la Agencia Española de Protección de Datos. Este párrafo no sustituye el análisis de qué autoridad corresponde en cada caso.",
        ],
      },
      {
        title: "Menores",
        pending: true,
        paragraphs: [
          "La edad mínima prevista para usar el sitio es de 18 años. Esta previsión debe revisarse jurídicamente antes de considerarse cláusula definitiva.",
        ],
      },
      {
        title: "Matriz de tratamientos (propuesta, no confirmada)",
        pending: true,
        paragraphs: [
          "La tabla siguiente es una propuesta interna para revisión jurídica. No usa una sola base para todos los tratamientos y no afirma que esas bases estén validadas.",
        ],
        table: {
          caption: "Finalidades observadas en el código",
          headers: ["Finalidad", "Datos", "Base propuesta", "Destinatarios", "Conservación", "Consentimiento"],
          rows: [
            [
              "Revisar solicitudes de alta",
              "Identificación, contacto, zona, modalidades, texto libre",
              "Medidas precontractuales a petición de la persona",
              "Organización; Supabase; Vercel",
              "Pendiente",
              "No sustituye la información; no hay casilla genérica",
            ],
            [
              "Crear y gestionar la plaza",
              "Perfil, autenticación, estado de alta o baja",
              "Ejecución de la relación de comunidad",
              "Organización; Supabase; Vercel; Resend",
              "Pendiente",
              "No",
            ],
            [
              "Correo operativo de acceso o clave",
              "Nombre, correo",
              "Necesario para esa relación",
              "Resend",
              "Pendiente",
              "No",
            ],
            [
              "Seguridad del acceso",
              "Sesión, registros técnicos recortados",
              "Interés legítimo de seguridad (pendiente)",
              "Vercel; Supabase",
              "Pendiente",
              "No",
            ],
            [
              "Strava opcional",
              "Tokens y actividades sincronizadas",
              "Consentimiento al conectar",
              "Strava; miembros que ven salidas no privadas",
              "Hasta desconectar",
              "Sí, al autorizar en Strava",
            ],
            [
              "Analítica futura",
              "Uso del sitio, sin definir",
              "Consentimiento",
              "Pendiente; no activo",
              "No aplica hoy",
              "Sí, y hoy no se carga",
            ],
          ],
        },
      },
    ],
  },
  cookies: {
    metaTitle: "Política de cookies | Adopta un eBiker",
    metaDescription: "Cookies y almacenamiento que Adopta un eBiker usa de verdad.",
    title: "Política de cookies",
    intro: [
      "Aquí solo se documentan tecnologías comprobadas en el código. Si un dato de duración o de nombre exacto no se ha podido verificar, se indica como pendiente.",
    ],
    sections: [
      {
        title: "Cómo elegir",
        paragraphs: [
          "El banner permite aceptar todas, rechazar las opcionales o configurar. Rechazar no es más difícil que aceptar. Las casillas opcionales no vienen marcadas.",
          "Puedes cambiar de opinión desde Configurar cookies, en el pie. Guardar una preferencia no es, por sí sola, una prueba jurídica completa.",
        ],
      },
      {
        title: "Cookies técnicas de este sitio",
        paragraphs: ["Se usan para idioma, sesión y, en su caso, el flujo de Strava."],
        table: {
          caption: "Cookies de primer partido verificadas en código",
          headers: ["Nombre", "Uso", "Duración en código", "Tipo"],
          rows: [
            ["NEXT_LOCALE", "Recordar el idioma de la ruta", "365 días", "Técnica / preferencia de idioma"],
            [
              "adopta.privacy",
              "Recordar si has decidido sobre analítica",
              "180 días",
              "Preferencia de privacidad",
            ],
            [
              "Cookies de sesión de Supabase Auth (nombre típico sb-…-auth-token, a veces troceado)",
              "Mantener la sesión de miembro",
              "Pendiente de verificar en el navegador; la fija la librería de autenticación",
              "Técnica de sesión",
            ],
            [
              "adopta.session",
              "Sesión local de desarrollo; en producción no concede acceso",
              "60 días si se llega a escribir",
              "Técnica, residual",
            ],
            [
              "adopta.bonds",
              "Vínculos de adopción guardados en el navegador",
              "60 días",
              "Técnica de intranet",
            ],
            [
              "adopta.strava_oauth",
              "Estado temporal del inicio de conexión con Strava",
              "10 minutos",
              "Técnica",
            ],
          ],
        },
      },
      {
        title: "Almacenamiento que no es cookie",
        paragraphs: ["No son cookies. Viven en tu dispositivo."],
        items: [
          "sessionStorage adopta.join-form: borrador del formulario de alta, solo en la pestaña, hasta enviar o cerrar.",
          "localStorage adopta.adminNav y adopta.intranetNav: si el menú lateral está abierto. Solo intranet o administración.",
        ],
      },
      {
        title: "Analítica y terceros",
        paragraphs: [
          "No se carga Google Analytics ni gtag.js. No hay cookies de medición observadas.",
          "Si conectas Strava, sales de este sitio y Strava puede usar sus propias cookies. Si se muestra un mapa de salida, el navegador pide teselas a OpenStreetMap; no establecemos cookies de OSM.",
          "Las fuentes se sirven con next/font, autohospedadas tras el build, sin petición de cookies a Google Fonts en la visita.",
        ],
      },
      {
        title: "Qué no se borra al rechazar lo opcional",
        paragraphs: [
          "Rechazar analítica no cierra tu sesión ni quita el idioma. No se borran las cookies técnicas de login.",
        ],
      },
    ],
  },
  terms: {
    metaTitle: "Condiciones de uso | Adopta un eBiker",
    metaDescription: "Reglas de la comunidad Adopta un eBiker.",
    title: "Condiciones de uso",
    intro: [
      "Estas condiciones describen el uso de la web pública, de las solicitudes y de la intranet. Están pendientes de revisión jurídica.",
    ],
    sections: [
      {
        title: "Objeto",
        paragraphs: [
          "Adopta un eBiker facilita el contacto entre ciclistas. No organiza de forma centralizada cada salida ni vende plazas.",
        ],
      },
      {
        title: "Edad",
        pending: true,
        paragraphs: [
          "La edad mínima prevista es de 18 años. Esta cláusula debe revisarse antes de publicarse como definitiva.",
        ],
      },
      {
        title: "Alta y pertenencia",
        paragraphs: [
          "Pedir plaza no garantiza la aceptación. La organización puede aceptar, rechazar o eliminar una solicitud, y dar de baja una plaza.",
          "El perfil debe ser veraz. No te hagas pasar por otra persona.",
        ],
      },
      {
        title: "Convivencia y seguridad en ruta",
        paragraphs: [
          "El ritmo lo acuerda el grupo. Nadie se deja atrás sin aviso. La asistencia eléctrica no es motivo de desprecio.",
          "Cada participante es responsable de su bici, su equipo y de cumplir las normas de circulación y del camino. El sitio no sustituye el sentido común ni un seguro.",
        ],
      },
      {
        title: "Contenido de los usuarios",
        paragraphs: [
          "Los textos de la ficha y los recados deben respetar a las demás personas. La organización puede moderar o retirar contenido y, si procede, dar de baja la plaza.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Conectar Strava es opcional. Al hacerlo, aceptas también las condiciones de Strava. Puedes desconectar la cuenta desde Tu plaza.",
        ],
      },
      {
        title: "Baja",
        paragraphs: [
          "Puedes pedir la baja escribiendo a hola@adoptaunebiker.com. La organización puede inactivar una plaza si se incumplen estas reglas.",
        ],
      },
      {
        title: "Limitación de responsabilidad",
        pending: true,
        paragraphs: [
          "No se excluyen los derechos que la ley considera irrenunciables. No se pretende eximir de dolo ni de negligencia grave.",
          "El titular no responde de las salidas que las personas organicen entre ellas más allá de lo que imponga la ley aplicable, aún por determinar.",
        ],
      },
    ],
  },
};
