import React, { useState } from "react";

export default function RecipeCreate(props) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    kernel_type: "",
    ingredients: [],
    yield: "",
    instructions: "",
  });

  const [ingredientFormData, setIngredientFormData] = useState("");

  const {
    name,
    description,
    kernel_type,
    instructions,
    ingredients,
  } = formData;
  const { handleCreate } = props;

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
      className='create-recipe-container'
      onSubmit={(e) => {
        e.preventDefault();
        handleCreate(formData);
      }}
    >
      <h2>New Recipe</h2>
      <label>
        <input
          type="text"
          name="name"
          placeholder="Recipe Title"
          value={name}
          onChange={handleChange}
          className="create-field"
        />
        <br />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={description}
          onChange={handleChange}
          className="create-field"
        />
        <br />
        <input
          type="text"
          name="kernel_type"
          placeholder="Kernel Profile"
          value={kernel_type}
          onChange={handleChange}
          className="create-field"
        />
        <br />
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
        <input
          type="text"
          name="ingredients"
          value={ingredientFormData}
          placeholder="Ingredients"
          className="create-field"
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
          className="create-field"
        />
        <br />
        <input
          type="text"
          name="instructions"
          placeholder="Instructions"
          value={instructions}
          onChange={handleChange}
          className="create-field"
        />
      </label>
      <br />
      <button>Cancel</button>
      <br />
      <button clasName='create-recipe-button'>Add</button>
    </form>
  );
}
