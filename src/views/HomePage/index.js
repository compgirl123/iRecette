import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../../styles/app.css';
import { Link } from 'react-router-dom';
import Filters from '../../components/Filters';
import Button from '../../components/Button';

const HomePage = () => {
  const [originalRecipesList, setOriginalRecipesList] = useState([]);
  const [filteredRecipesList, setFilteredRecipesList] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const test = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedCountry('');

    const storedRecipes = JSON.parse(localStorage.getItem('recipes'));
    const randomInt = Math.floor(Math.random() * 301);
    const randomRecipe = storedRecipes[randomInt];

    if (randomRecipe) {
      setFilteredRecipesList([randomRecipe]);
    }

    //setRandomClicked(true);
  };

  const getListOfRecipes = useCallback(async () => {
    const getRecipes = async () => {
      const storedRecipes = localStorage.getItem('recipes');

      if (storedRecipes) {
        return JSON.parse(storedRecipes);
      }

      try {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const uniqueMealIds = new Set();
        const meals = [];

        for (const letter of alphabet) {
          const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);

          if (response.status === 200) {
            const data = response.data;
            if (data.meals) {
              data.meals.forEach((meal) => {
                if (!uniqueMealIds.has(meal.idMeal)) {
                  uniqueMealIds.add(meal.idMeal);
                  meals.push(meal);
                }
              });
            }
          } else {
            console.error(`Error fetching data for letter ${letter}`);
          }
        }
        meals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
        localStorage.setItem('recipes', JSON.stringify(meals));
        return meals;
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    try {
      const recipesList = await getRecipes();
      if (recipesList && recipesList.length > 0) {
        setOriginalRecipesList(recipesList);
        setFilteredRecipesList(recipesList);
      }
    } catch (error) {
      console.error('Error fetching recipes list:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListOfRecipes();
  }, [getListOfRecipes]);

  const categoryOptions = useCallback((recipesList) => {
    const uniqueNamesSet = new Set();

    recipesList.forEach((item) => {
      uniqueNamesSet.add(item.strCategory);
    });

    const uniqueNamesArray = Array.from(uniqueNamesSet).sort((a, b) => a.localeCompare(b));
    return uniqueNamesArray;
  }, []);

  const countryOptions = useCallback((recipesList) => {
    const uniqueNamesSet = new Set();

    recipesList.forEach((item) => {
      uniqueNamesSet.add(item.strArea);
    });

    const uniqueNamesArray = Array.from(uniqueNamesSet).sort((a, b) => a.localeCompare(b));
    return uniqueNamesArray;
  }, []);

  const filterRecipes = useCallback(() => {
    let filteredList = [...originalRecipesList];

    if (search !== '') {
      filteredList = filteredList.filter((item) => item.strMeal.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedCategory !== '') {
      filteredList = filteredList.filter((item) => item.strCategory.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedCountry !== '') {
      filteredList = filteredList.filter((item) => item.strArea.toLowerCase() === selectedCountry.toLowerCase());
    }

    setFilteredRecipesList(filteredList);
  }, [search, selectedCategory, selectedCountry, originalRecipesList]);

  useEffect(() => {
    filterRecipes();
  }, [filterRecipes]);

  return (
    <div>
      <div className="filtersDiv">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search recipe by name..."
          className="searchInput"
        />
      </div>
      <div className="filtersDiv">
        <Filters
          selectedOption={selectedCategory}
          handleOptionChange={handleCategoryChange}
          options={categoryOptions(originalRecipesList)}
          defaultLabel="All Food Categories"
        />
        <Filters
          selectedOption={selectedCountry}
          handleOptionChange={handleCountryChange}
          options={countryOptions(originalRecipesList)}
          defaultLabel="All Food Countries"
        />
      </div>
      <div className="filtersDiv">
       <Button label={"Surprise Me 🎉"} onClick={test}>otto</Button>
      </div>
      <h2>🍝Here are a list of {filteredRecipesList.length} recipe{filteredRecipesList.length > 1 ? ("s"):(" ...")}🍴</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="homePageListOfrecipes">
          {filteredRecipesList.length > 0 ? (
            filteredRecipesList.map((recipe, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                className=  {filteredRecipesList.length === 1 ? "recipesListStyle2" : "recipesListStyle"}
              >
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="imageStyle"
                />
                <div className="seeMoreDiv">
                  {hoverIndex === index ? (
                    <>
                      <Link to={{ pathname: `/details/${recipe.idMeal}`, state: { countries: [...countryOptions(originalRecipesList)] } }}>
                        <h1 className="seeMoreTextColor">See more</h1>
                      </Link>
                    </>
                  ) : (
                    <>
                      <h1>{recipe.strMeal}</h1>
                      <h2>
                        <strong>{recipe.strArea}</strong>
                      </h2>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <h2>No Results</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
