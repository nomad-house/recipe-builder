import React from 'react'

export default function RecipeImage(props) {
  return (
    <img className="Recipe__icon" src={props.image} alt={props.recipeName} />
  )
}
