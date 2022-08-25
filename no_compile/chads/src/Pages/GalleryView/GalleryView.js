import React from "react";
import "./galleryView.css";
import Data from "../../data/recipedata.json";
import RecipeImage from "../../Components/RecipeImage";
import RecipeDetails from "../../Components/RecipeDetails";

export default function GalleryView() {
  return (
    <div className="Main__container">
      {Data.map((recipe) => (
        <div className="Recipe__container" key={recipe.id}>
          <RecipeImage image={recipe.image} recipeName={recipe.name} />
          <RecipeDetails name={recipe.name} category={recipe.category} prepTime={recipe.prepTime} />
        </div>
      ))}
    </div>
  );
}