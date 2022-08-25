import React from "react";
import "./recipeImage.css";

export default function RecipeImage({ image, recipeName }) {
  return <img className="Recipe__Icon" src={image} alt={recipeName} />;
}
