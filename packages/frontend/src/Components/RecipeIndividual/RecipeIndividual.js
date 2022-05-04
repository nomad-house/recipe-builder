import React from "react";

export default function RecipeIndividual({image, recipeName}) {
  return (
    <div>
      <h1>Title</h1>
      <h2>Blurb</h2>
      <h4>Author</h4>
      <h5>Last Updated: </h5>
      <img className="Recipe__Icon" src={image} alt={recipeName} />
    </div>
  );
}
