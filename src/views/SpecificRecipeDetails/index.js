import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import RecipeNotFound from '../../components/RecipeNotFound404';
import Loading from '../../components/Loading';
import '../../styles/app.css';
import countryCodesJson from '../Jsons/countryCodes.json';
import foodEmojisJson from '../Jsons/foodEmojis.json';
import categoryEmojisJson from '../Jsons/categoryEmojis.json';

const RecipeDetails = () => {
  const { idMeal } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [recipeInstructions, setRecipeInstructions] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [countryEmoji, setCountryEmoji] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const storedDetails = localStorage.getItem(`recipeDetails_${idMeal}`);
        if (storedDetails) {
          const parsedDetails = JSON.parse(storedDetails);
          if (parsedDetails.meals) {
            setRecipeDetails(parsedDetails);
          } else {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
            const data = response.data;

            if (data.meals && data.meals.length > 0) {
              localStorage.setItem(`recipeDetails_${idMeal}`, JSON.stringify(data));
              if (isMounted) {
                setRecipeDetails(data);
              }
            } else {
              if (isMounted) {
                setNotFound(true);
              }
            }
          }
        } else {
          const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
          const data = response.data;

          if (data.meals && data.meals.length > 0) {
            localStorage.setItem(`recipeDetails_${idMeal}`, JSON.stringify(data));
            if (isMounted) {
              setRecipeDetails(data);
            }
          } else {
            if (isMounted) {
              setNotFound(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch recipe details:', error);
        if (isMounted) {
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };


    fetchData();

    return () => {
      isMounted = false;
    };
  }, [idMeal]);

  useEffect(() => {
    if (recipeDetails && recipeDetails.meals && recipeDetails.meals[0]) {
      const ingredientsList = Object.keys(recipeDetails.meals[0])
        .filter(key => key.includes("strIngredient"))
        .map(key => recipeDetails.meals[0][key]);
      setIngredients(ingredientsList);

      const measuresList = Object.keys(recipeDetails.meals[0])
        .filter(key => key.includes("strMeasure"))
        .map(key => recipeDetails.meals[0][key]);
      setMeasures(measuresList);

      const recipeInstructionsInfo = Object.keys(recipeDetails.meals[0])
        .filter(key => key.includes("strInstructions"))
        .map(key => recipeDetails.meals[0][key]);

      const splitInstructions = recipeInstructionsInfo.reduce((acc, instruction) => {
        const firstNumberWithPeriod = instruction.match(/^\d+\./);
        if (firstNumberWithPeriod && !/^(0\.|1\.)/.test(firstNumberWithPeriod[0])) {
          return acc.concat(instruction.split('.'));
        } else {
          const splitted = firstNumberWithPeriod ? instruction.split(/(\d+\.(?:\s+)?)/i).filter(Boolean) : instruction.split('.');
          return acc.concat(splitted);
        }
      }, []);

      const combinedInstructions = [];
      for (let i = 0; i < splitInstructions.length; i++) {
        if (/\d/.test(splitInstructions[i])) {
          combinedInstructions.push(splitInstructions[i] + splitInstructions[i + 1]);
          i++;
        } else {
          combinedInstructions.push(splitInstructions[i]);
        }
      }
      setRecipeInstructions(combinedInstructions);

      setCountryEmoji(getFlagEmoji(countryCodes(recipeDetails.meals[0].strArea)));
      setCategoryEmoji(categoryEmojis(recipeDetails.meals[0].strCategory));
    }
  }, [recipeDetails]);

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

  const categoryEmojis = (categoryName) => {
    const categoryEmojis = categoryEmojisJson;
    const categoryCodeObject = categoryEmojis.find(category => category.name === categoryName);
    const categoryCode = categoryCodeObject ? categoryCodeObject.code : null;
    return categoryCode;
  };

  const getFlagEmoji = (countryCode) => {
    if (countryCode) {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
      return String.fromCodePoint(...codePoints);
    } else {
      return '';
    }
  };

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
      {(loading || notFound) && (
        <>
          {loading && <Loading/>}
          {notFound && <RecipeNotFound />}
        </>
       )}
        <div className="recipeDetails">
          {(!loading && !notFound) && (recipeDetails?.meals?.[0]?.strCategory || recipeDetails?.meals?.[0]?.strArea || recipeDetails?.meals?.[0]?.strYoutube) && (
            <>
              <h1>{countryEmoji} {recipeDetails?.meals?.[0]?.strMeal} {countryEmoji}</h1>
              <div className="tags">
                <div className="tagStyle">
                  <div className="divSpacing">
                    {categoryEmoji} {recipeDetails?.meals?.[0]?.strCategory}
                  </div>
                </div>
                <div className="tagStyle">
                  <div className="divSpacing">
                    {countryEmoji} {recipeDetails?.meals?.[0]?.strArea}
                  </div>
                </div>
                {recipeDetails?.meals?.[0]?.strYoutube && (
                  <a href={recipeDetails?.meals?.[0]?.strYoutube} target="_blank" rel="noopener noreferrer" className="tagStyle">
                    <div className="divSpacing">
                      📺 Recipe Video
                    </div>
                  </a>
                )}
              </div>

              <div className="foodIngredients">
                <div className="foodImageDiv">
                  <img
                    src={recipeDetails?.meals?.[0]?.strMealThumb}
                    alt={recipeDetails?.meals?.[0]?.strMeal}
                    className="imageSrc"
                  />
                </div>

                <div className="ingredientsListDiv">
                  <div className="ingredientsListDesign">
                    <h2>Ingredients</h2>
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

              <div className="instructions">
                <h2>Instructions</h2>
                <ul>
                  {recipeInstructions.map((item, index) => (
                    item && (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );

};

export default RecipeDetails;
