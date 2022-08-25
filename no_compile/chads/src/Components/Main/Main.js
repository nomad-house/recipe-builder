import React from "react";
import "./main.css";
import Data from "../../data/recipedata.json";
import RecipeImage from "../RecipeImage/RecipeImage";
import RecipeDetails from "../RecipeDetails/RecipeDetails";
// import RecipeIndividual from "../RecipeIndividual/RecipeIndividual";

export default function Main() {
  return (
    <div className="Main__container">
      {/* <RecipeIndividual image={Data[0].image} recipeName={Data[0].name}/> */}
      {Data.map((recipe) => (
        <div className="Recipe__container" key={recipe.id}>
          <RecipeImage image={recipe.image} recipeName={recipe.name} />
          <RecipeDetails name={recipe.name} category={recipe.category} prepTime={recipe.prepTime} />
        </div>
      ))}
    </div>
  )
}
