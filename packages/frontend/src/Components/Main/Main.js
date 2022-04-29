import React from "react";
import "./main.css";
import Data from "../../data/recipedata.json";
import RecipeImage from "../RecipeImage/RecipeImage"
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Main() {
  return (
    <div className="Main__container">
      {Data.map((recipe) => (       
        <div className="Recipe__container" key={recipe.id}>
          <RecipeImage image={recipe.image}/>
          <h5>{recipe.category}</h5>
          <h2>{recipe.name}</h2>
          <div className="row">
          <h5 style={{ marginTop: ".2rem"}}>{recipe.prepTime} </h5>
          <AccessTimeIcon fontSize="small"/>
          </div>
        </div>
      ))}
    </div>
  );
}
