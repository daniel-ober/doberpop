import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";

export default function Recipes(props) {
  const [open, handleOpen] = useState(false);
  const { recipes, handleDelete, currentUser } = props;

  return (
    <div>
      <div className='recipes-header'>Recipes</div>
      <div className="recipe-cards-container">
        {recipes.map((recipe) => (
          <React.Fragment key={recipe.id}>
              <div className="recipe-cards">
              <Link to={`/recipes/${recipe.id}`}>
                <div className="recipe-name">{recipe.name}</div>
              </Link>
              {currentUser?.id === recipe.user_id && (
                <>
                  <div className="recipe-card-button-container">
                    <Link to={`/recipes/${recipe.id}/edit`}>
                      <img
                        className="recipe-card-button"
                        src="https://i.imgur.com/FFDaXm9.png"
                        alt="edit-button"
                      />
                    </Link>
                    <img
                      onClick={() => handleOpen(recipe.id)}
                      className="recipe-card-button"
                      src="https://i.imgur.com/3yTHceK.png"
                      alt="delete-button"
                    />
                  </div>
                </>
              )}
          </div>
            </React.Fragment>
        ))}
        <br />
      </div>
      {open && (
        <Modal
          open={open}
          handleOpen={handleOpen}
          handleDelete={handleDelete}
        />
      )}
      <br />
      <Link to="/recipes/new">
        <img
          className="add-recipe-button"
          src="https://i.imgur.com/DEfpaHf.png"
          alt="add-recipe"
        />
      </Link>
    </div>
  );
}
