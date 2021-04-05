import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RecipeEdit(props) {
  const [ingredientFormData, setIngredientFormData] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    kernel_type: "",
    ingredients: [],
    yield: "",
    instructions: "",
  });
  const {
    name,
    description,
    kernel_type,
    instructions,
    ingredients,
  } = formData;
  const { id } = useParams();
  const { recipes, handleUpdate } = props;

  useEffect(() => {
    const prefillFormData = () => {
      const recipeItem = recipes.find((recipe) => recipe.id === Number(id));
      setFormData({
        name: recipeItem.name,
        description: recipeItem.description,
        kernel_type: recipeItem.kernel_type,
        ingredients: recipeItem.ingredients,
        yield: recipeItem.yield,
        instructions: recipeItem.instructions,
      });
    };
    if (recipes.length) {
      prefillFormData();
    }
  }, [recipes, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      ingredients: [...prevState.ingredients, { name: ingredientFormData }],
    }));
    setIngredientFormData("");
  };

  const handleDeleteIngredient = (name) => {
    setFormData((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter((ingredient) => {
        return ingredient.name !== name;
      }),
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdate(id, formData);
      }}
    >
      <h2>Edit Recipe</h2>
      <label>
        <input
          type="text"
          name="name"
          placeholder="Recipe Title"
          value={name}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={description}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="kernel_type"
          placeholder="Kernel Profile"
          value={kernel_type}
          onChange={handleChange}
        />
        {ingredients.map((ingredient, index) => (
          <React.Fragment key={index}>
            <p>{ingredient.name}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteIngredient(ingredient.name);
              }}
            >
              Delete
            </button>
          </React.Fragment>
        ))}
        <br />
        <br />
        <input
          type="text"
          name="ingredients"
          value={ingredientFormData}
          placeholder="Ingredients"
          onChange={(e) => setIngredientFormData(e.target.value)}
        />
        <button onClick={handleAddIngredient}>Add</button>
        <br />
        <input
          type="number"
          name="yield"
          placeholder="Yield"
          value={formData.yield}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="instructions"
          placeholder="Instructions"
          value={instructions}
          onChange={handleChange}
        />
      </label>
      <br />
      <button>Cancel</button>
      <br />
      <button>Save</button>
    </form>
  );
}
