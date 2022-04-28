import React from "react";
import "./main.css";
import Data from "../../data/recipedata.json";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Main() {
  return (
    <div className="Main__container">
      {Data.map((recipe) => (       
        <div className="Recipe__container" key={recipe.id}>
          <img className="Recipe__icon" src={recipe.image} alt={recipe.recipeName} />
          <h5>{recipe.category}</h5>
          <h2>{recipe.name}</h2>
          <h6>{recipe.prepTime} <AccessTimeIcon/></h6>
        </div>
      ))}
    </div>
  );
}
