import type { LegalCopy } from "@/i18n/types";

export const legalEn: LegalCopy = {
  reviewBanner:
    "Draft for legal and language review. Not the final version. The name, tax ID and address provided have been added. This is not a legal opinion and does not claim GDPR or Spanish data-protection compliance.",
  pendingLabel: "Pending item — not definitive information",
  updatedNote:
    "Status: draft updated with the controller’s identifying details. Legal review of bases, retention periods and transfers is still pending. The six-month periods are an intended criterion, not an automatic deletion already in place. The operational contact email is hola@adoptaunebiker.com.",
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
    necessaryBody:
      "Language, session and security. They cannot be turned off if you want to use the site. They do not include analytics.",
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
        paragraphs: [
          "The controller of the site is a natural person. No company name, register entry or telephone number is published because they have not been provided.",
        ],
        items: [
          "Full name: JUAN JOSE MENA CASANOCA.",
          "Tax ID (NIF): 46754258L.",
          "Address: Bajada de Gomis número 1, 08023 Barcelona, Spain.",
          "Contact email: hola@adoptaunebiker.com.",
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
      "This policy describes the processing the site code performs today. Where a detail, legal basis or retention period is unconfirmed, it is marked as pending. Publishing this policy does not mean GDPR or Spanish data-protection law is fully complied with.",
    ],
    sections: [
      {
        title: "Controller",
        paragraphs: [
          "The controller is JUAN JOSE MENA CASANOCA, a natural person, tax ID (NIF) 46754258L.",
          "Address: Bajada de Gomis número 1, 08023 Barcelona, Spain.",
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
          "The application is stored so the organisers can review it. If it is rejected or deleted, the code does not email the applicant. The application row stays in the database until it is deleted by hand.",
          "If it is accepted, an account and profile are created and an operational email is sent with access details. The accepted application is not deleted: it is marked as accepted. The first sign-in requires a password change.",
          "Organisers can update a profile, activate or deactivate a place, reset the password and keep internal notes. Deactivation makes the place inactive and blocks intranet access; it does not by itself delete the profile.",
        ],
      },
      {
        title: "Email",
        paragraphs: [
          "Today we send operational mail only: a welcome message when an application is accepted, and a notice if the password is reset. Those messages are needed to manage applications, accounts and the running of the community.",
          "There is no newsletter and no marketing. We do not ask for marketing consent because that purpose is not active. If a newsletter is offered later, this policy and the consent mechanism will be reviewed.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecting Strava is voluntary and optional, and only available to signed-in members. The site asks for read access to the profile and activities. That access grant is given on Strava; it is not, by itself, the legal basis for later processing of those data on Adopta un eBiker.",
          "We store athlete id, name, access and refresh tokens, and up to forty bike rides (name, type, distance, elevation, time, date, summary polyline, link and privacy flag).",
          "Non-private rides can be seen on the peloton profile. Disconnecting deletes the local account and stored activities, and tries to revoke access at Strava.",
        ],
      },
      {
        title: "Processors used today",
        pending: true,
        paragraphs: [
          "These services appear in the code or the current hosting setup. Each one is used for a different purpose and they do not all process the same data. Exact location, the processing agreement and international transfers must be confirmed against their contracts and the real project configuration.",
        ],
        items: [
          "Site hosting: Vercel. It may process technical visit data (for example IP address and request logs) to serve the pages.",
          "Database and authentication: Supabase. It stores applications, profiles, internal notes, Strava accounts and member sessions.",
          "Operational email: Resend. It receives the email address and name when an application is accepted or a password is reset.",
          "Strava, only if the member connects the account. It receives the access grant and may process athlete data under its own terms.",
          "Ride maps: OpenStreetMap tiles through Leaflet, only in the intranet when a polyline is shown. The browser requests tiles from the map provider; this site does not send them your member profile.",
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "Google Analytics is planned for later, but it is not configured and is not loaded. There is no measurement ID. Accepting cookies does not turn analytics on while that ID is missing.",
          "If it is switched on later, prior consent will be requested where required and this policy will be updated. There is no active analytics processing today.",
        ],
      },
      {
        title: "Security and logs",
        paragraphs: [
          "Intranet access requires authentication. Server error logs are redacted so emails, passwords and tokens are not kept in clear text.",
          "Those technical logs are distinct from operational application and profile data, and from backups the database provider may keep. No log in this code is a complete legal record on its own.",
        ],
      },
      {
        title: "Retention",
        pending: true,
        paragraphs: [
          "The controller’s intention is not to keep applications or personal data for more than six months where that is compatible with the purpose and applicable duties.",
          "That six-month period does not apply to data needed to keep an active account, provide the service, or handle a legal duty or claim. The code applies those rules: a weekly job lists candidates. The first cycle is a dry-run until a deletion is confirmed. Rows already rejected or inactive start the clock when the migration is applied, not at sign-up.",
          "The table below describes what the code does. It does not claim a bulk irreversible deletion has already run.",
        ],
        table: {
          caption: "Retention by category — rules in the code",
          headers: ["Category", "What happens today", "Proposed criterion", "Event that starts the period", "Automatic deletion"],
          rows: [
            [
              "Rejected applications",
              "The row remains. Rejection is dated in rejected_at",
              "Six months from rejection",
              "Date the application is marked rejected (rejected_at)",
              "Yes, if there is no hold and the weekly job confirms deletion",
            ],
            [
              "Abandoned applications",
              "There is no «abandoned» category. A pending application remains",
              "It is not treated as abandoned. It is kept until a person decides",
              "Does not apply. No verifiable operational rule of abandonment",
              "No. Pending applications are not deleted",
            ],
            [
              "Applications awaiting a decision",
              "They are kept so they can be reviewed",
              "While they are being handled. If there is no decision, the proposed six-month period",
              "Submission of the application or last action by the organisers",
              "No",
            ],
            [
              "Accepted applications",
              "The row is marked accepted. Useful data are copied to the profile",
              "While the place exists, the application may keep the original text. When an inactive place is deleted, or if the application is orphaned for more than six months, personal fields are anonymised. The row remains as a record without contact data, unless there is a hold",
              "Acceptance of the application. Anonymisation follows member closure or orphaning",
              "The row is not deleted. It is anonymised when the member is purged or the application is orphaned",
            ],
            [
              "Members with an active account",
              "Profile, authentication and, where used, internal notes",
              "While the place is active and the service needs those data. The six-month period does not apply",
              "Creation of the place. The deletion period does not start while the account is active",
              "No. Deleting these data would stop the service",
            ],
            [
              "Closed accounts",
              "The profile remains inactive; access is blocked",
              "Six months from closure, unless a duty or claim is ongoing",
              "Change to inactive (deactivated_at). created_at is not used",
              "Yes, if there is no hold and the weekly job confirms deletion",
            ],
            [
              "Strava connection and ride data",
              "Kept while the connection is active",
              "While the member keeps the connection. Disconnecting deletes them on this site",
              "Connection or disconnection by the member",
              "Yes on disconnect: local account and activities are deleted and access at Strava is revoked if possible. There is no monthly expiry",
            ],
            [
              "Technical and security logs",
              "Redacted error logs on the server or host",
              "The minimum time needed to diagnose and protect the service. Still to be set",
              "Each incident or request",
              "Not controlled by this code",
            ],
            [
              "Backups",
              "Outside this code; they depend on the database or hosting provider",
              "Pending confirmation with the provider. They may outlive an operational deletion",
              "The provider’s backup cycle",
              "Not controlled by this application",
            ],
            [
              "Legal duties or claims",
              "retention_hold can be set on the application or profile. The member cannot clear it",
              "The time needed for that duty or claim, even if longer than six months",
              "The fact that gives rise to the duty or claim",
              "Deletion at six months is not promised",
            ],
          ],
        },
      },
      {
        title: "How the six months are applied",
        pending: true,
        paragraphs: [
          "The code distinguishes rejected, pending and accepted applications, and does not delete active accounts or administrators. A weekly job lists candidates. A real deletion needs confirmation in the API and in SQL. The first cycle does not bulk-delete without reviewing that list.",
          "Provider backups may outlive an operational deletion. A legal hold stops both deletion and anonymisation.",
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
          "The intended minimum age to use the site is 18. The form does not check age. This needs legal review before it is treated as a final clause.",
        ],
      },
      {
        title: "Processing matrix (proposal, not confirmed)",
        pending: true,
        paragraphs: [
          "The table is a proposal for legal review. It does not use one legal basis for every processing activity. It does not claim those bases are validated, or that the community model is a contract in every case.",
        ],
        table: {
          caption: "Purposes observed in the code",
          headers: [
            "Purpose",
            "Proposed basis",
            "Reasoning",
            "What the person is told",
            "Legal decision still needed",
          ],
          rows: [
            [
              "Handle membership applications",
              "Pre-contractual steps at the person’s request",
              "The person sends the form so the application can be examined. Those data are needed to assess it",
              "Controller, purpose, that there is no marketing, and a link to this policy",
              "Confirm that an application can be treated as a pre-contractual step and not as generic consent",
            ],
            [
              "Provide the service and manage active accounts",
              "Performance of the relationship with the member and steps needed to provide the service",
              "After acceptance, a profile, authentication and place status are needed to use the intranet",
              "That a place means an account, a profile visible in the intranet and operational emails",
              "Confirm whether that relationship is a contract under GDPR article 6.1.b or another basis, given how the service actually works",
            ],
            [
              "Operational access or password emails",
              "Necessary for that same relationship",
              "Without the welcome or reset email, access cannot be given or recovered. They are not promotions",
              "That only operational messages are sent and that there is no newsletter",
              "Confirm that marketing consent is not required for these messages",
            ],
            [
              "Security, abuse prevention and account protection",
              "Legitimate interest, still to be documented",
              "Purpose: protect access. Necessity: authenticated session and redacted error logs. Balancing: security is expected; they are not used for marketing; logs are redacted",
              "That there is a session and limited technical logs",
              "Write and keep a legitimate-interest assessment. Confirm how long those logs are kept",
            ],
            [
              "Tax, accounting or other legal duties",
              "Legal obligation, only if it actually applies",
              "The site does not invoice applications or sell places. This basis is not treated as active",
              "It will be mentioned only if a concrete duty exists",
              "Confirm whether any real legal duty requires data to be kept",
            ],
            [
              "Optional Strava",
              "Proposal: consent for processing on this site when connecting, distinct from the access grant on Strava",
              "The connection is voluntary. Strava grants access; Adopta un eBiker then processes tokens and activities to show them in the intranet",
              "That it is optional, which permissions are asked, what is stored, who sees non-private rides and how to disconnect",
              "Confirm whether the basis is consent, performance of an optional service feature, or both, and Strava’s role as a recipient",
            ],
            [
              "Future analytics (off today)",
              "Consent, when it is switched on and required",
              "There is no measurement ID or script today. Accepting cookies does not load analytics",
              "That analytics is not active and that, if it is switched on, prior consent will be asked",
              "Do not switch it on or document it as real processing until the tool exists",
            ],
          ],
        },
      },
    ],
  },
  cookies: {
    metaTitle: "Cookie policy | Adopta un eBiker",
    metaDescription: "Cookies and storage that Adopta un eBiker actually uses.",
    title: "Cookie policy",
    intro: [
      "Only technologies verified in the code are documented here. If a duration or exact name could not be verified, it is marked as pending.",
    ],
    sections: [
      {
        title: "How to choose",
        paragraphs: [
          "The banner lets you accept all, reject optional cookies, or configure. Rejecting is no harder than accepting. Optional boxes are not pre-ticked.",
          "You can change your mind from Cookie settings in the footer. Saving a preference is not, by itself, a complete legal record.",
        ],
      },
      {
        title: "Technical cookies on this site",
        paragraphs: ["They are used for language, session and, where relevant, the Strava flow."],
        table: {
          caption: "First-party cookies verified in code",
          headers: ["Name", "Use", "Duration in code", "Type"],
          rows: [
            ["NEXT_LOCALE", "Remember the route language", "365 days", "Technical / language preference"],
            [
              "adopta.privacy",
              "Remember whether you have decided about analytics",
              "180 days",
              "Privacy preference",
            ],
            [
              "Supabase Auth session cookies (typical name sb-…-auth-token, sometimes split)",
              "Keep the member signed in",
              "Pending browser verification; set by the authentication library",
              "Session technical cookie",
            ],
            [
              "adopta.session",
              "Local development session; in production it does not grant access",
              "60 days if it is written",
              "Technical, residual",
            ],
            [
              "adopta.bonds",
              "Adoption links stored in the browser",
              "60 days",
              "Intranet technical cookie",
            ],
            [
              "adopta.strava_oauth",
              "Temporary state for starting a Strava connection",
              "10 minutes",
              "Technical",
            ],
          ],
        },
      },
      {
        title: "Storage that is not a cookie",
        paragraphs: ["These are not cookies. They live on your device."],
        items: [
          "sessionStorage adopta.join-form: draft of the application form, this tab only, until you send or close.",
          "localStorage adopta.adminNav and adopta.intranetNav: whether the side menu is open. Intranet or admin only.",
        ],
      },
      {
        title: "Analytics and third parties",
        paragraphs: [
          "Google Analytics and gtag.js are not loaded. No measurement cookies have been observed. Accepting all cookies does not load analytics if there is no valid measurement ID.",
          "If you connect Strava, you leave this site and Strava may use its own cookies. If a ride map is shown, the browser requests tiles from OpenStreetMap; we do not set OSM cookies.",
          "Fonts are served with next/font, self-hosted after the build, with no cookie request to Google Fonts during the visit.",
        ],
      },
      {
        title: "What rejecting optional cookies does not delete",
        paragraphs: [
          "Rejecting analytics does not sign you out or remove the language. Technical login cookies are not deleted.",
        ],
      },
    ],
  },
  terms: {
    metaTitle: "Terms of use | Adopta un eBiker",
    metaDescription: "Rules of the Adopta un eBiker community.",
    title: "Terms of use",
    intro: [
      "These terms describe use of the public site, applications and the intranet. They are pending legal review.",
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
          "The intended minimum age is 18. This clause must be reviewed before it is published as final.",
        ],
      },
      {
        title: "Joining and membership",
        paragraphs: [
          "Applying does not guarantee acceptance. Organisers may accept, reject or delete an application, and deactivate a place.",
          "Your profile must be truthful. Do not impersonate anyone.",
        ],
      },
      {
        title: "Riding together and safety",
        paragraphs: [
          "The group agrees the pace. Nobody is left behind without notice. Electric assistance is not a reason for contempt.",
          "Each participant is responsible for their bike, their kit and for following road and trail rules. The site does not replace common sense or insurance. The controller does not run the rides and does not guarantee a group in every town.",
        ],
      },
      {
        title: "User content",
        paragraphs: [
          "Profile text and messages must respect other people. Organisers may moderate or remove content and, where appropriate, deactivate the place.",
        ],
      },
      {
        title: "Strava",
        paragraphs: [
          "Connecting Strava is optional. By doing so you also accept Strava’s terms. You can disconnect from Your place. Disconnecting deletes Strava data stored on this site and tries to revoke access.",
        ],
      },
      {
        title: "Leaving",
        paragraphs: [
          "You can ask to leave by writing to hola@adoptaunebiker.com. Organisers may deactivate a place if these rules are broken. Deactivating a place blocks access; it does not by itself mean all data are deleted at once.",
        ],
      },
      {
        title: "Limitation of liability",
        pending: true,
        paragraphs: [
          "Rights the law treats as non-waivable are not excluded. This is not meant to excuse wilful misconduct or gross negligence.",
          "The controller is not liable for rides people organise among themselves beyond what the applicable law, still to be determined, requires.",
        ],
      },
    ],
  },
};
