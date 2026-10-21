import type { LegalCopy } from "@/i18n/types";

export const legalEs: LegalCopy = {
  reviewBanner:
    "Borrador para revisión jurídica y lingüística. No es la versión definitiva. Se han incorporado el nombre, el NIF y el domicilio facilitados. Este texto no constituye un dictamen ni una declaración de conformidad con el RGPD o la LOPDGDD.",
  pendingLabel: "Dato o cláusula pendiente — no es información definitiva",
  updatedNote:
    "Estado: borrador actualizado con los datos identificativos del titular. Sigue pendiente la revisión jurídica de bases, plazos y transferencias. Los plazos de seis meses son un criterio previsto, no un borrado automático ya implementado. El correo de contacto operativo es hola@adoptaunebiker.com.",
  nav: {
    menu: "Información legal",
    notice: "Aviso legal",
    privacy: "Privacidad",
    cookies: "Cookies",
    terms: "Condiciones de uso",
    settings: "Configurar cookies",
    backHome: "Volver al inicio",
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
        paragraphs: [
          "El titular del sitio es una persona física. No se publica razón social, inscripción registral ni teléfono porque no se han facilitado.",
        ],
        items: [
          "Nombre y apellidos: JUAN JOSE MENA CASANOCA.",
          "NIF: 46754258L.",
          "Domicilio: Bajada de Gomis número 1, 08023 Barcelona, España.",
          "Correo de contacto: hola@adoptaunebiker.com.",
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
      "Esta política describe los tratamientos que el código del sitio realiza hoy. Donde un dato, una base jurídica o un plazo no está confirmado, se indica como pendiente. Publicar esta política no equivale a afirmar que el RGPD o la LOPDGDD se cumplen íntegramente.",
    ],
    sections: [
      {
        title: "Responsable",
        paragraphs: [
          "El responsable del tratamiento es JUAN JOSE MENA CASANOCA, persona física, NIF 46754258L.",
          "Domicilio: Bajada de Gomis número 1, 08023 Barcelona, España.",
          "Contacto: hola@adoptaunebiker.com.",
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
          "La solicitud se guarda para que la organización la revise. Si se rechaza o se elimina, el código no envía correo a la persona solicitante. La fila de la solicitud permanece en la base de datos hasta un borrado manual.",
          "Si se acepta, se crea una cuenta y un perfil, y se envía un correo operativo con el acceso. La solicitud aceptada no se borra: queda marcada como aceptada. La primera entrada exige cambiar la clave.",
          "La organización puede actualizar la ficha, dar de alta o de baja, restablecer la clave y dejar comentarios internos de gestión. La baja inactiva la plaza e impide el acceso a la intranet; no elimina por sí sola el perfil.",
        ],
      },
      {
        title: "Correos",
        paragraphs: [
          "Hoy se envían solo correos operativos: bienvenida al aceptar una solicitud y aviso si se restablece la clave. Esos mensajes son necesarios para gestionar solicitudes, cuentas y el funcionamiento de la comunidad.",
          "No hay boletín, newsletter ni promociones comerciales. No se pide consentimiento para marketing porque esa finalidad no está activa. Si en el futuro se ofrece un boletín, se revisará esta política y el mecanismo de consentimiento.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Conectar Strava es voluntario y opcional, y solo está disponible para miembros con sesión. El sitio pide permisos de lectura de perfil y actividades. Esa autorización de acceso se concede en Strava; no es, por sí sola, la base jurídica del tratamiento posterior de los datos en Adopta un eBiker.",
          "Se guardan identificador de atleta, nombre, tokens de acceso y de renovación, y hasta cuarenta salidas de bici (nombre, tipo, distancia, desnivel, tiempo, fecha, trazado resumido, enlace y si es privada).",
          "Las salidas no privadas pueden verse en la ficha del pelotón. Al desconectar se borra la cuenta local y las actividades guardadas, y se intenta revocar el acceso en Strava.",
        ],
      },
      {
        title: "Proveedores que intervienen hoy",
        pending: true,
        paragraphs: [
          "Los siguientes servicios aparecen en el código o en el despliegue actual. Cada uno interviene para una finalidad distinta y no todos tratan los mismos datos. La ubicación exacta, el encargo de tratamiento y las transferencias internacionales deben confirmarse con sus contratos y con la configuración real del proyecto.",
        ],
        items: [
          "Alojamiento del sitio: Vercel. Puede tratar datos técnicos de la visita (por ejemplo, dirección IP y registros de petición) para servir las páginas.",
          "Base de datos y autenticación: Supabase. Guarda solicitudes, perfiles, notas internas, cuentas de Strava y la sesión de miembros.",
          "Envío de correo operativo: Resend. Recibe el correo y el nombre cuando se acepta una solicitud o se restablece la clave.",
          "Strava, solo si el miembro conecta la cuenta. Recibe la autorización de acceso y puede tratar datos del atleta según sus propias condiciones.",
          "Mapas de salidas: teselas de OpenStreetMap a través de Leaflet, solo en la intranet cuando hay un trazado que mostrar. El navegador pide las teselas al prestador del mapa; este sitio no les envía tu ficha de miembro.",
        ],
      },
      {
        title: "Analítica",
        paragraphs: [
          "Google Analytics está previsto para el futuro, pero no está configurado ni se carga. No hay identificador de medición. Aceptar cookies no activa analítica mientras no exista ese identificador.",
          "Si se activa más adelante, se pedirá consentimiento previo cuando sea necesario y se actualizará esta política. Hoy no hay tratamiento analítico activo.",
        ],
      },
      {
        title: "Seguridad y registros",
        paragraphs: [
          "El acceso a la intranet exige autenticación. Los registros de error del servidor se recortan para no dejar correos, contraseñas ni tokens en claro.",
          "Esos registros técnicos se distinguen de los datos operativos de solicitudes y perfiles, y de las copias de seguridad que pueda hacer el proveedor de base de datos. Ningún registro de este código es una prueba jurídica completa por sí solo.",
        ],
      },
      {
        title: "Conservación",
        pending: true,
        paragraphs: [
          "La intención del titular es no conservar solicitudes ni datos personales más de seis meses cuando eso sea compatible con la finalidad y con las obligaciones aplicables.",
          "Ese plazo de seis meses no se aplica a los datos indispensables para mantener una cuenta activa, prestar el servicio o atender una obligación o reclamación. El código aplica esas reglas: una tarea semanal recorre los candidatos. El primer ciclo es de simulación hasta que se confirme un borrado. Las filas ya rechazadas o inactivas empiezan el plazo al aplicar la migración, no en la fecha de alta.",
          "La tabla siguiente distingue lo que hace el código y el criterio. No afirma que ya se haya ejecutado un borrado masivo irreversible.",
        ],
        table: {
          caption: "Conservación por categoría — reglas del código",
          headers: ["Categoría", "Qué ocurre hoy", "Criterio propuesto", "Evento que inicia el plazo", "Borrado automático"],
          rows: [
            [
              "Solicitudes rechazadas",
              "La fila permanece. El rechazo se fecha en rejected_at",
              "Seis meses desde el rechazo",
              "Fecha en que la solicitud se marca como rechazada (rejected_at)",
              "Sí, si no hay hold y la tarea semanal confirma el borrado",
            ],
            [
              "Solicitudes abandonadas",
              "No hay una categoría «abandonada». Una solicitud pendiente permanece",
              "No se clasifica como abandono. Se conserva hasta una decisión humana",
              "No aplica. Sin regla operativa verificable de abandono",
              "No. Las pendientes no se borran",
            ],
            [
              "Solicitudes pendientes de resolución",
              "Se conservan para revisarlas",
              "Mientras se tramitan. Si no hay resolución, el plazo de seis meses propuesto",
              "Envío de la solicitud o última actuación de la organización",
              "No",
            ],
            [
              "Solicitudes aceptadas",
              "La fila se marca como aceptada. Los datos útiles se copian al perfil",
              "Mientras exista la plaza, la solicitud puede conservar el texto original. Al eliminar la plaza inactiva, o si queda huérfana más de seis meses, se anonimiza: nombre, correo y texto se sustituyen. La fila queda como constancia sin datos de contacto, salvo hold",
              "Aceptación de la solicitud. La anonimización sigue a la baja del miembro o a la orfandad",
              "No se borra la fila. Se anonimiza cuando cae el miembro o queda huérfana",
            ],
            [
              "Miembros con cuenta activa",
              "Perfil, autenticación y, si procede, notas internas",
              "Mientras la plaza esté activa y sea necesario prestar el servicio. No se aplica el plazo de seis meses",
              "Alta de la plaza. El plazo de eliminación no empieza mientras la cuenta esté activa",
              "No. Borrar estos datos impediría el servicio",
            ],
            [
              "Cuentas dadas de baja",
              "El perfil permanece con estado inactivo; se bloquea el acceso",
              "Seis meses desde la baja, si no hay obligación o reclamación en curso",
              "Cambio a inactivo (deactivated_at). No se usa created_at",
              "Sí, si no hay hold y la tarea semanal confirma el borrado",
            ],
            [
              "Datos de conexión y actividades de Strava",
              "Se guardan mientras la conexión está activa",
              "Mientras el miembro mantenga la conexión. Al desconectar se borran en este sitio",
              "Conexión o desconexión por el miembro",
              "Sí al desconectar: se eliminan cuenta local y actividades y se intenta revocar el acceso en Strava. No hay caducidad por meses",
            ],
            [
              "Registros técnicos y de seguridad",
              "Registros de error recortados en el servidor o en el alojamiento",
              "El tiempo mínimo necesario para diagnosticar y proteger el servicio. Pendiente de fijar",
              "Cada incidencia o petición",
              "No lo controla este código",
            ],
            [
              "Copias de seguridad",
              "Fuera de este código; dependen del proveedor de base de datos o del alojamiento",
              "Pendiente de confirmar con el proveedor. Pueden sobrevivir a un borrado operativo",
              "Ciclo de copias del proveedor",
              "No lo controla esta aplicación",
            ],
            [
              "Obligaciones legales o reclamaciones",
              "Se puede marcar retention_hold en la solicitud o en el perfil. El usuario no puede quitarlo",
              "El tiempo necesario para esa obligación o reclamación, aunque supere seis meses",
              "Hecho que origina la obligación o la reclamación",
              "No se promete el borrado a los seis meses",
            ],
          ],
        },
      },
      {
        title: "Cómo se aplican los seis meses",
        pending: true,
        paragraphs: [
          "El código distingue solicitudes rechazadas, pendientes y aceptadas, y no borra cuentas activas ni administradores. Una tarea semanal lista los candidatos. Un borrado real exige confirmación en la API y en SQL. El primer ciclo no borra en masa sin revisar el listado.",
          "Las copias de seguridad del proveedor pueden sobrevivir al borrado operativo. Un hold legal detiene tanto el borrado como la anonimización.",
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
          "La edad mínima prevista para usar el sitio es de 18 años. El formulario no comprueba la edad. Esta previsión debe revisarse jurídicamente antes de considerarse cláusula definitiva.",
        ],
      },
      {
        title: "Matriz de tratamientos (propuesta, no confirmada)",
        pending: true,
        paragraphs: [
          "La tabla siguiente es una propuesta para revisión jurídica. No usa una sola base para todos los tratamientos. No afirma que esas bases estén validadas ni que el modelo de la comunidad sea, en todos los casos, un contrato.",
        ],
        table: {
          caption: "Finalidades observadas en el código",
          headers: [
            "Finalidad",
            "Base propuesta",
            "Justificación",
            "Qué se informa",
            "Decisión jurídica pendiente",
          ],
          rows: [
            [
              "Gestionar solicitudes de ingreso",
              "Medidas precontractuales a petición de la persona",
              "La persona envía el formulario para que se examine su alta. Sin esos datos no se puede valorar la solicitud",
              "Responsable, finalidad, que no hay marketing, y enlace a esta política",
              "Confirmar que la solicitud de alta puede tratarse como medida precontractual y no como consentimiento genérico",
            ],
            [
              "Prestar el servicio y gestionar cuentas activas",
              "Ejecución de la relación con el miembro y medidas necesarias para prestar el servicio",
              "Tras la aceptación hacen falta perfil, autenticación y estado de la plaza para usar la intranet",
              "Que la plaza implica una cuenta, ficha visible en la intranet y correos operativos",
              "Confirmar si esa relación es un contrato del artículo 6.1.b del RGPD o otra base, según el modelo real del servicio",
            ],
            [
              "Correos operativos de acceso o clave",
              "Necesarios para esa misma relación",
              "Sin el correo de bienvenida o de restablecimiento no se puede entregar o recuperar el acceso. No son promociones",
              "Que solo se envían mensajes operativos y que no hay boletín",
              "Confirmar que no se exige un consentimiento de marketing para estos envíos",
            ],
            [
              "Seguridad, prevención de abuso y protección de cuentas",
              "Interés legítimo, pendiente de documentar",
              "Finalidad: proteger el acceso. Necesidad: sesión autenticada y registros de error recortados. Ponderación: se espera seguridad; no se usan para marketing; los registros se recortan",
              "Que hay sesión y registros técnicos limitados",
              "Redactar y conservar el análisis de interés legítimo. Confirmar plazos de esos registros",
            ],
            [
              "Obligaciones fiscales, contables u otras obligaciones legales",
              "Obligación legal, solo si resulta pertinente",
              "El sitio no factura altas ni vende plazas. Esta base no se da por activa",
              "Solo se mencionará si existe una obligación concreta",
              "Confirmar si hay alguna obligación legal real que imponga conservar datos",
            ],
            [
              "Strava opcional",
              "Propuesta: consentimiento para el tratamiento en este sitio al conectar, distinta de la autorización de acceso en Strava",
              "La conexión es voluntaria. Strava concede el acceso; Adopta un eBiker trata después tokens y actividades para mostrarlas en la intranet",
              "Que es opcional, qué permisos se piden, qué se guarda, quién ve las salidas no privadas y cómo desconectar",
              "Confirmar si la base es el consentimiento, la ejecución de una función opcional del servicio, o ambas, y el régimen de Strava como destinatario",
            ],
            [
              "Analítica futura (hoy apagada)",
              "Consentimiento, cuando se active y sea necesario",
              "Hoy no hay identificador ni script. Aceptar cookies no carga analítica",
              "Que la analítica no está activa y que, si se enciende, se pedirá consentimiento previo",
              "No activar ni documentar como tratamiento real hasta que exista la herramienta",
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
          "No se carga Google Analytics ni gtag.js. No hay cookies de medición observadas. Aceptar todas las cookies no carga analítica si no hay un identificador de medición válido.",
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
          "Cada participante es responsable de su bici, su equipo y de cumplir las normas de circulación y del camino. El sitio no sustituye el sentido común ni un seguro. El titular no asume la organización material de las rutas ni garantiza una grupeta en cada localidad.",
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
          "Conectar Strava es opcional. Al hacerlo, aceptas también las condiciones de Strava. Puedes desconectar la cuenta desde Tu plaza. Al desconectar se borran los datos de Strava guardados en este sitio y se intenta revocar el acceso.",
        ],
      },
      {
        title: "Baja",
        paragraphs: [
          "Puedes pedir la baja escribiendo a hola@adoptaunebiker.com. La organización puede inactivar una plaza si se incumplen estas reglas. Inactivar la plaza bloquea el acceso; no implica por sí sola el borrado inmediato de todos los datos.",
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
