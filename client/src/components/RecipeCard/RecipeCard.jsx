// client/src/components/RecipeCard/RecipeCard.jsx
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import "./RecipeCard.css";

/**
 * bg.png imports for every flavor
 */
import baconCheddarBg from "../../assets/images/flavors/Bacon & Cheddar/bg.png";
import birthdayCakeBg from "../../assets/images/flavors/Birthday Cake/bg.png";
import blastOffCheddaNRanchBg from "../../assets/images/flavors/Blast Off Chedda N Ranch/bg.png";
import breakfastOfChampionsBg from "../../assets/images/flavors/Breakfast of Champions/bg.png";
import buffaloRanchBg from "../../assets/images/flavors/Buffalo Ranch/bg.png";
import chicagoStyleBg from "../../assets/images/flavors/Chicago Style/bg.png";
import classicButterBg from "../../assets/images/flavors/Classic Butter/bg.png";
import classicCheddarBg from "../../assets/images/flavors/Classic Cheddar/bg.png";
import cookiesCreamBg from "../../assets/images/flavors/Cookies & Cream/bg.png";
import crackedPepperAsiagoBg from "../../assets/images/flavors/Cracked Pepper & Asiago/bg.png";
import dillPickleBg from "../../assets/images/flavors/Dill Pickle/bg.png";
import englishToffeeHolidayBg from "../../assets/images/flavors/English Toffee Candy (Holiday)/bg.png";
import jalapenoBg from "../../assets/images/flavors/Jalapeño/bg.png";
import jalapenoCheddarBg from "../../assets/images/flavors/Jalapeño & Cheddar/bg.png";
import nachoCheddarBg from "../../assets/images/flavors/Nacho Cheddar/bg.png";
import peanutButterCupCornBg from "../../assets/images/flavors/Peanut Butter CupCorn/bg.png";
import peppermintCookieBg from "../../assets/images/flavors/Peppermint Cookie/bg.png";
import pepperoniPizzaBg from "../../assets/images/flavors/Pepperoni Pizza/bg.png";
import ranchBg from "../../assets/images/flavors/Ranch/bg.png";
import saltedCaramelDarkChocolateBg from "../../assets/images/flavors/Salted Caramel & Dark Chocolate/bg.png";
import saltedCaremelBg from "../../assets/images/flavors/Salted Caremel/bg.png";
import sourCreamOnionBg from "../../assets/images/flavors/Sour Cream & Onion/bg.png";
import spicySrirachaBg from "../../assets/images/flavors/Spicy Sriracha/bg.png";
import texMexBg from "../../assets/images/flavors/Tex Mex/bg.png";

/**
 * Map recipe.name → background image
 * Make sure these keys match your recipe titles in the DB.
 */
const CARD_BACKGROUNDS = {
  "Bacon & Cheddar": baconCheddarBg,
  "Birthday Cake": birthdayCakeBg,
  "Blast-Off Chedda n Ranch": blastOffCheddaNRanchBg,
  "Blast Off Chedda N Ranch": blastOffCheddaNRanchBg, // safety alias

  "Breakfast of Champions": breakfastOfChampionsBg,
  "Buffalo Ranch": buffaloRanchBg,
  "Chicago Style": chicagoStyleBg,
  "Classic Butter": classicButterBg,
  "Classic Cheddar": classicCheddarBg,
  "Cookies & Cream": cookiesCreamBg,
  "Cracked Pepper & Asiago": crackedPepperAsiagoBg,
  "Dill Pickle": dillPickleBg,
  "English Toffee Candy (Holiday)": englishToffeeHolidayBg,
  "Jalapeño": jalapenoBg,
  "Jalapeño & Cheddar": jalapenoCheddarBg,
  "Nacho Cheddar": nachoCheddarBg,
  "Peanut Butter CupCorn": peanutButterCupCornBg,
  "Peppermint Cookie": peppermintCookieBg,
  "Pepperoni Pizza": pepperoniPizzaBg,
  Ranch: ranchBg,
  "Salted Caramel & Dark Chocolate": saltedCaramelDarkChocolateBg,
  "Salted Caremel": saltedCaremelBg, // spelled as folder name
  "Sour Cream & Onion": sourCreamOnionBg,
  "Spicy Sriracha": spicySrirachaBg,
  "Tex Mex": texMexBg,
};

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

  // Resolve bg image for this recipe
  const flavorBg = useMemo(() => {
    const key = name?.trim();
    return key ? CARD_BACKGROUNDS[key] || null : null;
  }, [name]);

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
      style={flavorBg ? { backgroundImage: `url(${flavorBg})` } : undefined}
    >
      {/* overlay sits above the bg image to keep text readable */}
      <div className="recipeCard__overlay" />

      <div className="recipeCard__content">
        <div className="recipeCard__titleRow">
          <h3 className="recipeCard__title">{name}</h3>

          {/* {kernel_type ? (
            <span className="recipeCard__pill">{kernel_type}</span>
          ) : (
            <span className="recipeCard__pill recipeCard__pill--muted">
              Kernel
            </span>
          )} */}
        </div>

        <div className="recipeCard__meta">
          {/* <span className="recipeCard__metaKey">Kernel profile</span>
          <span className="recipeCard__metaVal">
            {kernel_type ? kernel_type : "Not set"}
          </span> */}
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