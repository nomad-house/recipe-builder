import React from "react";
import "./main.css";
import Data from "../../data/recipedata.json";

export default function Main() {
  return (
    // Container
    // img

    // img
    // Category? Author?
    // Title

    // Prep Time
    // Container
    <div className="Main__container">
      {Data.map((recipe) => (       
        <div className="Recipe__container" key={recipe.id}>
          <img className="Recipe__icon" src={recipe.image} alt={recipe.recipeName} />
          <h5>{recipe.category}</h5>
          <h2>{recipe.name}</h2>
          <h6>{recipe.prepTime} Clock icon</h6>
        </div>
      ))}
    </div>
  );
}
