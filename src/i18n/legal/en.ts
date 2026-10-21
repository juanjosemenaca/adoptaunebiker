import type { LegalCopy } from "@/i18n/types";

export const legalEn: LegalCopy = {
  reviewBanner:
    "Draft for legal and language review. Not the final version. The controller’s legal name, tax ID and address are still missing. This is not a legal opinion and does not claim GDPR or Spanish data-protection compliance.",
  pendingLabel: "Pending item — not definitive information",
  updatedNote:
    "Status: draft published for review. Retention periods, legal bases and international transfers are not confirmed. The operational contact email is hola@adoptaunebiker.com.",
  nav: {
    menu: "Legal information",
    notice: "Legal notice",
    privacy: "Privacy",
    cookies: "Cookies",
    terms: "Terms of use",
    settings: "Cookie settings",
  },
  consent: {
    title: "Cookies and privacy",
    body: "We use technical cookies for language and, if you sign in, for your session. Analytics is not active. You can accept, reject optional cookies, or choose a category.",
    acceptAll: "Accept all",
    rejectOptional: "Reject optional",
    configure: "Set preferences",
    save: "Save preferences",
    close: "Close",
    necessaryTitle: "Necessary",
    necessaryBody: "Language, session and security. They cannot be turned off if you want to use the site. They do not include analytics.",
    analyticsTitle: "Analytics",
    analyticsBody:
      "Measurement of site use. No analytics tool is configured today. If it is switched on later, it will need a valid measurement ID and your consent.",
    analyticsInactive: "Analytics is not active at the moment.",
    settings: "Cookie settings",
  },
  notice: {
    metaTitle: "Legal notice | Adopta un eBiker",
    metaDescription: "Controller, contact and terms for Adopta un eBiker.",
    title: "Legal notice",
    intro: ["This notice identifies https://adoptaunebiker.com, published as Adopta un eBiker."],
    sections: [
      {
        title: "Controller",
        pending: true,
        paragraphs: [
          "The controller is a natural person. Legal name, tax ID and address are not published yet because they have not been provided.",
          "Until those details appear here, the contact channel is hola@adoptaunebiker.com.",
        ],
        items: [
          "Legal name: [not provided]",
          "Tax ID: [not provided]",
          "Address: [not provided]",
          "Operational contact email: hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Purpose of the site",
        paragraphs: [
          "The site is a cycling community that helps beginners and experienced riders find company, on e-bikes or conventional bikes, for road, MTB and gravel.",
          "You can apply for a place and, if accepted, use a members’ intranet. It is not a transport service, an insurer, or a paid event organiser.",
        ],
      },
      {
        title: "Intellectual property",
        paragraphs: [
          "The wording, the Adopta un eBiker name, the logo and the design belong to the controller or are used with permission. Do not copy them for another project without consent.",
          "Member profiles and messages remain theirs, with the licence needed to show them inside the community.",
        ],
      },
      {
        title: "Use of the site",
        paragraphs: [
          "The public pages are open. Sign-up and the intranet are for people the organisers accept. Use the service fairly: do not impersonate anyone or interfere with it.",
        ],
      },
      {
        title: "Liability",
        pending: true,
        paragraphs: [
          "The site helps cyclists meet. Rides are arranged by the people who take part. The controller does not guarantee a group in every town and does not run the rides themselves.",
          "This clause is not meant to exclude liability that the law does not allow to be limited, including wilful misconduct or gross negligence. It needs legal review.",
        ],
      },
      {
        title: "Law and contact",
        pending: true,
        paragraphs: [
          "To identify the controller, exercise rights or report misuse, write to hola@adoptaunebiker.com.",
          "Governing law and venue are pending legal confirmation. No court or country is fixed here as final.",
        ],
      },
    ],
  },
  privacy: {
    metaTitle: "Privacy policy | Adopta un eBiker",
    metaDescription: "How Adopta un eBiker handles applications, members and Strava.",
    title: "Privacy policy",
    intro: [
      "This policy describes the processing the site code performs today. Where a controller detail or legal basis is unconfirmed, it is marked as pending.",
    ],
    sections: [
      {
        title: "Controller",
        pending: true,
        paragraphs: [
          "The controller will be the natural person who owns the project. Legal name, tax ID and address: [not provided].",
          "Contact: hola@adoptaunebiker.com.",
        ],
      },
      {
        title: "Data collected at sign-up",
        paragraphs: [
          "The application form asks for first name, last name, email, country, city, whether you are experienced or a beginner in each discipline, interests, bike, how you ride, what you are looking for, and the language of the request.",
          "A draft is stored only in your browser (sessionStorage) for this tab until you submit or close it. Nothing is sent to the server until you press send.",
        ],
      },
      {
        title: "Applications, members and sign-in",
        paragraphs: [
          "The application is stored so the organisers can review it. If it is rejected or deleted, the code does not email the applicant.",
          "If it is accepted, an account and profile are created and an operational email is sent with access details. The first sign-in requires a password change.",
          "Organisers can update a profile, activate or deactivate a place, reset the password and keep internal notes. Deactivation blocks intranet access.",
        ],
      },
      {
        title: "Email",
        paragraphs: [
          "Today we send operational mail only: a welcome message when an application is accepted, and a notice if the password is reset. There is no newsletter or marketing list.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecting Strava is voluntary and only available to signed-in members. The site asks for read access to the profile and activities.",
          "We store athlete id, name, access and refresh tokens, and up to forty bike rides (name, type, distance, elevation, time, date, summary polyline, link and privacy flag).",
          "Non-private rides can be seen on the peloton profile. Disconnecting deletes the local account and tries to revoke access at Strava.",
        ],
      },
      {
        title: "Processors used today",
        paragraphs: [
          "These services appear in the code or the current hosting setup. Exact location and international transfers are pending confirmation.",
        ],
        items: [
          "Site hosting: Vercel.",
          "Database and authentication: Supabase.",
          "Email delivery: Resend.",
          "Strava, only if the member connects the account.",
          "Ride maps: OpenStreetMap tiles through Leaflet, only in the intranet when a polyline is shown.",
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "Google Analytics is planned but not configured and is not loaded. There is no measurement ID. If it is switched on later, it will require prior consent and this policy will be updated.",
        ],
      },
      {
        title: "Security and logs",
        paragraphs: [
          "Intranet access requires authentication. Server error logs are redacted so emails, passwords and tokens are not kept in clear text.",
          "No log is a complete legal record on its own.",
        ],
      },
      {
        title: "Retention",
        pending: true,
        paragraphs: [
          "No retention period is confirmed. In practice, applications are kept while they are reviewed; profiles while the place is active; Strava data while the connection remains.",
          "Final legal periods must be set by the controller with advice.",
        ],
      },
      {
        title: "Rights",
        paragraphs: [
          "You may ask for access, rectification, erasure, objection, restriction and portability, where they apply, at hola@adoptaunebiker.com.",
          "You may also complain to a competent supervisory authority. In Spain, that is the Agencia Española de Protección de Datos. This does not replace an analysis of which authority applies in each case.",
        ],
      },
      {
        title: "Minors",
        pending: true,
        paragraphs: [
          "The intended minimum age to use the site is 18. This needs legal review before it is treated as a final clause.",
        ],
      },
      {
        title: "Processing matrix (proposal, not confirmed)",
        pending: true,
        paragraphs: [
          "The table is an internal proposal for legal review. It does not use one legal basis for every processing activity and does not claim those bases are validated.",
        ],
        table: {
          caption: "Purposes observed in the code",
          headers: ["Purpose", "Data", "Proposed basis", "Recipients", "Retention", "Consent"],
          rows: [
            [
              "Review applications",
              "Identity, contact, area, disciplines, free text",
              "Pre-contractual steps at the person’s request",
              "Organisers; Supabase; Vercel",
              "Pending",
              "Does not replace the information notice; no generic checkbox",
            ],
            [
              "Create and manage the place",
              "Profile, authentication, active or inactive status",
              "Performance of the community relationship",
              "Organisers; Supabase; Vercel; Resend",
              "Pending",
              "No",
            ],
            [
              "Operational access or password email",
              "Name, email",
              "Necessary for that relationship",
              "Resend",
              "Pending",
              "No",
            ],
            [
              "Access security",
              "Session, redacted technical logs",
              "Legitimate interest in security (pending)",
              "Vercel; Supabase",
              "Pending",
              "No",
            ],
            [
              "Optional Strava",
              "Tokens and synced activities",
              "Consent when connecting",
              "Strava; members who see non-private rides",
              "Until disconnect",
              "Yes, when authorising on Strava",
            ],
            [
              "Future analytics",
              "Site use, not defined",
              "Consent",
              "Pending; not active",
              "Not applicable today",
              "Yes, and nothing is loaded today",
            ],
          ],
        },
      },
    ],
  },
  cookies: {
    metaTitle: "Cookie policy | Adopta un eBiker",
    metaDescription: "Cookies and storage Adopta un eBiker actually uses.",
    title: "Cookie policy",
    intro: [
      "Only technologies verified in the code are listed. Duration or exact names that could not be checked are marked pending.",
    ],
    sections: [
      {
        title: "How to choose",
        paragraphs: [
          "The banner lets you accept all, reject optional cookies, or configure. Rejecting is not harder than accepting. Optional boxes are not pre-ticked.",
          "You can change your mind from Cookie settings in the footer. Saving a preference is not, on its own, complete legal proof.",
        ],
      },
      {
        title: "Technical cookies on this site",
        paragraphs: ["They are used for language, session and, if needed, the Strava flow."],
        table: {
          caption: "First-party cookies verified in code",
          headers: ["Name", "Use", "Duration in code", "Type"],
          rows: [
            ["NEXT_LOCALE", "Remember the language of the route", "365 days", "Technical / language preference"],
            ["adopta.privacy", "Remember whether you decided on analytics", "180 days", "Privacy preference"],
            [
              "Supabase Auth session cookies (typical name sb-…-auth-token, sometimes chunked)",
              "Keep the member signed in",
              "Pending browser verification; set by the auth library",
              "Session technical cookie",
            ],
            [
              "adopta.session",
              "Local development session; does not grant access in production",
              "60 days if it is written",
              "Technical, residual",
            ],
            ["adopta.bonds", "Adoption links stored in the browser", "60 days", "Intranet technical cookie"],
            ["adopta.strava_oauth", "Temporary state for the Strava connection", "10 minutes", "Technical"],
          ],
        },
      },
      {
        title: "Storage that is not a cookie",
        paragraphs: ["These are not cookies. They stay on your device."],
        items: [
          "sessionStorage adopta.join-form: sign-up draft, this tab only, until you send or close.",
          "localStorage adopta.adminNav and adopta.intranetNav: whether the side menu is open. Intranet or admin only.",
        ],
      },
      {
        title: "Analytics and third parties",
        paragraphs: [
          "Google Analytics and gtag.js are not loaded. No measurement cookies have been observed.",
          "If you connect Strava you leave this site and Strava may use its own cookies. If a ride map is shown, the browser requests tiles from OpenStreetMap; we do not set OSM cookies.",
          "Fonts are served with next/font, self-hosted after the build, with no Google Fonts cookie request during the visit.",
        ],
      },
      {
        title: "What rejecting optional cookies does not delete",
        paragraphs: [
          "Rejecting analytics does not sign you out or drop the language. Technical login cookies are kept.",
        ],
      },
    ],
  },
  terms: {
    metaTitle: "Terms of use | Adopta un eBiker",
    metaDescription: "Community rules for Adopta un eBiker.",
    title: "Terms of use",
    intro: [
      "These terms describe the public site, applications and the intranet. They are pending legal review.",
    ],
    sections: [
      {
        title: "Purpose",
        paragraphs: [
          "Adopta un eBiker helps cyclists meet. It does not centrally organise every ride or sell places.",
        ],
      },
      {
        title: "Age",
        pending: true,
        paragraphs: [
          "The intended minimum age is 18. This clause must be reviewed before it is treated as final.",
        ],
      },
      {
        title: "Membership",
        paragraphs: [
          "Applying does not guarantee acceptance. Organisers may accept, reject or delete an application, and deactivate a place.",
          "Profiles must be truthful. Do not impersonate anyone.",
        ],
      },
      {
        title: "Riding together",
        paragraphs: [
          "The group agrees the pace. Nobody is dropped without warning. Electric assist is not a reason for contempt.",
          "Each rider is responsible for their bike, kit and for following road and trail rules. The site does not replace common sense or insurance.",
        ],
      },
      {
        title: "User content",
        paragraphs: [
          "Profile text and messages must respect other people. Organisers may moderate or remove content and, if needed, deactivate the place.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecting Strava is optional. By doing so you also accept Strava’s terms. You can disconnect from Your place.",
        ],
      },
      {
        title: "Leaving",
        paragraphs: [
          "You can ask to leave by writing to hola@adoptaunebiker.com. Organisers may deactivate a place if these rules are broken.",
        ],
      },
      {
        title: "Limitation of liability",
        pending: true,
        paragraphs: [
          "Rights that the law treats as non-waivable are not excluded. This is not an attempt to excuse wilful misconduct or gross negligence.",
          "The controller is not liable for rides people organise among themselves beyond what applicable law, still to be determined, requires.",
        ],
      },
    ],
  },
};
