import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link} from 'react-router-dom';
//import RecipeNotFound from '../../components/RecipeNotFound404';
import '../../styles/app.css';
import countryCodesJson from '../Jsons/countryCodes.json';
import foodEmojisJson from '../Jsons/foodEmojis.json';

const RecipeDetails = () => {
  const { idMeal } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [countryEmoji, setCountryEmoji] = useState('');

  const fetchRecipeDetails = useCallback(async () => {
    try {
      const storedDetails = localStorage.getItem(`recipeDetails_${idMeal}`);
      if (storedDetails) {
        setRecipeDetails(JSON.parse(storedDetails));
      } else {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
        const data = response.data;

        localStorage.setItem(`recipeDetails_${idMeal}`, JSON.stringify(data));
        setRecipeDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch recipe details:', error);
    }
  }, [idMeal]);

  const getInformation = useCallback(() => {
    if (recipeDetails && recipeDetails.meals && recipeDetails.meals[0]) {
      const ingredientsList = Object.keys(recipeDetails.meals[0])
        .filter(key => key.includes("strIngredient"))
        .map(key => recipeDetails.meals[0][key]);
      setIngredients(ingredientsList);

      //strMeasure1
      const measuresList = Object.keys(recipeDetails.meals[0])
        .filter(key => key.includes("strMeasure"))
        .map(key => recipeDetails.meals[0][key]);
      setMeasures(measuresList);
    } else {
      console.warn("Recipe details are not available yet.");
    }
  },[recipeDetails]);

  const countryCodes = (countryName) => {
    const countryCodes = countryCodesJson;
    const countryCodeObject = countryCodes.find(country => country.name === countryName);
    const countryCode = countryCodeObject ? countryCodeObject.code : null;
    return countryCode;
  };

  const foodEmojis = (ingredientName) => {
    const foodCodes = foodEmojisJson;
    const ingredientEmojiObject = foodCodes.find(ingredient => ingredientName.toLowerCase().includes(ingredient.name.toLowerCase()));
    const ingredientCode = ingredientEmojiObject ? ingredientEmojiObject.code : null;
    return ingredientCode;
  };

  const getFlagEmoji = (countryCode) => {
    if (countryCode) {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt());
      return String.fromCodePoint(...codePoints);
    } else {
      return '';
    }
  }

 useEffect(() => {
  fetchRecipeDetails();
}, [idMeal,fetchRecipeDetails]);

useEffect(() => {
  getInformation();
  setCountryEmoji(getFlagEmoji(countryCodes(recipeDetails?.meals?.[0]?.strArea)));
  console.log(recipeDetails);
  //strMeasure1
}, [recipeDetails,getInformation]);

  return (
    <>
    <div className="appDiv2">
      <div className="recipeDetails2">
        <Link className="homeLink" to="/">
          View all Recipes
        </Link>
        </div>
    </div>
    <div className="appDiv">
      <div className="recipeDetails">
        <h1>{countryEmoji} {recipeDetails?.meals?.[0]?.strMeal || "Loading..."} {countryEmoji}</h1>
        <div className="foodIngredients">
          <div className="foodImageDiv">
            <img
              src={recipeDetails?.meals?.[0]?.strMealThumb}
              alt={recipeDetails?.meals?.[0]?.strMeal}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="ingredientsListDiv">
            <div className="ingredientsListDesign">
              <h3>Ingredients</h3>
                <ul>
                {ingredients.map((item, index) => (
                  item && (
                    <li key={index}>
                      {foodEmojis(item)} {measures[index]} {item}
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </div>
        <h1>Instructions</h1>
        <div className="instructions">
          {recipeDetails?.meals?.[0]?.strInstructions.split('.').map((sentence, index, array) => {
            const isStep = /Step \d+/.test(sentence);
            return (
              <p key={index}>
                {isStep ? <strong>{sentence}</strong> : sentence}
                {index < array.length - 1 ? '.' : ''}
              </p>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default RecipeDetails;
