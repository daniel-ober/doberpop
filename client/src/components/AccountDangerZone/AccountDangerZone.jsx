// client/src/components/AccountDangerZone/AccountDangerZone.jsx
import React, { useState } from "react";
import { deleteMyAccount } from "../../services/account";
import "./AccountDangerZone.css";

export default function AccountDangerZone() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteClick = async () => {
    if (busy) return;

    const confirmed = window.confirm(
      "This will permanently delete your Doberpop account, your saved favorites, and any personal batch ideas.\n\nThis cannot be undone.\n\nType OK in the next prompt if you're sure."
    );
    if (!confirmed) return;

    const typed = window.prompt(
      'To confirm, type "DELETE" (all caps) and press OK.'
    );
    if (typed !== "DELETE") return;

    try {
      setBusy(true);
      setError("");
      await deleteMyAccount();
      // After deletion, send them home and hard-refresh to clear auth UI
      window.location.href = "/";
    } catch (e) {
      setError(e.message || "Something went wrong deleting your account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="accountDanger">
      <h2 className="accountDanger__title">Danger zone</h2>
      <p className="accountDanger__text">
        Deleting your account will permanently remove your profile, favorites,
        and any personal batch ideas you&apos;ve saved. This action cannot be
        undone.
      </p>

      {error && <div className="accountDanger__error">{error}</div>}

      <button
        type="button"
        className="accountDanger__btn"
        onClick={handleDeleteClick}
        disabled={busy}
      >
        {busy ? "Deleting account…" : "Delete my account"}
      </button>
    </section>
  );
}