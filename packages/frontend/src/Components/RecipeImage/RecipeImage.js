import React from 'react'
import "./recipeImage.css";

function RecipeImage({image, recipeName}) {
  return (
    <img className='Recipe__icon' src={image} alt={recipeName} />
  )
}

export default RecipeImage