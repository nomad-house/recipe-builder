import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./recipeDetails.css";
export default function RecipeDetails({ category, name, prepTime }) {
  return (
    <div>
      <h5 className="Recipe__Category--font-family">{category}</h5>
      <h2 className="Recipe__Name">{name}</h2>
      <div className="row">
        <h5 className="Recipe__prepTime">{prepTime} </h5>
        <AccessTimeIcon fontSize="small" />
      </div>
    </div>
  );
}
