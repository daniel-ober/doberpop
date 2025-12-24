import React from "react";
import { Link } from "react-router-dom";
import "./Privacy.css";

export default function Privacy() {
  return (
    <div className="dpPrivacyScreen">
      <div className="dpPrivacyCard">
        <h1 className="dpPrivacyTitle">Doberpop Privacy Policy</h1>
        <p className="dpPrivacyMeta">Last updated: December 24, 2025</p>

        <p className="dpPrivacyIntro">
          Doberpop is a personal project created and maintained by me, Dan Ober.
          This policy explains, in plain language, what information is collected
          when you use the Doberpop site and app, how it’s used, and the choices
          you have.
        </p>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">1. Who is responsible?</h2>
          <p className="dpPrivacyText">
            Doberpop is run by an individual (not a large company). If you have
            questions about this policy or how your information is used, you can
            reach me at{" "}
            <a
              href="mailto:doberpopgourmet@gmail.com"
              className="dpPrivacyLink"
            >
              doberpopgourmet@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">2. Information I collect</h2>
          <p className="dpPrivacyText">
            Depending on how you use Doberpop, I may collect:
          </p>
          <ul className="dpPrivacyList">
            <li>
              <strong>Account details</strong> – username, email address, and
              password (stored in hashed form via the authentication system).
            </li>
            <li>
              <strong>Recipe + batch data</strong> – the popcorn recipes,
              notes, yields, and other batch details you create or save.
            </li>
            <li>
              <strong>Basic usage data</strong> – log data such as pages
              visited, actions taken in the app, or approximate region, often
              collected through analytics tools and server logs.
            </li>
          </ul>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">3. How your information is used</h2>
          <p className="dpPrivacyText">
            I use the information described above to:
          </p>
          <ul className="dpPrivacyList">
            <li>Authenticate you and keep your account signed in.</li>
            <li>
              Save, update, and display your recipes, batches, and preferences.
            </li>
            <li>
              Keep the service running securely and reliably (for example,
              monitoring for abuse or errors).
            </li>
            <li>
              Understand how people use Doberpop so I can improve the
              experience over time.
            </li>
          </ul>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">4. Cookies & analytics</h2>
          <p className="dpPrivacyText">
            Doberpop may use cookies or similar technologies to keep you logged
            in and remember basic settings. I may also use privacy-aware
            analytics tools (such as Google Analytics or similar services) to
            understand overall usage trends. These tools typically collect
            anonymized or pseudonymized information like page views,
            approximate region, and device type.
          </p>
          <p className="dpPrivacyText">
            You can usually manage cookies in your browser settings, including
            blocking or deleting them if you prefer.
          </p>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">5. When information is shared</h2>
          <p className="dpPrivacyText">I don’t sell your personal information.</p>
          <p className="dpPrivacyText">Information may be shared only with:</p>
          <ul className="dpPrivacyList">
            <li>
              <strong>Service providers</strong> that help run Doberpop (for
              example: hosting, databases, authentication, analytics), under
              terms that limit how they can use your data.
            </li>
            <li>
              <strong>Legal or safety reasons</strong>, if I’m required to do so
              by law or if it’s necessary to protect the rights, safety, or
              security of users or the service.
            </li>
          </ul>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">6. Data retention</h2>
          <p className="dpPrivacyText">
            I keep your information for as long as your account is active and as
            long as it’s needed to provide the service. If you delete your
            account or request removal of your data, I’ll remove or anonymize
            personal information where reasonably possible, subject to any
            technical, legal, or security requirements.
          </p>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">7. Your choices & rights</h2>
          <p className="dpPrivacyText">
            Depending on your location, you may have rights to access, update,
            or delete certain personal information.
          </p>
          <p className="dpPrivacyText">
            If you’d like to review, update, or remove your account or data,
            email{" "}
            <a
              href="mailto:doberpopgourmet@gmail.com"
              className="dpPrivacyLink"
            >
              doberpopgourmet@gmail.com
            </a>{" "}
            and I’ll do my best to help within a reasonable time.
          </p>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">8. Security</h2>
          <p className="dpPrivacyText">
            I use reasonable technical and organizational measures to help
            protect your information (such as HTTPS and hashed passwords).
            However, no online service can guarantee perfect security, so you
            should still use a strong, unique password and keep it private.
          </p>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">9. Changes to this policy</h2>
          <p className="dpPrivacyText">
            I may update this policy from time to time as Doberpop evolves. If a
            material change is made, I’ll update the &quot;Last updated&quot;
            date at the top and, when appropriate, provide a notice in the app
            or on the site.
          </p>
        </section>

        <section className="dpPrivacySection">
          <h2 className="dpPrivacySectionTitle">10. How to contact me</h2>
          <p className="dpPrivacyText">
            If you have questions about this policy or how your data is handled,
            email{" "}
            <a
              href="mailto:doberpopgourmet@gmail.com"
              className="dpPrivacyLink"
            >
              doberpopgourmet@gmail.com
            </a>
            .
          </p>
        </section>

        {/* ===== Back Button ===== */}
        <div className="dpPrivacyBackWrap">
          <Link to="/" className="dpPrivacyBackBtn">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
}