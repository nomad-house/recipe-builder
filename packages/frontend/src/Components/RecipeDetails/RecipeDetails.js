import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./recipeDetails.css";
function RecipeDetails({category, name, prepTime}) {
  return (
    <div>
      <h5>{category}</h5>
      <h2>{name}</h2>
      <div className="row">
        <h5 className="Recipe__prepTime">{prepTime} </h5>
        <AccessTimeIcon fontSize="small" />
      </div>
    </div>
  );
}

export default RecipeDetails;
