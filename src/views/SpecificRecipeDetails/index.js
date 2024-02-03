import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import RecipeNotFound from '../../components/RecipeNotFound404';
import '../../styles/app.css';

const RecipeDetails = () => {
  const { idMeal } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to update local storage with modified data
  const updateLocalStorage = () => {
    const storedDetails = localStorage.getItem(`recipeDetails_${idMeal}`);
    console.log(storedDetails);

    /*if (storedDetails) {
      const currentData = JSON.parse(storedDetails);
      const updatedData = { ...currentData, ...modifiedData };

      localStorage.setItem(`recipeDetails_${idMeal}`, JSON.stringify(updatedData));
      setRecipeDetails(updatedData);
    }*/
  };

  // Fetch recipe details from API or local storage
  const fetchRecipeDetails = async () => {
    try {
      const storedDetails = localStorage.getItem(`recipeDetails_${idMeal}`);

      if (storedDetails) {
        setRecipeDetails(JSON.parse(storedDetails));
        setIsLoading(false);
      } else {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
        const data = response.data;

        localStorage.setItem(`recipeDetails_${idMeal}`, JSON.stringify(data));
        setRecipeDetails(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch recipe details:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
    updateLocalStorage();
  }, [idMeal]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!recipeDetails) {
    return <RecipeNotFound />;
  }

  return (
    <div className="appDiv">
      <div className="recipeDetails">
        <h1>{recipeDetails.meals[0].strMeal}</h1>
        <img
          src={recipeDetails.meals[0].strMealThumb}
          alt={recipeDetails.meals[0].strMeal}
          style={{ maxWidth: '40%', height: 'auto' }}
        />
        {recipeDetails.meals[0].strInstructions.split('.').map((sentence, index, array) => {
          const isStep = /Step \d+/.test(sentence);
          return (
            <p key={index}>
              {isStep ? <strong>{sentence}</strong> : sentence}
              {index < array.length - 1 ? '.' : ''}
            </p>
          );
        })}
        <Link className="homeLink" to="/">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetails;
