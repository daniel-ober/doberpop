// client/src/components/RecipeCard/RecipeCard.jsx
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./RecipeCard.css";

export default function RecipeCard({
  recipe,
  to, // `/recipes/${id}`
  isFavorited = false,
  onToggleFavorite, // (recipeId, nextState) => Promise<void> | void
  favoriteLoading = false,
  rightActions = null,
}) {
  const history = useHistory();
  const { id, name, kernel_type } = recipe || {};

  const canToggle = typeof onToggleFavorite === "function";
  const isClickable = Boolean(to);

  const go = useCallback(() => {
    if (!isClickable) return;
    history.push(to);
  }, [history, isClickable, to]);

  const handleCardKeyDown = (e) => {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canToggle || favoriteLoading) return;

    const nextState = !isFavorited;
    await onToggleFavorite(id, nextState);
  };

  return (
    <div
      className={[
        "recipeCard",
        isClickable ? "recipeCard--clickable" : "",
        isFavorited ? "recipeCard--favorited" : "",
      ].join(" ")}
      role={isClickable ? "link" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? go : undefined}
      onKeyDown={isClickable ? handleCardKeyDown : undefined}
      aria-label={isClickable ? `Open recipe: ${name}` : undefined}
    >
      <div className="recipeCard__content">
        <div className="recipeCard__titleRow">
          <h3 className="recipeCard__title">{name}</h3>

          {kernel_type ? (
            <span className="recipeCard__pill">{kernel_type}</span>
          ) : (
            <span className="recipeCard__pill recipeCard__pill--muted">Kernel</span>
          )}
        </div>

        <div className="recipeCard__meta">
          <span className="recipeCard__metaKey">Kernel</span>
          <span className="recipeCard__metaVal">
            {kernel_type ? kernel_type : "Not set"}
          </span>
        </div>
      </div>

      {/* stopPropagation prevents navigation when clicking controls */}
      <div className="recipeCard__actions" onClick={(e) => e.stopPropagation()}>
        {canToggle && (
          <button
            type="button"
            className={[
              "favBtn",
              isFavorited ? "favBtn--on" : "",
              favoriteLoading ? "favBtn--loading" : "",
            ].join(" ")}
            onClick={handleFavoriteClick}
            aria-label={isFavorited ? "Unfavorite recipe" : "Favorite recipe"}
            title={isFavorited ? "Unfavorite" : "Favorite"}
            disabled={favoriteLoading}
          >
            {/* Proper heart */}
            <svg
              className="favBtn__icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path d="M12 21s-6.716-4.043-9.428-8.131C.646 9.88 2.12 6.8 5.4 5.6c2.01-.737 4.07.03 5.6 1.57 1.53-1.54 3.59-2.307 5.6-1.57 3.28 1.2 4.754 4.28 2.828 7.269C18.716 16.957 12 21 12 21z" />
            </svg>

            <span className="srOnly">
              {isFavorited ? "Favorited" : "Not favorited"}
            </span>
          </button>
        )}

        {rightActions}
      </div>
    </div>
  );
}